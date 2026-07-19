import { HttpError } from "fresh";
import { Markdown } from "@/components/Markdown.tsx";
import { define } from "../../utils.ts";
import { postModel } from "../../lib/vault.ts";
import { Page } from "@/components/Page.tsx";
import { BannerImage } from "@/islands/BannerImage.tsx";
import { ArrowLeft, Icon } from "@/components/icons.tsx";
import { postDate } from "@/lib/formatters.ts";

export const handler = define.handlers({
  async GET(ctx) {
    const metadata = await postModel.get(ctx.params.slug);
    const content = await postModel.getContent(ctx.params.slug);

    if (!content || !metadata) {
      throw new HttpError(404);
    }

    return { data: { metadata, content } };
  },
});

export default define.page<typeof handler>(
  function PostPage({ url, data }) {
    const { metadata, content } = data;

    return (
      <Page
        url={url}
        pageTitle="Blog"
        pageDescription={metadata.frontmatter.summary}
        pageSocialImage={metadata.frontmatter.image}
      >
        <BannerImage
          src={metadata.frontmatter.banner_image}
          alt={`Banner image for ${metadata.title}`}
        />
        <div class="container max-w-3xl mx-auto">
          <p class="text-xs font-bold my-4  flex flex-row items-center">
            <a href="/blog">
              <Icon icon={ArrowLeft} className="mr-2 inline" />
              <span class="align-text-top">Blog</span>
            </a>
          </p>

          <h1 class="text-info text-2xl font-bold my-4">
            {metadata.title}
          </h1>
          <p class="text-xs font-bold my-4">
            {postDate(metadata.frontmatter.date_published)}
          </p>

          <hr className="my-8" />

          <div className="content">
            <Markdown node={content} />
          </div>

          <hr className="my-4" />

          <p class="text-xs font-bold my-4">
            <a href="/blog">
              <Icon icon={ArrowLeft} className="mr-2 inline" />
              <span>Blog</span>
            </a>
          </p>
        </div>
      </Page>
    );
  },
);
