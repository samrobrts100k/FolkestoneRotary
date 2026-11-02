/** Event category: display name, colour, and whether text on that colour should be navy (light colours). */
export const CAT: Record<string, [string, string, boolean]> = {
  fundraising: ["Fundraising", "#F7A81B", true], community: ["Community", "#005DAA", false], social: ["Social", "#4d93cc", false], business: ["Business", "#0B1F3A", false], youth: ["Youth", "#c9780a", false],
};
export const cat = (c: string): [string, string, boolean] => CAT[c] ?? [c, "#005DAA", false];
