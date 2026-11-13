import { useState } from "react";
import { ArrowDown, ArrowRight, ArrowUp, BookOpen, Check, FlaskConicalOff, Pill, TriangleAlert } from "lucide-react";
import { Alert, Badge, Button, Card, Gauge } from "@hc1com/design-system";
import { AiInsightCard } from "@hc1com/design-system/patterns";
import { TRS_GAUGE_TIER, getDeltaRisk, trsTier } from "../lib/clinical";
import { SeverityBadge, labTone } from "../worklist/PatientWorklist";

const EVIDENCE = [
  { t: "AABB Clinical Practice Guidelines (2020)", d: "Hgb <7 g/dL restrictive transfusion threshold" },
  { t: "Cochrane Review: IV Iron vs Oral Iron", d: "IV iron superior efficacy, faster Hgb recovery" },
  { t: "NEJM 2019 — Carson et al.", d: "IV iron reduces transfusion need by 40%" },
  { t: "ASH Guidelines: Anemia Management", d: "Iron deficiency & chronic disease anemia" },
];

/*
 * Note: these branches compare p.severity with "Critical" / "High", but patient severities are
 * "Severe" / "Moderate" / "Mild" / "No Anemia", so every patient gets the last branch. Kept as in
 * the original prototype; flagged for the clinical team.
 */
function plan(p) {
  if (p.severity === "Critical") return {
    protocol: "Urgent: IV Iron + Transfusion Evaluation",
    drug: "Ferric Carboxymaltose 1000mg IV — post stabilization",
    recs: ["Approve IV Iron per AABB guidelines", "Restrictive transfusion strategy (Hgb <7 g/dL)", "Monitor CBC at 2–4 weeks post-treatment"],
    meds: [
      { name: "Ferric Carboxymaltose", dose: "750 mg", frequency: "×1 dose after stabilization" },
      { name: "Ondansetron", dose: "4 mg", frequency: "×1 dose IV pre-infusion" },
      { name: "Folic Acid", dose: "1 mg", frequency: "Daily" },
      { name: "Epoetin Alfa", dose: "40,000 units", frequency: "Weekly SC" },
    ],
  };
  if (p.severity === "High") return {
    protocol: "IV Iron Therapy Protocol",
    drug: "Ferric Carboxymaltose 750mg IV — weeks 1 & 3",
    recs: ["Initiate IV Iron within 14 days", "Recheck Hgb & Ferritin in 7–10 days", "Coordinate with surgical team"],
    meds: [
      { name: "Ferric Carboxymaltose", dose: "750 mg", frequency: "×1 dose" },
      { name: "Ondansetron", dose: "4 mg", frequency: "×1 dose IV pre-infusion" },
      { name: "Ferrous sulfate", dose: "325 mg", frequency: "TID" },
      { name: "Vitamin B12", dose: "1,000 mcg", frequency: "IM monthly" },
    ],
  };
  return {
    protocol: "Monitoring + Oral Iron Supplementation",
    drug: "Ferrous sulfate 325mg TID — reassess in 4 weeks",
    recs: ["Continue watchful waiting — CBC q48h", "Iron supplementation — oral or IV", "Hematology follow-up in 2 weeks"],
    meds: [
      { name: "Ferrous sulfate", dose: "325 mg", frequency: "TID" },
      { name: "Folic Acid", dose: "1 mg", frequency: "Daily" },
      { name: "Vitamin C", dose: "500 mg", frequency: "Daily with iron" },
      { name: "Epoetin Alfa", dose: "40,000 units", frequency: "Weekly SC" },
    ],
  };
}

function insightText(p) {
  const draws = p.labs[0].draws;
  if (p.severity === "Critical") {
    const drop = draws && draws.length >= 2 ? Math.abs(draws[draws.length - 1].value - draws[0].value).toFixed(1) : "—";
    return `Patient has hemoglobin of ${p.labs[0].value} g/dL with a drop of ${drop} g/dL, indicating acute anemia requiring immediate intervention.`;
  }
  if (p.severity === "High") return `Patient has hemoglobin of ${p.labs[0].value} g/dL with ferritin ${p.labs[1].value} ng/mL, indicating anemia requiring intervention before surgery.`;
  return `Patient has hemoglobin of ${p.labs[0].value} g/dL, indicating anemia requiring monitoring and supplementation.`;
}

/** One measure in the risk assessment strip. */
function Stat({ label, children }) {
  return (
    <div className="flex min-w-0 flex-col gap-8 px-24 py-16">
      <span className="text-12 font-medium text-[color:var(--hc-color-text-supporting)]">{label}</span>
      {children}
    </div>
  );
}

function Value({ value, unit, tone }) {
  return (
    <span className="flex items-baseline gap-4">
      <span className={`text-24 font-semibold leading-none tabular-nums ${tone ?? "text-[color:var(--hc-color-text-primary)]"}`}>{value}</span>
      <span className="text-14 text-[color:var(--hc-color-text-supporting)]">{unit}</span>
    </span>
  );
}

function Missing() {
  return (
    <span className="flex items-center gap-8 text-14 text-[color:var(--hc-color-text-tertiary)]">
      <FlaskConicalOff className="size-20" aria-hidden /> Pending
    </span>
  );
}

/** Clinical decision support tab: risk assessment, AI insight and evidence. */
export function OverviewZone({ p, onNavigate }) {
  const [medsExpanded, setMedsExpanded] = useState(false);
  const hgb = p.labs[0];
  const draws = hgb.draws || [];
  const hasDelta = draws.length >= 2;
  const delta = hasDelta ? Math.abs(draws[draws.length - 1].value - draws[0].value).toFixed(1) : null;
  const isDown = hasDelta && draws[draws.length - 1].value < draws[0].value;
  const deltaRisk = getDeltaRisk(hgb.draws);
  const ferritin = p.labs.find(l => l.label === "Ferritin");
  const tsat = p.labs.find(l => l.label === "Transferrin Sat");
  const weight = p.weight ? parseFloat(p.weight) : null;
  const { protocol, drug, recs, meds } = plan(p);
  const visibleMeds = medsExpanded ? meds : meds.slice(0, 2);

  const missing = [];
  if (!p.weight) missing.push("weight");
  if (!p.labs.find(l => l.label === "HGB")) missing.push("Hgb");
  if (!ferritin || ferritin.missing) missing.push("ferritin");
  if (!tsat) missing.push("TSAT");

  return (
    <div className="flex flex-col gap-24">
      <Card variant="default" density="comfortable">
        <Card.Header>
          <Card.Icon><TriangleAlert /></Card.Icon>
          <Card.Title>Risk assessment</Card.Title>
        </Card.Header>
        <div className="grid grid-cols-2 divide-[color:var(--hc-color-border-subtle)] border-t border-[color:var(--hc-color-border-subtle)] md:grid-cols-3 xl:grid-cols-[repeat(5,minmax(0,1fr))_minmax(0,2fr)] xl:divide-x">
          <Stat label="Hgb">
            <Value value={hgb.value} unit="g/dL" tone={labTone(hgb.status)} />
            <div className="flex flex-wrap gap-4">
              {hasDelta && (
                <Badge variant={isDown ? "danger" : "success"} appearance="soft" size="sm" leadingIcon={isDown ? <ArrowDown /> : <ArrowUp />}>
                  {delta} g/dL
                </Badge>
              )}
              {deltaRisk?.isRisk && <Badge variant="danger" appearance="solid" size="sm">ΔHb {deltaRisk.pct}%</Badge>}
            </div>
          </Stat>
          <Stat label="Ferritin">
            {!ferritin || ferritin.missing ? <Missing /> : <Value value={ferritin.value} unit="ng/mL" tone={labTone(ferritin.status)} />}
          </Stat>
          <Stat label="TSAT">
            {!tsat || tsat.missing ? <Missing /> : <Value value={tsat.value} unit="%" tone={labTone(tsat.status)} />}
          </Stat>
          <Stat label="Weight">
            {weight === null ? <Missing /> : (
              <Value value={weight} unit="kg" tone={weight < 75 ? "text-[color:var(--hc-color-status-warning-fg)]" : undefined} />
            )}
          </Stat>
          <Stat label="TRS score">
            <Gauge value={p._trs.score} max={10} tier={TRS_GAUGE_TIER[p._trs.trsSev] || "low"} size="md" />
            <SeverityBadge tier={trsTier(p._trs.trsSev)} />
          </Stat>
          <Stat label="Active medication orders">
            <ul className="flex flex-col gap-4">
              {visibleMeds.map(m => (
                <li key={m.name} className="flex items-start gap-8 text-14 text-[color:var(--hc-color-text-secondary)]">
                  <Pill className="mt-4 size-12 shrink-0 text-[color:var(--hc-color-text-tertiary)]" aria-hidden />
                  <span><span className="font-medium text-[color:var(--hc-color-text-primary)]">{m.name}</span> {m.dose} · {m.frequency}</span>
                </li>
              ))}
            </ul>
            {meds.length > 2 && (
              <Button variant="link" size="sm" className="self-start px-0" onClick={() => setMedsExpanded(v => !v)}>
                {medsExpanded ? "Show less" : `+${meds.length - 2} more`}
              </Button>
            )}
          </Stat>
        </div>
      </Card>

      {missing.length > 0 && (
        <Alert variant="warning">
          <Alert.Title>Missing clinical data</Alert.Title>
          <Alert.Description>
            This risk score and the recommendations may be incomplete until {missing.join(", ")} {missing.length > 1 ? "are" : "is"} recorded. Weight, Hgb, ferritin and TSAT are all needed.
          </Alert.Description>
        </Alert>
      )}

      <AiInsightCard
        title="AI insight"
        provenance={`${p.aiConfidence}% confidence · AABB, Cochrane, ASH guidance`}
        extraActions={
          <Button variant="cta" size="sm" onClick={() => onNavigate("cp")}>
            Review optimization recommendations <ArrowRight />
          </Button>
        }
      >
        <div className="grid grid-cols-1 gap-24 md:grid-cols-2">
          <div className="flex flex-col gap-12">
            <p className="text-14 leading-relaxed text-[color:var(--hc-color-text-secondary)]">{insightText(p)}</p>
            <div className="flex flex-col gap-4">
              <span className="text-12 font-medium text-[color:var(--hc-color-text-supporting)]">Recommended protocol</span>
              <span className="text-16 font-semibold text-[color:var(--hc-color-text-primary)]">{protocol}</span>
              <span className="text-14 text-[color:var(--hc-color-text-secondary)]">{drug}</span>
            </div>
          </div>
          <div className="flex flex-col gap-8">
            <span className="text-12 font-medium text-[color:var(--hc-color-text-supporting)]">Key actions</span>
            <ol className="flex flex-col gap-8">
              {recs.map((r, i) => (
                <li key={r} className="flex items-start gap-8 text-14 text-[color:var(--hc-color-text-secondary)]">
                  <span className="flex size-20 shrink-0 items-center justify-center rounded-full bg-[color:var(--hc-color-ai-subtle-bg)] text-12 font-semibold text-[color:var(--hc-color-ai-text)]">{i + 1}</span>
                  {r}
                </li>
              ))}
            </ol>
          </div>
        </div>
      </AiInsightCard>

      <Card variant="default" density="comfortable">
        <Card.Header>
          <Card.Icon><BookOpen /></Card.Icon>
          <Card.Title>Evidence base</Card.Title>
          <Card.Description>The guidelines and studies behind these recommendations</Card.Description>
        </Card.Header>
        <Card.Content>
          <ul className="grid grid-cols-1 gap-16 md:grid-cols-2">
            {EVIDENCE.map(({ t, d }) => (
              <li key={t} className="flex items-start gap-8">
                <Check className="mt-4 size-16 shrink-0 text-[color:var(--hc-color-status-success-fg)]" aria-hidden />
                <div className="flex flex-col gap-4">
                  <span className="text-14 font-medium text-[color:var(--hc-color-text-primary)]">{t}</span>
                  <span className="text-12 text-[color:var(--hc-color-text-supporting)]">{d}</span>
                </div>
              </li>
            ))}
          </ul>
        </Card.Content>
      </Card>
    </div>
  );
}
