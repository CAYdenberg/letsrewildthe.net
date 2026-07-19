import { App, HttpError, staticFiles } from "fresh";
import { type State } from "./utils.ts";
// @ts-types="preact"
import { h } from "preact";
import Error404 from "@/components/_404.tsx";

export const app = new App<State>();

app.use(staticFiles());

app.onError("*", (ctx) => {
  if (ctx.error instanceof HttpError) {
    if (ctx.error.status === 404) {
      return ctx.render(h(Error404, { url: ctx.url }), {
        status: 404,
      });
    }
    return new Response(ctx.error.message, {
      status: ctx.error.status,
      headers: {
        "Content-Type": "text/plain",
      },
    });
  }

  console.error(ctx.error);
  return new Response("Server Error", {
    status: 500,
    headers: {
      "Content-Type": "text/plain",
    },
  });
});

// Include file-system based routes here
app.fsRoutes();
