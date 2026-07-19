import { HttpError } from "fresh";
import { Markdown } from "@/components/Markdown.tsx";
import { define } from "../../utils.ts";
import { postModel } from "../../lib/vault.ts";

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

export default define.page<typeof handler>(function ({ data, url }) {
  const { metadata, content } = data;

  return <Markdown node={content} />;
});
