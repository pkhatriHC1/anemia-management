import { Check, Lightbulb, Minus } from "lucide-react";
import { Alert, Dialog, Gauge, Progress } from "@hc1com/design-system";
import { TRS_GAUGE_TIER, trsTier } from "../lib/clinical";
import { SeverityBadge } from "../worklist/PatientWorklist";

const RISK_DESCRIPTION = {
  low: "Low transfusion risk. Routine monitoring and optimization is sufficient.",
  medium: "Moderate risk. Enhanced monitoring and iron optimization recommended.",
  high: "High risk. Aggressive optimization and preparation required before procedure.",
  "very-high": "Very high risk. Immediate intervention required. Consider delaying elective surgery.",
};

const PROGRESS_TONE = { low: "success", medium: "warning", high: "warning", "very-high": "danger" };

/** Transfusion risk score breakdown for one patient. */
export function TrsDialog({ p, onClose }) {
  const t = p._trs;
  return (
    <Dialog open onOpenChange={o => { if (!o) onClose(); }}>
      <Dialog.Content size="md">
        <Dialog.Header>
          <Dialog.Title>Transfusion risk score</Dialog.Title>
          <Dialog.Description>{p.name} · MRN {p.id}</Dialog.Description>
        </Dialog.Header>

        <Dialog.Body className="[&>*]:shrink-0">
          <div className="flex flex-col gap-24">
            <div className="flex items-center gap-24">
              <div className="flex shrink-0 flex-col items-center gap-8 rounded-control bg-[color:var(--hc-color-bg-subtle)] px-24 py-16">
                <Gauge value={t.score} max={10} tier={TRS_GAUGE_TIER[t.trsSev] || "low"} size="lg" />
                <SeverityBadge tier={trsTier(t.trsSev)} />
              </div>
              <div className="flex min-w-0 flex-1 flex-col gap-8">
                <div className="flex items-center gap-12">
                  <Progress value={Math.min((t.score / 10) * 100, 100)} tone={PROGRESS_TONE[t.trsSev]} size="sm" className="flex-1" aria-label={`Score ${t.score} of 10`} />
                  <span className="shrink-0 text-14 font-semibold tabular-nums text-[color:var(--hc-color-text-primary)]">{t.score}/10</span>
                </div>
                <p className="text-14 text-[color:var(--hc-color-text-secondary)]">{RISK_DESCRIPTION[t.trsSev]}</p>
              </div>
            </div>

            <section className="flex flex-col gap-8" aria-labelledby="trs-breakdown">
              <h3 id="trs-breakdown" className="text-14 font-semibold text-[color:var(--hc-color-text-primary)]">Score breakdown</h3>
              <ul className="divide-y divide-[color:var(--hc-color-border-subtle)] overflow-hidden rounded-control border border-[color:var(--hc-color-border-default)]">
                {t.fullBreakdown.map(f => {
                  const scored = f.earnedPts > 0;
                  return (
                    <li key={f.label} className={`flex items-center gap-12 px-16 py-12 ${scored ? "" : "bg-[color:var(--hc-color-bg-subtle)]"}`}>
                      <span className={`flex size-20 shrink-0 items-center justify-center rounded-full ${scored ? "bg-[color:var(--hc-color-status-error-bg)] text-[color:var(--hc-color-status-error-fg)]" : "bg-[color:var(--hc-color-bg-muted)] text-[color:var(--hc-color-text-tertiary)]"}`}>
                        {scored ? <Check className="size-12" /> : <Minus className="size-12" />}
                      </span>
                      <div className="flex min-w-0 flex-1 flex-col gap-4">
                        <span className={`text-14 ${scored ? "font-semibold text-[color:var(--hc-color-text-primary)]" : "text-[color:var(--hc-color-text-supporting)]"}`}>{f.label}</span>
                        <span className="text-12 text-[color:var(--hc-color-text-supporting)]">{f.value} · {f.criteria}</span>
                      </div>
                      <span className="shrink-0 text-14 tabular-nums">
                        <span className={scored ? "font-semibold text-[color:var(--hc-color-text-primary)]" : "text-[color:var(--hc-color-text-tertiary)]"}>+{f.earnedPts}</span>
                        <span className="text-[color:var(--hc-color-text-tertiary)]"> / {f.maxPts}</span>
                      </span>
                    </li>
                  );
                })}
              </ul>
            </section>

            <section className="flex flex-col gap-8 rounded-control bg-[color:var(--hc-color-bg-subtle)] px-16 py-16" aria-labelledby="trs-actions">
              <h3 id="trs-actions" className="flex items-center gap-8 text-14 font-semibold text-[color:var(--hc-color-text-primary)]">
                <Lightbulb className="size-16 text-[color:var(--hc-color-text-supporting)]" aria-hidden /> Recommended actions
              </h3>
              <ul className="flex list-disc flex-col gap-4 pl-20 text-14 text-[color:var(--hc-color-text-secondary)]">
                {t.actions.map(a => <li key={a}>{a}</li>)}
              </ul>
            </section>

            <Alert variant="info">
              <Alert.Title>Evidence base</Alert.Title>
              <Alert.Description>
                Transfusion risk score validated in cardiac surgery populations (Karkouti et al., Anesthesiology 2006). Predictive accuracy for perioperative transfusion requirement: AUC 0.78–0.82.
              </Alert.Description>
            </Alert>
          </div>
        </Dialog.Body>
      </Dialog.Content>
    </Dialog>
  );
}
