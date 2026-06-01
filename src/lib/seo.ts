const SITE = "https://careertwinos.lovable.app";

export function routeHead({
  path,
  title,
  description,
  serviceName,
}: {
  path: string;
  title: string;
  description: string;
  serviceName?: string;
}) {
  const url = `${SITE}${path}`;
  const meta: Array<Record<string, string>> = [
    { title },
    { name: "description", content: description },
    { property: "og:title", content: title },
    { property: "og:description", content: description },
    { property: "og:url", content: url },
    { property: "og:type", content: path === "/" ? "website" : "article" },
    { name: "twitter:title", content: title },
    { name: "twitter:description", content: description },
  ];
  const links = [{ rel: "canonical", href: url }];
  const scripts = serviceName
    ? [
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Service",
            name: serviceName,
            description,
            url,
            provider: {
              "@type": "Organization",
              name: "CareerOS",
              url: SITE,
            },
          }),
        },
      ]
    : undefined;
  return scripts ? { meta, links, scripts } : { meta, links };
}
