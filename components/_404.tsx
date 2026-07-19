import { HeroFullScreen } from "../islands/Hero.tsx";
import { Page } from "@/components/Page.tsx";

interface PageProps {
  url: URL;
}

export default function Error404({ url }: PageProps) {
  return (
    <Page url={url}>
      <HeroFullScreen>
        <h1 class="text-4xl font-bold text-success">
          404
        </h1>
        <p class="my-4">
          Not all those who wonder the internet are lost.
        </p>
        <p class="mt-4">
          <a class="text-xl underline" href="/">Back home</a>
        </p>
      </HeroFullScreen>
    </Page>
  );
}
