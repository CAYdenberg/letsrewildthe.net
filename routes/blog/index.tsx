import { define } from "../../utils.ts";
import { postModel } from "../../lib/vault.ts";
import { paginate } from "../../lib/pagination.ts";

export const handler = define.handlers({
  async GET(ctx) {
    const allPosts = await postModel.all();

    const sortedPosts = allPosts.slice().sort((a, b) =>
      b.frontmatter.date_published.getTime() -
      a.frontmatter.date_published.getTime()
    );

    const paged = paginate(10, sortedPosts.length)(ctx.req.url);
    const posts = sortedPosts.slice(
      paged.params.skip,
      paged.params.skip + paged.params.limit,
    );

    return { data: { posts, paged } };
  },
});

export default define.page<typeof handler>(function ({ data, url }) {
  const { paged, posts } = data;

  const title = paged.params.skip ? `Blog (page ${paged.page})` : "Blog";

  return (
    <ul>
      {posts.map((post) => (
        <li key={post.slug}>
          <a href={`blog/${post.slug}`}>
            {post.title}
          </a>
        </li>
      ))}
    </ul>
  );
});
