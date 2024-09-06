import { Link } from "@futurebrand/components";
import parse, {
  type DOMNode,
  domToReact,
  type HTMLReactParserOptions,
} from "html-react-parser";
import React from "react";

const siteUrl = process.env.siteUrl;

const options: HTMLReactParserOptions = {
  replace(domNode) {
    if (domNode.type === "tag" && domNode.name === "a" && domNode.children) {
      const href = domNode.attribs?.href;

      if (!href) {
        return <p>{domToReact(domNode.children as DOMNode[], options)}</p>;
      }

      delete domNode.attribs.rel;
      delete domNode.attribs.target;

      const isSameOrigin =
        href.startsWith(siteUrl) ||
        href.startsWith("/") ||
        href.startsWith("#");

      return (
        <Link
          {...domNode.attribs}
          href={href}
          name="rich-text-link"
          blank={!isSameOrigin}
        >
          {domToReact(domNode.children as DOMNode[], options)}
        </Link>
      );
    }
  },
};

export function parseHtml(html: string) {
  if (!html) {
    return null;
  }

  return parse(html, options);
}
