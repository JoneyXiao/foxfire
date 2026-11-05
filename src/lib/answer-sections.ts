/** Split Geekbang-style answer Markdown into scannable document sections. */

export type AnswerSectionKind = "direct" | "knowledge" | "extra";

export type AnswerSection = {
  kind: AnswerSectionKind;
  /** Mono micro-label shown above the body. */
  label: string;
  /** Markdown body without the leading **标题**： marker. */
  body: string;
};

const SECTION_SPECS: ReadonlyArray<{
  kind: AnswerSectionKind;
  label: string;
  /** Match **标题**： or **标题**: at a line-ish boundary. */
  pattern: RegExp;
}> = [
  {
    kind: "direct",
    label: "直接答案",
    pattern: /\*\*直接答案\*\*\s*[：:]/,
  },
  {
    kind: "knowledge",
    label: "知识点",
    pattern: /\*\*知识点讲解\*\*\s*[：:]/,
  },
];

/**
 * Prefer 直接答案 / 知识点讲解 partitions. Unmatched leading or trailing
 * Markdown stays as a quiet 「正文」 / 「补充」 block so we never drop content.
 */
export function splitAnswerSections(source: string): AnswerSection[] {
  const text = source.trim();
  if (!text) return [];

  type Hit = { kind: AnswerSectionKind; label: string; index: number; markerEnd: number };
  const hits: Hit[] = [];

  for (const spec of SECTION_SPECS) {
    const match = spec.pattern.exec(text);
    if (!match || match.index === undefined) continue;
    hits.push({
      kind: spec.kind,
      label: spec.label,
      index: match.index,
      markerEnd: match.index + match[0].length,
    });
  }

  hits.sort((a, b) => a.index - b.index);

  if (hits.length === 0) {
    return [{ kind: "extra", label: "正文", body: text }];
  }

  const sections: AnswerSection[] = [];
  const first = hits[0];
  if (first.index > 0) {
    const lead = text.slice(0, first.index).trim();
    if (lead) {
      sections.push({ kind: "extra", label: "正文", body: lead });
    }
  }

  for (let i = 0; i < hits.length; i += 1) {
    const hit = hits[i];
    const end = i + 1 < hits.length ? hits[i + 1].index : text.length;
    const body = text.slice(hit.markerEnd, end).trim();
    if (!body) continue;
    sections.push({ kind: hit.kind, label: hit.label, body });
  }

  return sections.length > 0 ? sections : [{ kind: "extra", label: "正文", body: text }];
}
