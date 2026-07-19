import { openVault } from "@lps/volcano";
import * as path from "@std/path";
import z from "@zod/zod";

export const vault = await openVault({
  path: path.join(Deno.cwd(), "content"),
  attachmentCachePath: path.join(Deno.cwd(), "_fresh", "volcano"),
  log: "build",
});

const postSchema = z.object({
  title: z.string().optional(),
  summary: z.string().optional(),
  image: z.string().nullable().optional(),
  banner_image: z.string().nullable().optional(),
  date_published: z.coerce.date(),
  external_url: z.string().nullable().optional(),
});

export const postModel = vault.createModel<z.infer<typeof postSchema>>(
  "Post",
  postSchema,
);
