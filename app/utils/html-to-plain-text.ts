export default (html: string) => {
  if (!html) return "";

  let s = String(html);

  /* Kill comments */
  s = s.replace(/<!--[\s\S]*?-->/g, "");

  /* Remove dangerous/irrelevant blocks entirely (with contents) */
  const dropBlocks = [
    "script","style","noscript","template","iframe","object","embed","svg","math",
    "video","audio","picture","source","track","figure","figcaption"
  ];
  for (const tag of dropBlocks) {
    const re = new RegExp(`<${tag}\\b[\\s\\S]*?<\\/${tag}>`, "gi");
    s = s.replace(re, "");
  }

  /* Remove self-closing media tags (e.g., <img .../>) */
  s = s.replace(/<img\b[^>]*>/gi, "");

  /* Insert line breaks for block-ish boundaries so words don’t stick */
  s = s
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/(p|div|section|article|header|footer|li|ul|ol|h[1-6]|blockquote|tr)>/gi, "\n");

  /* Strip any remaining tags */
  s = s.replace(/<[^>]+>/g, "");

  /* Decode a few common named entities */
  s = s
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&quot;/gi, '"')
    .replace(/&apos;/gi, "'");

  /* Decode numeric entities (decimal & hex) */
  s = s.replace(/&#(\d+);/g, (_, n) => String.fromCharCode(parseInt(n, 10)));
  s = s.replace(/&#x([0-9a-fA-F]+);/g, (_, n) => String.fromCharCode(parseInt(n, 16)));

  /* Normalize whitespace → single-line (meta-friendly) */
  s = s
    .replace(/\u00A0/g, " ")
    .replace(/[ \t\f\v]+/g, " ")
    .replace(/\s*\n\s*/g, " ")
    .replace(/\s{2,}/g, " ")
    .trim();

  return s;
}
