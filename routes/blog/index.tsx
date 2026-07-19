import { define } from "../../utils.ts";
import { postModel } from "../../lib/vault.ts";
import { paginate } from "../../lib/pagination.ts";
import { Page } from "@/components/Page.tsx";
import { Paginator } from "@/components/Paginator.tsx";

export const handler = define.handlers({
  async GET(ctx) {
    const allPosts = await postModel.all();

    console.log(allPosts.map((post) => post.frontmatter.date_published));

    const sortedPosts = allPosts.filter((post) =>
      !!post.frontmatter.date_published.getTime()
    ).sort((a, b) =>
      b.frontmatter.date_published.getTime() -
      a.frontmatter.date_published.getTime()
    );

    const paged = paginate(10, sortedPosts.length)(ctx.req.url);
    const posts = sortedPosts.slice(
      paged.params.skip,
      paged.params.skip + paged.params.limit,
    );

    return { data: { posts, pagination: paged } };
  },
});

export default define.page<typeof handler>(function BlogPage(
  { url, data },
) {
  const { posts, pagination } = data;

  return (
    <Page url={url} pageTitle="Blog">
      <div class="container max-w-3xl mx-auto">
        <h1 class="text-info text-2xl font-bold my-4">
          Blog
        </h1>

        <hr className="my-4" />

        {posts.map((post) => (
          <a key={post.slug} class="block my-2" href={`/blog/${post.slug}`}>
            <h3 class="text-primary text-xl">{post.title}</h3>
            <p class="text-sm/tight">{post.frontmatter.summary}</p>
          </a>
        ))}

        <hr className="my-4" />

        <Paginator
          {...pagination}
          className={{
            root: "flex flex-row items-center",
            button: "text-md text-info",
            disabledButton: "opacity-50",
            text: "m-0 grow text-center",
          }}
        />
      </div>
    </Page>
  );
});
