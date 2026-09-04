import { Fragment } from "react";

// Deliberately minimal — supports just enough markdown for blog articles
// (##/### headings, paragraphs, **bold**, *italic*, [text](url) links, and
// "- " bullet lists) without pulling in a markdown dependency before launch.
function renderInline(text: string, keyPrefix: string): React.ReactNode[] {
  const parts: React.ReactNode[] = [];
  const pattern = /\*\*(.+?)\*\*|\*(.+?)\*|\[(.+?)\]\((.+?)\)/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  let i = 0;

  while ((match = pattern.exec(text))) {
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index));
    }
    const key = `${keyPrefix}-${i++}`;
    if (match[1] !== undefined) {
      parts.push(<strong key={key}>{match[1]}</strong>);
    } else if (match[2] !== undefined) {
      parts.push(<em key={key}>{match[2]}</em>);
    } else if (match[3] !== undefined) {
      parts.push(
        <a
          key={key}
          href={match[4]}
          className="underline underline-offset-2"
          target="_blank"
          rel="noopener noreferrer"
        >
          {match[3]}
        </a>,
      );
    }
    lastIndex = pattern.lastIndex;
  }
  if (lastIndex < text.length) parts.push(text.slice(lastIndex));
  return parts;
}

export function renderMarkdown(markdown: string): React.ReactNode {
  const lines = markdown.replace(/\r\n/g, "\n").split("\n");
  const blocks: React.ReactNode[] = [];
  let paragraph: string[] = [];
  let listItems: string[] = [];

  function flushParagraph(key: string) {
    if (paragraph.length === 0) return;
    blocks.push(<p key={key}>{renderInline(paragraph.join(" "), key)}</p>);
    paragraph = [];
  }

  function flushList(key: string) {
    if (listItems.length === 0) return;
    blocks.push(
      <ul key={key}>
        {listItems.map((item, i) => (
          <li key={`${key}-${i}`}>{renderInline(item, `${key}-${i}`)}</li>
        ))}
      </ul>,
    );
    listItems = [];
  }

  lines.forEach((line, i) => {
    const key = `b-${i}`;
    const trimmed = line.trim();

    if (trimmed === "") {
      flushParagraph(key);
      flushList(key);
      return;
    }

    const heading = /^(#{2,3})\s+(.*)$/.exec(trimmed);
    if (heading) {
      flushParagraph(key);
      flushList(key);
      const Tag = heading[1].length === 2 ? "h2" : "h3";
      blocks.push(<Tag key={key}>{renderInline(heading[2], key)}</Tag>);
      return;
    }

    const image = /^!\[(.*?)\]\((.+?)\)$/.exec(trimmed);
    if (image) {
      flushParagraph(key);
      flushList(key);
      blocks.push(
        // eslint-disable-next-line @next/next/no-img-element -- admin-uploaded remote URLs from Supabase Storage, not a local/optimizable asset.
        <img
          key={key}
          src={image[2]}
          alt={image[1]}
          className="w-full rounded-md"
        />,
      );
      return;
    }

    if (/^-\s+/.test(trimmed)) {
      flushParagraph(key);
      listItems.push(trimmed.replace(/^-\s+/, ""));
      return;
    }

    flushList(key);
    paragraph.push(trimmed);
  });
  flushParagraph("last");
  flushList("last-list");

  return <Fragment>{blocks}</Fragment>;
}
