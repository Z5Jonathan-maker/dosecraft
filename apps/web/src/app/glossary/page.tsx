"use client";

import { useState, useRef, useMemo, useCallback } from "react";
import { BookOpenCheck, Search, X, Hash } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

/* ─── Types ─── */

interface GlossaryTerm {
  readonly term: string;
  readonly definition: string;
  readonly related?: readonly string[];
}

/* ─── Data (30 terms) ─── */

const GLOSSARY_TERMS: readonly GlossaryTerm[] = [
  {
    term: "Angiogenesis",
    definition:
      "Formation of new blood vessels from existing ones. BPC-157 promotes angiogenesis, which is a key mechanism in its healing properties.",
    related: ["BPC (Body Protection Compound)"],
  },
  {
    term: "Bacteriostatic Water (BAC)",
    definition:
      "Sterile water with 0.9% benzyl alcohol used for reconstituting peptides. Shelf-stable once opened for approximately 28 days. Always use BAC water \u2014 never normal saline or sterile water for injection.",
    related: ["Reconstitution", "Lyophilized", "Vial"],
  },
  {
    term: "Bioavailability",
    definition:
      "The proportion of a substance that enters circulation and has an active effect. Subcutaneous injection typically has 95%+ bioavailability, while oral peptides have significantly lower absorption.",
    related: ["Subcutaneous (SubQ)", "Intramuscular (IM)", "Pharmacokinetics (PK)"],
  },
  {
    term: "BPC (Body Protection Compound)",
    definition:
      "A pentadecapeptide derived from human gastric juice. BPC-157 is the most studied variant, known for its systemic healing effects on tendons, ligaments, muscles, nerves, and the GI tract.",
    related: ["Angiogenesis", "Peptide"],
  },
  {
    term: "Compounding Pharmacy",
    definition:
      "A pharmacy that creates customized medications, including peptides, per individual prescriptions. Compounded peptides are made to order and are distinct from mass-manufactured drugs.",
    related: ["FDA (Food and Drug Administration)", "HPLC (High Performance Liquid Chromatography)"],
  },
  {
    term: "Contraindication",
    definition:
      "A condition or factor that makes a particular treatment inadvisable. For example, active cancer is a contraindication for peptides that promote angiogenesis like BPC-157.",
    related: ["Protocol"],
  },
  {
    term: "Cytokine",
    definition:
      "Small proteins important in cell signaling, especially in immune responses. Some peptides modulate cytokine production, influencing inflammation and healing cascades.",
    related: ["Peptide"],
  },
  {
    term: "DSIP (Delta Sleep-Inducing Peptide)",
    definition:
      "A neuropeptide that promotes deep sleep when administered at bedtime. Often used alongside GH secretagogues to enhance overnight growth hormone release.",
    related: ["Secretagogue", "Peptide"],
  },
  {
    term: "Evidence Lane",
    definition:
      "DoseCraft\u2019s 3-tier evidence classification system: Clinical (peer-reviewed research), Expert (practitioner consensus), and Experimental (emerging community data). Each lane has its own confidence score.",
  },
  {
    term: "FDA (Food and Drug Administration)",
    definition:
      "US regulatory body that approves drugs for human use. Most research peptides are not FDA-approved for general therapeutic use and are sold as research chemicals.",
    related: ["Research Chemical", "Compounding Pharmacy"],
  },
  {
    term: "GHRH (Growth Hormone Releasing Hormone)",
    definition:
      "Hypothalamic hormone that stimulates growth hormone release from the pituitary. CJC-1295 and Sermorelin are synthetic GHRH analogs used in peptide protocols.",
    related: ["GHRP (Growth Hormone Releasing Peptide)", "Secretagogue"],
  },
  {
    term: "GHRP (Growth Hormone Releasing Peptide)",
    definition:
      "Peptides that stimulate growth hormone release through the ghrelin receptor. Examples include GHRP-2, GHRP-6, and Ipamorelin. Often stacked with GHRH analogs for synergistic effect.",
    related: ["GHRH (Growth Hormone Releasing Hormone)", "Secretagogue", "IU (International Unit)"],
  },
  {
    term: "Half-Life",
    definition:
      "The time required for half of a substance to be eliminated from the body. Half-life determines dosing frequency \u2014 shorter half-lives require more frequent dosing.",
    related: ["Pharmacokinetics (PK)", "Protocol"],
  },
  {
    term: "HCG (Human Chorionic Gonadotropin)",
    definition:
      "A hormone used alongside TRT to maintain fertility and testicular function. Dosed in IU, typically 250\u2013500 IU 2\u20133x per week.",
    related: ["TRT (Testosterone Replacement Therapy)", "IU (International Unit)"],
  },
  {
    term: "HPLC (High Performance Liquid Chromatography)",
    definition:
      "A laboratory technique used to verify peptide purity and identity. Always look for an HPLC Certificate of Analysis (COA) from vendors \u2014 purity should be 98%+.",
    related: ["Research Chemical", "Compounding Pharmacy"],
  },
  {
    term: "Intramuscular (IM)",
    definition:
      "Injection into muscle tissue, typically at 90\u00b0 with a 1\u20131.5 inch needle. Used for testosterone, some peptides, and HCG. Common sites include the deltoid and ventrogluteal.",
    related: ["Subcutaneous (SubQ)", "Bioavailability"],
  },
  {
    term: "IU (International Unit)",
    definition:
      "A standardized measurement unit for biological substances like HGH, insulin, and HCG. Conversion varies by substance \u2014 for HGH, 1 mg \u2248 3 IU.",
    related: ["MCG (Microgram)", "HCG (Human Chorionic Gonadotropin)"],
  },
  {
    term: "Lyophilized",
    definition:
      "Freeze-dried. Peptides are sold in lyophilized (powder) form for long-term stability and must be reconstituted with bacteriostatic water before injection.",
    related: ["Reconstitution", "Bacteriostatic Water (BAC)", "Vial"],
  },
  {
    term: "MCG (Microgram)",
    definition:
      "One millionth of a gram (1/1000 of a milligram). Most peptide doses are measured in mcg. Accurate dosing requires understanding reconstitution math.",
    related: ["IU (International Unit)", "Titration"],
  },
  {
    term: "Peptide",
    definition:
      "A short chain of amino acids (typically 2\u201350). Proteins are longer chains. Peptides act as signaling molecules in the body, triggering specific biological responses like healing, growth hormone release, or sleep.",
    related: ["BPC (Body Protection Compound)", "Secretagogue"],
  },
  {
    term: "Pharmacokinetics (PK)",
    definition:
      "How the body absorbs, distributes, metabolizes, and excretes a drug over time. Understanding PK helps optimize dosing timing and frequency for each peptide.",
    related: ["Half-Life", "Bioavailability"],
  },
  {
    term: "Protocol",
    definition:
      "A structured plan specifying which compounds to take, doses, frequency, timing, and duration. DoseCraft helps you build, track, and optimize protocols.",
    related: ["Titration", "Half-Life"],
  },
  {
    term: "Reconstitution",
    definition:
      "The process of adding bacteriostatic water to lyophilized peptide powder to create an injectable solution. Aim the stream down the vial wall \u2014 never squirt directly onto the powder.",
    related: ["Bacteriostatic Water (BAC)", "Lyophilized", "Vial"],
  },
  {
    term: "Research Chemical",
    definition:
      "A compound sold for \"research purposes only\" \u2014 not FDA-approved for human use. Most peptides available online are classified as research chemicals.",
    related: ["FDA (Food and Drug Administration)", "HPLC (High Performance Liquid Chromatography)"],
  },
  {
    term: "Secretagogue",
    definition:
      "A substance that promotes secretion of another substance. Growth hormone secretagogues (like Ipamorelin, GHRP-6, and MK-677) stimulate the body\u2019s own GH production.",
    related: ["GHRH (Growth Hormone Releasing Hormone)", "GHRP (Growth Hormone Releasing Peptide)"],
  },
  {
    term: "Subcutaneous (SubQ)",
    definition:
      "Injection into the fat layer beneath the skin, typically at 45\u00b0 with a \u00bd inch insulin needle. The most common route for peptide administration. Abdomen is the most popular site.",
    related: ["Intramuscular (IM)", "Bioavailability"],
  },
  {
    term: "Telomere",
    definition:
      "Protective caps on chromosome ends that shorten with age. Epithalon is a peptide studied for its potential to maintain telomere length via telomerase activation.",
    related: ["Peptide"],
  },
  {
    term: "TRT (Testosterone Replacement Therapy)",
    definition:
      "Medical treatment using exogenous testosterone to restore hormone levels in men with low T. Commonly dosed at 100\u2013200 mg/week via intramuscular or subcutaneous injection.",
    related: ["HCG (Human Chorionic Gonadotropin)", "Intramuscular (IM)"],
  },
  {
    term: "Titration",
    definition:
      "Gradually increasing dosage over days or weeks to find the optimal effective dose while minimizing side effects. Standard practice for most peptide protocols.",
    related: ["Protocol", "MCG (Microgram)"],
  },
  {
    term: "Vial",
    definition:
      "Glass container holding lyophilized peptide powder. Typically sealed with a rubber stopper and aluminum crimp cap. Store unreconstituted vials in a cool, dark place; reconstituted vials in the refrigerator.",
    related: ["Lyophilized", "Reconstitution", "Bacteriostatic Water (BAC)"],
  },
];

/* ─── Helpers ─── */

const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

function groupByLetter(terms: readonly GlossaryTerm[]): Map<string, readonly GlossaryTerm[]> {
  const map = new Map<string, GlossaryTerm[]>();
  for (const t of terms) {
    const letter = t.term[0].toUpperCase();
    const existing = map.get(letter);
    if (existing) {
      existing.push(t);
    } else {
      map.set(letter, [t]);
    }
  }
  return map;
}

/* ─── Page ─── */

export default function GlossaryPage() {
  const [search, setSearch] = useState("");
  const sectionRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const filtered = useMemo(() => {
    if (!search.trim()) return GLOSSARY_TERMS;
    const q = search.toLowerCase();
    return GLOSSARY_TERMS.filter(
      (t) =>
        t.term.toLowerCase().includes(q) ||
        t.definition.toLowerCase().includes(q),
    );
  }, [search]);

  const grouped = useMemo(() => groupByLetter(filtered), [filtered]);

  const activeLetters = useMemo(() => {
    const set = new Set<string>();
    for (const t of filtered) set.add(t.term[0].toUpperCase());
    return set;
  }, [filtered]);

  const scrollToLetter = useCallback((letter: string) => {
    const el = sectionRefs.current[letter];
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  const scrollToTerm = useCallback((termName: string) => {
    const letter = termName[0].toUpperCase();
    setSearch("");
    // Small delay to allow search to clear and terms to re-render
    setTimeout(() => {
      const el = sectionRefs.current[letter];
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 50);
  }, []);

  return (
    <div className="space-y-6 max-w-4xl mx-auto animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-4">
        <div
          className="w-11 h-11 rounded-xl flex items-center justify-center"
          style={{
            background:
              "linear-gradient(135deg, rgba(179,102,255,0.15) 0%, rgba(0,212,255,0.08) 100%)",
          }}
        >
          <BookOpenCheck className="w-5.5 h-5.5 text-[#b366ff]" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-dc-text tracking-tight">
            Glossary
          </h1>
          <p className="text-sm text-dc-text-muted">
            Peptide and research terminology explained
          </p>
        </div>
      </div>

      {/* Search */}
      <Card className="!p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-dc-text-muted pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search terms or definitions..."
            className="w-full pl-10 pr-10 py-2.5 rounded-xl text-sm text-dc-text placeholder:text-dc-text-muted/40 bg-dc-surface border border-dc-border focus:outline-none focus:border-dc-accent focus:ring-2 focus:ring-dc-accent/15 transition-all duration-200"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 rounded-md text-dc-text-muted hover:text-dc-text transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </Card>

      {/* Alphabet Quick-Nav */}
      <div className="flex flex-wrap gap-1.5">
        {ALPHABET.map((letter) => {
          const hasTerms = activeLetters.has(letter);
          return (
            <button
              key={letter}
              disabled={!hasTerms}
              onClick={() => scrollToLetter(letter)}
              className={`w-8 h-8 rounded-lg text-xs font-bold transition-all duration-200 ${
                hasTerms
                  ? "text-dc-text bg-dc-surface-alt hover:bg-dc-accent/15 hover:text-dc-accent border border-dc-border hover:border-dc-accent/30 cursor-pointer"
                  : "text-dc-text-faint/30 bg-transparent cursor-default"
              }`}
            >
              {letter}
            </button>
          );
        })}
      </div>

      {/* Results count */}
      {search && (
        <p className="text-xs text-dc-text-muted">
          {filtered.length} {filtered.length === 1 ? "term" : "terms"} found
        </p>
      )}

      {/* Terms grouped by letter */}
      {filtered.length === 0 ? (
        <Card className="text-center !py-12">
          <Search className="w-8 h-8 text-dc-text-faint mx-auto mb-3" />
          <p className="text-sm text-dc-text-muted">
            No terms match &ldquo;{search}&rdquo;
          </p>
          <p className="text-xs text-dc-text-faint mt-1">
            Try a different search term
          </p>
        </Card>
      ) : (
        <div className="space-y-6">
          {ALPHABET.filter((l) => grouped.has(l)).map((letter) => (
            <div
              key={letter}
              ref={(el) => { sectionRefs.current[letter] = el; }}
            >
              {/* Letter header */}
              <div className="flex items-center gap-3 mb-3">
                <div className="w-9 h-9 rounded-xl bg-dc-accent/10 border border-dc-accent/20 flex items-center justify-center">
                  <span className="text-sm font-bold text-dc-accent">
                    {letter}
                  </span>
                </div>
                <div className="flex-1 h-px bg-dc-border/50" />
                <span className="text-[10px] text-dc-text-faint uppercase tracking-wider">
                  {grouped.get(letter)?.length ?? 0} {(grouped.get(letter)?.length ?? 0) === 1 ? "term" : "terms"}
                </span>
              </div>

              {/* Term cards */}
              <div className="space-y-2.5 ml-1">
                {(grouped.get(letter) ?? []).map((entry) => (
                  <Card key={entry.term} hoverable className="!p-4">
                    <div className="flex items-start gap-3">
                      <Hash className="w-3.5 h-3.5 text-dc-accent mt-1 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-semibold text-dc-text mb-1.5">
                          {entry.term}
                        </h3>
                        <p className="text-sm text-dc-text-muted leading-relaxed">
                          {entry.definition}
                        </p>
                        {entry.related && entry.related.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 mt-3">
                            <span className="text-[10px] text-dc-text-faint uppercase tracking-wider mr-1 self-center">
                              Related:
                            </span>
                            {entry.related.map((r) => (
                              <button
                                key={r}
                                onClick={() => scrollToTerm(r)}
                                className="cursor-pointer"
                              >
                                <Badge
                                  variant="default"
                                  size="xs"
                                  className="hover:bg-dc-accent/10 hover:text-dc-accent hover:border-dc-accent/30 transition-all cursor-pointer"
                                >
                                  {r}
                                </Badge>
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
