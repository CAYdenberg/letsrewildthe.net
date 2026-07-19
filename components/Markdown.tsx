// deno-lint-ignore-file react-no-danger

import { MdastNodeTy } from "@lps/volcano";
import { Fragment, FunctionComponent } from "preact";

interface Props {
  node: MdastNodeTy.MdastNode;
  id?: string;
  suppressShortcodes?: boolean;
}

export const Markdown: FunctionComponent<Props> = (
  { node, id, suppressShortcodes },
) => {
  if (node.type === "text") {
    return <span>{node.value}</span>;
  }
  if (node.type === "inlineCode") {
    return <code>{node.value}</code>;
  }

  // deno-lint-ignore no-explicit-any
  const children: MdastNodeTy.MdastNode[] | undefined = (node as any).children;
  const childNodes = children?.map((child, idx) => (
    <Markdown
      key={idx}
      node={child}
      id={node.type === "root" ? `block-${idx}` : undefined}
      suppressShortcodes={suppressShortcodes}
    />
  ));

  switch (node.type) {
    case "root": {
      return <Fragment>{childNodes}</Fragment>;
    }

    case "heading": {
      switch (node.depth) {
        case 3:
          return <h3 id={id}>{childNodes}</h3>;
        case 4:
          return <h4 id={id}>{childNodes}</h4>;
        case 5:
          return <h5 id={id}>{childNodes}</h5>;
        case 6:
          return <h6 id={id}>{childNodes}</h6>;
      }
      return <h2 id={id}>{childNodes}</h2>;
    }

    case "paragraph": {
      if (children?.length === 1 && children[0].type === "shortcode") {
        return <Fragment>{childNodes}</Fragment>;
      }
      return <p id={id}>{childNodes}</p>;
    }

    case "link": {
      return <a href={node.url}>{childNodes}</a>;
    }

    case "code": {
      if (!node.html) return null;
      return (
        <pre id={id} data-lang={node.lang} className={`language-${node.lang}`}>
            <code
              dangerouslySetInnerHTML={{
                __html: node.html,
              }}
            />
        </pre>
      );
    }

    case "list": {
      return node.ordered ? <ol>{childNodes}</ol> : <ul>{childNodes}</ul>;
    }

    case "listItem": {
      return <li>{childNodes}</li>;
    }

    case "blockquote": {
      return <blockquote>{childNodes}</blockquote>;
    }

    case "thematicBreak": {
      return <hr />;
    }

    case "emphasis": {
      return <em>{childNodes}</em>;
    }

    case "strong": {
      return <strong>{childNodes}</strong>;
    }

    case "image": {
      return <img src={node.url} alt={node.alt} />;
    }

    case "shortcode": {
      if (suppressShortcodes) return null;

      const { _type, name, ...props } = node;
      const Component = Shortcodes[name];
      if (!Component) {
        return (
          <div class="text-center">
            <strong>- shortcode: {node.name} -</strong>
          </div>
        );
      }
      return <Component {...props} />;
    }
  }

  return null;
};

// deno-lint-ignore no-explicit-any
const Shortcodes: Record<string, FunctionComponent<any>> = {};
