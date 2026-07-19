import { define } from "../utils.ts";
import { postModel } from "../lib/vault.ts";
import { paginate } from "../lib/pagination.ts";
import { CONFIG } from "../config.ts";
import { renderToString } from "preact-render-to-string";
import { Markdown } from "../components/Markdown.tsx";

export const handler = define.handlers({
  async GET(ctx) {
    const allPosts = await postModel.all();

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

    const items = await Promise.all(posts.map(async (post) => {
      const metadata = await postModel.get(post.slug);
      const content = await postModel.getContent(post.slug);
      const text = await postModel.getText(post.slug);
      return { post, metadata, content, text };
    }));

    // TODO: content_html: preact render to string; remove whitespace and escape
    // line endings (JSON.stringify may do that automatically?)
    const feed = {
      version: "https://jsonfeed.org/version/1",
      title: CONFIG.siteTitle,
      home_page_url: CONFIG.siteUrl,
      feed_url: `${CONFIG.siteUrl}/feed.json`,
      description: CONFIG.siteDescription,
      favicon: `${CONFIG.siteUrl}/favicon.ico`,
      next_url: posts.length < 20 ? undefined : paged.url.next,
      items: items.map(({ post, metadata, content, text }) => {
        if (!metadata || !content) return null;

        return {
          id: post.slug,
          url: `${CONFIG.siteUrl}/blog/${post.slug}`,
          title: post.title,
          content_text: text,
          content_html: content
            ? renderToString(
              <Markdown node={content} suppressShortcodes />,
            )
            : null,
          summary: metadata.frontmatter.summary || text?.slice(0, 240),
          image: metadata.frontmatter.image,
          banner_image: metadata.frontmatter.banner_image,
          date_published: metadata.frontmatter.date_published.toISOString(),
        };
      }),
    };

    return new Response(JSON.stringify(feed), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  },
});
