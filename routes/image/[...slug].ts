import { parse } from "@planigale/querystring";
import { define } from "../../utils.ts";
import z from "@zod/zod";
import { vault } from "../../lib/vault.ts";
import { HttpError } from "fresh";

export const handler = define.handlers({
  async GET(ctx) {
    const urlParts = new URL(ctx.req.url);
    const params = parse(urlParts.search);

    let neededWidth: number | undefined;
    const parsed = z.coerce.number().safeParse(params.width);
    if (parsed.success) {
      neededWidth = Math.ceil(parsed.data / 100) * 100;
    }

    const data = await vault.attachment(
      ctx.params.slug,
      neededWidth,
    );

    if (!data) {
      throw new HttpError(404);
    }

    return new Response(data, {
      status: 200,
      headers: {
        "content-type": data.type,
      },
    });
  },
});
