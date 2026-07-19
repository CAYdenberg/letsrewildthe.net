import { Head } from "fresh/runtime";
import { ComponentChildren, Fragment } from "preact";
import { CONFIG as config } from "../config.ts";

interface PageProps {
  url: URL | string | null;
  pageTitle?: string;
  pageDescription?: string;
  pageSocialImage?: string | null;
  children: ComponentChildren;
}

function getOneMember<T>(items: T | T[]): T {
  if (Array.isArray(items)) {
    return items[Math.floor(Math.random() * items.length)];
  }

  return items;
}

export function Page(props: PageProps) {
  const title = props.pageTitle
    ? `${props.pageTitle} | ${config.siteTitle}`
    : config.siteTitle;

  const url = typeof props.url === "string" ? new URL(props.url) : props.url;

  const description = props.pageDescription || config.siteDescription;

  const canonical = `${config.siteUrl}${url?.pathname}`;

  const image: string | undefined = getOneMember(
    props.pageSocialImage || config.siteDefaultPostImage,
  );

  return (
    <Fragment>
      <Head>
        <title>{title}</title>

        <meta name="description" content={description} />

        {props.url ? <link rel="canonical" href={canonical} /> : null}

        <link rel="alternate" type="application/json" href="/feed.json" />
        <link rel="shortcut icon" href="/favicon.svg" type="image/x-icon" />

        <meta name="og:type" content="website" />
        <meta name="og:title" content={title} />
        <meta name="og:url" content={canonical} />
        <meta name="og:description" content={description} />
        {image
          ? (
            <Fragment>
              <meta
                name="og:image"
                content={`${config.siteUrl}/image/${image}?width=og`}
              />
              <meta name="og:image:alt" content={description} />
            </Fragment>
          )
          : null}

        <meta name="twitter:card" content="summary_large_image" />
        <meta property="twitter:domain" content={config.siteUrl} />
        <meta property="twitter:url" content={canonical} />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
        {image
          ? (
            <Fragment>
              <meta
                name="twitter:image"
                content={`${config.siteUrl}/image/${image}?width=og`}
              />
            </Fragment>
          )
          : null}
      </Head>
      {props.children}
    </Fragment>
  );
}
