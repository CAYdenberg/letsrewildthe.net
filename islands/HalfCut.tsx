import { FunctionComponent } from "preact";
import { ImgLazy } from "./ImgLazy.tsx";

interface Props {
  slug: string;
  alt: string;
  reverse?: boolean;
}

export const HalfCut: FunctionComponent<Props> = (
  { slug, alt, reverse, children },
) => {
  return (
    <div
      class={`sm:flex flex-row items-stretch ${reverse && "flex-row-reverse"}`}
    >
      <div class="sm:w-[50%] bg-dark shrink-0 grow">
        <ImgLazy
          src={`/image/${slug}`}
          alt={alt}
          className="object-cover w-full h-37.5 sm:h-full"
        />
      </div>
      <div class="p-8 grow-0">
        {children}
      </div>
    </div>
  );
};
