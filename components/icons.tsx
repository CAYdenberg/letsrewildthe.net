import type { LucideProps } from "npm:lucide-preact@0.525.0";
// @ts-types="preact"
import { FunctionComponent } from "preact";

export { ArrowLeft } from "lucide-preact";
export { ArrowRight } from "lucide-preact";
export { ChevronFirst } from "lucide-preact";
export { ChevronLast } from "lucide-preact";
export { ChevronLeft } from "lucide-preact";
export { ChevronRight } from "lucide-preact";

interface Props {
  // deno-lint-ignore no-explicit-any
  icon: any;
  className?: string;
}

export const Icon: FunctionComponent<Props & LucideProps> = (props) => {
  const LucideComponent = props.icon;

  return (
    <i className={props.className}>
      <LucideComponent {...props} />
    </i>
  );
};
