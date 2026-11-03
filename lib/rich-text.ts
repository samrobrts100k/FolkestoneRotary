/**
 * The simple formatting used in news articles (and event descriptions), stored as plain text so no database
 * change is needed and older articles still read as paragraphs.
 *
 *   ## Heading            ### Smaller heading
 *   **bold**  *italic*    [link text](https://… or /page or mailto:… or tel:…)
 *   - bullet              1. numbered
 *   > quote               ---  (a dividing line)
 *   ![description](https://…photo)   one per line; photos on consecutive lines form a gallery
 *
 * A blank line starts a new paragraph. Nothing here becomes raw HTML, so pasted text can't break the page.
 */
export type Inline = { t: "text"; v: string } | { t: "b"; c: Inline[] } | { t: "i"; c: Inline[] } | { t: "a"; href: string; c: Inline[] } | { t: "br" };
export interface RichImage { url: string; alt: string }
export type Block =
  | { t: "p"; c: Inline[] } | { t: "h2"; c: Inline[] } | { t: "h3"; c: Inline[] }
  | { t: "ul"; items: Inline[][] } | { t: "ol"; items: Inline[][] } | { t: "quote"; c: Inline[] }
  | { t: "hr" } | { t: "images"; images: RichImage[] };

/** Links: a page on this site, an https address, an email or a phone number. */
export const okHref = (u: string) => /^(\/(?!\/)|https:\/\/|mailto:|tel:)[^\s"'<>]*$/.test(u);
const okSrc = (u: string) => /^(https:\/\/|\/(?!\/))[^\s"'<>]*$/.test(u);
const IMG = /^!\[([^\]]*)\]\(([^)\s]+)\)$/;

/** Bold, italic and links within a line. Anything that doesn't parse stays as plain text. */
export function parseInline(s: string): Inline[] {
  const out: Inline[] = [];
  let buf = "";
  const flush = () => { if (buf) { out.push({ t: "text", v: buf }); buf = ""; } };
  for (let i = 0; i < s.length;) {
    const rest = s.slice(i);
    let m: RegExpExecArray | null;
    if ((m = /^\*\*(.+?)\*\*/.exec(rest))) { flush(); out.push({ t: "b", c: parseInline(m[1]) }); i += m[0].length; continue; }
    if ((m = /^(\*|_)(?!\s)(.+?)(?<!\s)\1/.exec(rest))) { flush(); out.push({ t: "i", c: parseInline(m[2]) }); i += m[0].length; continue; }
    if ((m = /^\[([^\]]+)\]\(([^)\s]+)\)/.exec(rest)) && okHref(m[2])) { flush(); out.push({ t: "a", href: m[2], c: parseInline(m[1]) }); i += m[0].length; continue; }
    buf += s[i++];
  }
  flush();
  return out;
}

export function parseRich(text: string): Block[] {
  const lines = (text ?? "").replace(/\r\n?/g, "\n").split("\n");
  const blocks: Block[] = [];
  let para: string[] = [];
  const endPara = () => {
    if (!para.length) return;
    const c: Inline[] = [];
    para.forEach((l, k) => { if (k) c.push({ t: "br" }); c.push(...parseInline(l)); });
    blocks.push({ t: "p", c }); para = [];
  };
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) { endPara(); continue; }
    let m: RegExpExecArray | null;
    if ((m = /^(#{2,3})\s+(.+)$/.exec(line))) { endPara(); blocks.push({ t: m[1].length === 2 ? "h2" : "h3", c: parseInline(m[2]) }); continue; }
    if (/^(-{3,}|\*{3,})$/.test(line)) { endPara(); blocks.push({ t: "hr" }); continue; }
    if (IMG.test(line)) {
      endPara();
      const images: RichImage[] = [];
      for (; i < lines.length && (m = IMG.exec(lines[i].trim())); i++) if (okSrc(m[2])) images.push({ url: m[2], alt: m[1].trim() });
      i--;
      if (images.length) blocks.push({ t: "images", images });
      continue;
    }
    if (/^[-*]\s+/.test(line) || /^\d+[.)]\s+/.test(line)) {
      endPara();
      const ordered = /^\d/.test(line), re = ordered ? /^\d+[.)]\s+(.*)$/ : /^[-*]\s+(.*)$/;
      const items: Inline[][] = [];
      for (; i < lines.length && (m = re.exec(lines[i].trim())); i++) items.push(parseInline(m[1]));
      i--;
      blocks.push({ t: ordered ? "ol" : "ul", items });
      continue;
    }
    if (line.startsWith(">")) {
      endPara();
      const q: string[] = [];
      for (; i < lines.length && lines[i].trim().startsWith(">"); i++) q.push(lines[i].trim().replace(/^>\s?/, ""));
      i--;
      const c: Inline[] = [];
      q.forEach((l, k) => { if (k) c.push({ t: "br" }); c.push(...parseInline(l)); });
      blocks.push({ t: "quote", c });
      continue;
    }
    para.push(line);
  }
  endPara();
  return blocks;
}

/** The words only, for reading time and search results. */
export function plainText(text: string): string {
  const inl = (c: Inline[]): string => c.map((x) => (x.t === "text" ? x.v : x.t === "br" ? " " : "c" in x ? inl(x.c) : "")).join("");
  return parseRich(text).map((b) => (b.t === "ul" || b.t === "ol" ? b.items.map(inl).join(" ") : b.t === "hr" || b.t === "images" ? "" : inl(b.c))).filter(Boolean).join("\n\n");
}

/** Photos in the text, e.g. for a search engine's image list. */
export const richImages = (text: string) => parseRich(text).flatMap((b) => (b.t === "images" ? b.images : []));
