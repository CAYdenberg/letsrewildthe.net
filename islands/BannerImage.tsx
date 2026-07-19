import { useWindowWidth } from "../lib/useWindowWidth.ts";
import type { FunctionComponent } from "preact";

interface Props {
  src?: string | null;
  alt?: string;
}

export const BannerImage: FunctionComponent<Props> = ({ src, alt }) => {
  const width = useWindowWidth();

  if (!src) return null;

  return (
    <img
      src={width ? `${src}?width=${width}` : src}
      alt={alt}
      className="max-h-32 w-full object-cover"
    />
  );
};
