import { useEffect, useState } from "react";
import { ArrowLeft, ArrowRight, Calculator, CalendarClock, Check, CheckCircle2, Inbox, Info, Pencil, RotateCcw, Save, Send, Trash2, UserPlus } from "lucide-react";
import { Alert, Badge, Button, Card, Checkbox, Dialog, EmptyState, Input, Progress, Textarea } from "@hc1com/design-system";
import { AiInsightCard, Wizard } from "@hc1com/design-system/patterns";
import { CAN_CLINICAL_NAVIGATION, getFollowUpDecision, getFollowUps } from "../followup/followUpStore";
import { ScheduleFollowUpModal } from "../followup/ScheduleFollowUpModal";
import { addAuditEntry, completeCase, getActiveEpicPools, searchProviders } from "../lib/notifyStores";

const STEPS = [
  { id: "plan", label: "Optimization recommendations" },
  { id: "auth", label: "Prior authorization" },
  { id: "notify", label: "Notify" },
];
const DEFAULT_TARGET_HGB = 13;
const PRIMARY_ICD = ["D50.0", "D50.8", "D50.9", "D63.0", "D63.1", "D64.81"];
const SECONDARY_ICD_PREFIXES = ["E83.10", "K50.", "K51.", "K90.0", "N18.", "N92.", "Z98.84", "Z91.14"];

const pad = n => String(n).padStart(2, "0");
const fmtDateTime = iso => {
  const d = new Date(iso);
  if (isNaN(d)) return "";
  return `${pad(d.getMonth() + 1)}/${pad(d.getDate())}/${d.getFullYear()}, ${pad(d.getHours())}:${pad(d.getMinutes())}`;
};

/** Prior authorization: five criteria, probability = met / 5. */
function priorAuth(p) {
  const hgb = parseFloat(p.labs[0].value);
  const fer = p.labs.find(l => l.label === "Ferritin");
  const ferVal = fer ? parseFloat(fer.value) : null;
  const tsat = p.labs.find(l => l.label === "Transferrin Sat");
  const tsatVal = tsat ? parseFloat(tsat.value) : null;
  const c1 = hgb < 13;
  const c2 = (ferVal != null && ferVal < 100) || (tsatVal != null && tsatVal < 20);
  const c3 = c1;
  const c4 = c1 && c2 && p.procedureWithin2Weeks;
  const c5 = p.icdCodes.some(c => PRIMARY_ICD.includes(c)) && p.icdCodes.some(c => SECONDARY_ICD_PREFIXES.some(pre => c.startsWith(pre)));
  const criteria = [
    { label: "Hemoglobin < 13 g/dL", met: c1 },
    { label: "Ferritin < 100 ng/mL, and or TSAT < 20%", met: c2 },
    { label: "Clinical indication: peri-operative transfusion risk", met: c3 },
    { label: "Elective high blood loss procedure in < 30 days with iron deficiency anemia with insufficient time for an adequate 4-week oral iron trial.", met: c4 },
    { label: "Qualifying ICD-10 Diagnosis codes: Primary and Secondary anemia codes are present", met: c5 },
  ];
  const met = criteria.filter(c => c.met).length;
  const pct = Math.round((met / 5) * 100);
  const suggestions = [];
  if (!c1) suggestions.push({ title: "Hemoglobin threshold", desc: "Hemoglobin does not meet the < 13 g/dL threshold for IV iron coverage.", actions: ["Document the most recent Hgb value and trend", "If Hgb is ≥ 13 g/dL, document clinical justification for IV iron (e.g., anticipated blood loss)", "Include pre- and post-operative Hgb trajectory"] });
  if (!c2) suggestions.push({ title: "Iron studies", desc: "Ferritin and/or TSAT values are not documented or do not meet the < 100 ng/mL / < 20% threshold.", actions: ["Order complete iron panel: serum iron, TIBC, transferrin saturation (TSAT)", "Document TSAT < 20% if ferritin is borderline", "Note inflammatory conditions that may elevate ferritin despite iron deficiency", "Consider reticulocyte hemoglobin content (CHr) or zinc protoporphyrin testing"] });
  if (!c4) suggestions.push({ title: "Route justification", desc: "Need to document why IV route is medically necessary — insufficient time for a 4-week oral iron trial.", actions: ["Document failed trial of oral iron (minimum 4–6 weeks with compliance)", "Note GI intolerance: nausea, constipation, abdominal pain from oral iron", "Document malabsorption conditions: celiac disease, inflammatory bowel disease, gastric bypass", "If urgent need, document timeline constraints (upcoming surgery, obstetric deadline)"] });
  if (!c5) suggestions.push({ title: "Diagnosis codes", desc: "Missing qualifying ICD-10 diagnosis codes — at least one primary anemia code and one secondary code are required.", actions: ["Add a primary anemia diagnosis code (D50.0, D50.8, D50.9, D63.0, D63.1, or D64.81)", "Add a secondary diagnosis code (e.g., E83.10, K50.x, K51.x, K90.0, N18.x, N92.x, Z98.84, or Z91.14x)", "Ensure the underlying condition (e.g., CKD, IBD, menorrhagia) is coded as secondary"] });
  if (suggestions.length === 0) suggestions.push({ title: "Documentation complete", desc: "All prior authorization criteria are met. The case is ready for submission.", actions: ["Review the attested diagnosis for accuracy", "Confirm ICD-10 codes match the clinical documentation", "Submit the prior authorization request"] });
  const band = pct >= 80
    ? { tone: "success", alert: "success", msg: "High likelihood — documentation is strong." }
    : pct >= 60
      ? { tone: "warning", alert: "warning", msg: "Moderate likelihood — address documentation gaps to improve odds." }
      : { tone: "danger", alert: "danger", msg: "Low likelihood — significant gaps to address before submission." };
  return { criteria, met, pct, suggestions, band };
}

/** Ganzoni total IV iron dose, rounded to the nearest 50 mg. */
function ganzoni(p, targetHgb) {
  const weight = p.weight ? parseFloat(p.weight) : null;
  const hgb = parseFloat(p.labs[0].value);
  if (weight == null || isNaN(weight) || isNaN(hgb)) return null;
  const deficit = Math.max(0, targetHgb - hgb);
  const stores = weight < 35 ? Math.round(weight * 15) : 500;
  return { weight, hgb, stores, dose: Math.round((weight * deficit * 2.4 + stores) / 50) * 50 };
}

function StepFooter({ children }) {
  return <div className="flex flex-wrap items-center justify-end gap-8 border-t border-[color:var(--hc-color-border-subtle)] pt-16">{children}</div>;
}

function Section({ title, hint, children, end }) {
  return (
    <section className="flex flex-col gap-8">
      <div className="flex items-center justify-between gap-8">
        <h3 className="text-14 font-semibold text-[color:var(--hc-color-text-primary)]">
          {title} {hint && <span className="font-normal text-[color:var(--hc-color-text-supporting)]">{hint}</span>}
        </h3>
        {end}
      </div>
      {children}
    </section>
  );
}

/** Selectable recipient or pool row. */
function PickRow({ checked, onChange, title, sub, icon, onRemove }) {
  return (
    <div className={`flex items-center gap-12 rounded-control border px-12 py-12 ${checked ? "border-[color:var(--hc-color-action-primary)] bg-[color:var(--hc-color-brand-50)]" : "border-[color:var(--hc-color-border-default)]"}`}>
      <Checkbox checked={checked} onCheckedChange={onChange} aria-label={title} />
      {icon}
      <div className="flex min-w-0 flex-1 flex-col gap-4">
        <span className="text-14 font-medium text-[color:var(--hc-color-text-primary)]">{title}</span>
        {sub && <span className="text-12 text-[color:var(--hc-color-text-supporting)]">{sub}</span>}
      </div>
      {onRemove && (
        <Button variant="ghost" size="icon-sm" aria-label={`Remove ${title}`} onClick={onRemove}><Trash2 /></Button>
      )}
    </div>
  );
}

/** Optimization recommendations → prior authorization → notify, for one patient. */
export function CarePlan({ p }) {
  const [step, setStep] = useState(0);
  const [sent, setSent] = useState(false);
  const [completion, setCompletion] = useState(null);
  const [scheduleOpen, setScheduleOpen] = useState(false);
  const [, setTick] = useState(0);
  const [attestedDx, setAttestedDx] = useState(p.diagnosis);
  const [notes, setNotes] = useState("");
  const [manualMode, setManualMode] = useState(false);
  const [manualTarget, setManualTarget] = useState("13");
  const [manualInput, setManualInput] = useState("13");
  const [recipients, setRecipients] = useState({ attending: true, surgeon: false });
  const [addedProviders, setAddedProviders] = useState([]);
  const [poolIds, setPoolIds] = useState([]);
  const [addOpen, setAddOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [editing, setEditing] = useState(false);
  const [sendError, setSendError] = useState("");

  useEffect(() => {
    const h = () => setTick(t => t + 1);
    window.addEventListener("follow-ups-updated", h);
    window.addEventListener("storage", h);
    return () => { window.removeEventListener("follow-ups-updated", h); window.removeEventListener("storage", h); };
  }, []);

  const s = p.severity;
  const treatmentMed = s === "Critical" ? "Supportive care + Iron supplement after stabilization" : "IV Iron Ferric Carboxymaltose";
  const treatmentDose = s === "Critical" ? "Ferric Carboxymaltose 750–1000mg IV" : "750mg IV";
  const treatmentDoses = s === "Critical" ? 1 : 2;
  const preview = `Subject: New Anemia Optimization Recommendations: ${p.name}\n\nA new evidence-based optimization recommendation has been initiated for ${p.name} (MRN: ${p.id}).\n\nDiagnosis: ${attestedDx}\nTreatment: ${treatmentMed}\nDosage: ${treatmentDose} × ${treatmentDoses} dose${treatmentDoses > 1 ? "s" : ""}${notes.trim() ? `\nClinical Notes: ${notes.trim()}` : ""}\n\nPlease review in Epic and coordinate care as needed.\n\n— Anemia Management CDS`;
  const [message, setMessage] = useState(preview);
  useEffect(() => { if (!editing) setMessage(preview); }, [notes, attestedDx, editing]); // eslint-disable-line react-hooks/exhaustive-deps

  const target = manualMode ? parseFloat(manualTarget) : DEFAULT_TARGET_HGB;
  const dose = ganzoni(p, target);
  const auth = priorAuth(p);

  const standard = [
    { k: "attending", name: p.provider, npi: p.npi, role: "Attending Physician" },
    { k: "surgeon", name: p.provider, npi: p.npi, role: "Surgeon" },
  ];
  const pools = getActiveEpicPools();
  const allRecipients = [
    ...standard.filter(r => recipients[r.k]).map(r => ({ id: r.k, type: "standard", label: r.role })),
    ...addedProviders.map(pr => ({ id: pr.id, type: "provider", label: pr.name, sub: `NPI ${pr.npi} · ${pr.specialty}` })),
    ...poolIds.map(id => pools.find(x => x.id === id)).filter(Boolean).map(pool => ({ id: pool.id, type: "pool", label: pool.name, sub: `Epic Pool · ${pool.poolId}` })),
  ];

  const recalc = () => { const v = parseFloat(manualInput); if (!isNaN(v) && v > 0) setManualTarget(String(v)); };
  const toggleManual = () => {
    if (manualMode) { setManualMode(false); setManualTarget("13"); setManualInput("13"); }
    else { setManualMode(true); setManualInput(manualTarget); }
  };

  const send = () => {
    if (allRecipients.length === 0) { setSendError("Select at least one recipient before sending."); return; }
    setSendError("");
    const log = allRecipients.map(r => ({ label: r.label, type: r.type, sub: r.sub || "" }));
    const data = {
      completedBy: "Tiffany Hall",
      medication: treatmentMed,
      dose: treatmentDose,
      numberOfDoses: treatmentDoses,
      recipients: log,
      messageContent: message,
      followUpScheduled: getFollowUpDecision(p.id) === "scheduled" || getFollowUps().some(v => v.patientId === p.id && v.status === "Scheduled"),
    };
    completeCase(p.id, data);
    addAuditEntry({ patientId: p.id, patientName: p.name, action: "Notify — Sent to recipients", recipients: log, messageContent: message, medication: treatmentMed, dose: treatmentDose, numberOfDoses: treatmentDoses });
    setCompletion(data);
    setSent(true);
  };

  return (
    <Card variant="default" density="comfortable">
      <Card.Content className="flex flex-col gap-24">
        <Wizard steps={STEPS} currentStep={sent ? 3 : step} onStepChange={setStep} />

        {step === 0 && (
          <div className="flex flex-col gap-24">
            <div className="flex flex-col gap-4">
              <span className="text-12 font-medium text-[color:var(--hc-color-text-supporting)]">Evidence-based optimization recommendations</span>
              <h2 className="text-18 font-semibold text-[color:var(--hc-color-text-primary)]">{attestedDx.split("—")[0].trim()}</h2>
            </div>

            <div className="flex flex-col gap-4 rounded-control bg-[color:var(--hc-color-bg-subtle)] px-16 py-12">
              <span className="text-12 font-medium text-[color:var(--hc-color-text-supporting)]">Treatment goals</span>
              <span className="text-14 text-[color:var(--hc-color-text-primary)]">
                {s === "Critical" ? "Hemodynamic stability, Hgb stabilization, identify/treat cause" : s === "High" ? "Optimize pre-surgical Hgb ≥11 g/dL within 18 days" : "Maintain Hgb ≥8.5 g/dL, reduce transfusion exposure"}
              </span>
            </div>

            <Input label="Attested diagnosis" helperText="Editable" value={attestedDx} onChange={e => setAttestedDx(e.target.value)} />
            <Textarea label="Clinical notes" optional minRows={3} resize="none" placeholder="Add any modifications or clinical reasoning…" value={notes} onChange={e => setNotes(e.target.value)} />

            <Section title="Interventions">
              <div className="flex flex-col gap-16 rounded-control border border-[color:var(--hc-color-border-default)] px-16 py-16">
                <div className="flex flex-col gap-4">
                  <span className="text-12 font-medium text-[color:var(--hc-color-text-supporting)]">Medication recommendation</span>
                  <span className="text-16 font-semibold text-[color:var(--hc-color-text-primary)]">{s === "Critical" ? "Supportive care + Iron supplement after stabilization" : "IV Iron infusion"}</span>
                </div>

                {dose === null ? (
                  <Alert variant="warning">
                    <Alert.Description>Weight is required for a calculated dose. Showing severity-tier IV iron dose only.</Alert.Description>
                  </Alert>
                ) : (
                  <div className="flex flex-col gap-12 rounded-control bg-[color:var(--hc-color-bg-subtle)] px-16 py-16">
                    <div className="flex items-center justify-between gap-8">
                      <span className="text-12 font-medium text-[color:var(--hc-color-text-supporting)]">Calculated dose ({manualMode ? "manual" : "Ganzoni"})</span>
                      <Button variant="outline" size="xs" onClick={toggleManual} title={manualMode ? "Return to auto-calculated mode" : "Switch to manual entry mode"}>
                        {manualMode ? <><RotateCcw /> Reset</> : <><Calculator /> Manual</>}
                      </Button>
                    </div>
                    {manualMode && (
                      <div className="flex flex-wrap items-end gap-8">
                        <div className="w-128">
                          <Input
                            label="Target Hgb (g/dL)"
                            type="number" step="0.1" min="0" max="20" size="sm"
                            value={manualInput}
                            onChange={e => setManualInput(e.target.value)}
                            onKeyDown={e => { if (e.key === "Enter") recalc(); }}
                          />
                        </div>
                        <Button variant="default" size="sm" onClick={recalc}>Recalculate</Button>
                        <span className="text-12 text-[color:var(--hc-color-text-supporting)]">Default target is {DEFAULT_TARGET_HGB} g/dL.</span>
                      </div>
                    )}
                    <span className="flex items-baseline gap-8">
                      <span className="text-24 font-bold leading-none tabular-nums text-[color:var(--hc-color-text-primary)]">{dose.dose}</span>
                      <span className="text-14 text-[color:var(--hc-color-text-secondary)]">mg IV iron (total)</span>
                      {manualMode && <Badge variant="primary" appearance="soft" size="sm">Manual target {target} g/dL</Badge>}
                    </span>
                    <span className="text-12 tabular-nums text-[color:var(--hc-color-text-supporting)]">
                      Formula: {dose.weight} kg × ({target} − {dose.hgb}) × 2.4 + {dose.stores} mg = {dose.dose} mg
                      {dose.weight < 35 && <> · Iron stores = {dose.weight} kg × 15 mg/kg = {dose.stores} mg (low body weight)</>}
                    </span>
                    <span className="flex items-start gap-8 border-t border-[color:var(--hc-color-border-subtle)] pt-8 text-12 text-[color:var(--hc-color-text-supporting)]">
                      <Info className="mt-4 size-12 shrink-0" aria-hidden />
                      This is the recommended total dose of intravenous iron for the target Hgb of {target} g/dL. The actual order must be placed in Epic based on institution-specific formulary availability.
                    </span>
                  </div>
                )}
              </div>

              <div className="flex flex-col gap-4 rounded-control border border-[color:var(--hc-color-border-default)] px-16 py-12">
                <span className="text-12 font-medium text-[color:var(--hc-color-text-supporting)]">Considerations</span>
                <span className="text-14 text-[color:var(--hc-color-text-secondary)]">Review patient-specific contraindications, drug interactions, and formulary availability before finalizing the order.</span>
              </div>
            </Section>

            <Alert variant="warning">
              <Alert.Title>Clinical review required</Alert.Title>
              <Alert.Description>Please review for patient-specific contraindications, drug interactions, and appropriateness before approval.</Alert.Description>
            </Alert>

            <StepFooter>
              <Button variant="default" size="sm" onClick={() => setStep(1)}>Attest and check prior authorization <ArrowRight /></Button>
            </StepFooter>
          </div>
        )}

        {step === 1 && (
          <div className="flex flex-col gap-24">
            <div className="flex flex-col gap-4">
              <span className="text-12 font-medium text-[color:var(--hc-color-text-supporting)]">Prior authorization analysis</span>
              <h2 className="text-18 font-semibold text-[color:var(--hc-color-text-primary)]">Approval probability</h2>
            </div>

            <div className="flex flex-col gap-12 rounded-control bg-[color:var(--hc-color-bg-subtle)] px-16 py-16">
              <span className="flex items-baseline gap-8">
                <span className="text-24 font-bold leading-none tabular-nums text-[color:var(--hc-color-text-primary)]">{auth.pct}%</span>
                <span className="text-14 text-[color:var(--hc-color-text-secondary)]">probability of approval</span>
              </span>
              <Progress value={auth.pct} tone={auth.band.tone} size="md" aria-label={`${auth.pct}% probability of approval`} />
              <span className="text-14 text-[color:var(--hc-color-text-secondary)]">{auth.band.msg}</span>
            </div>

            <Section title={`Criteria met: ${auth.met} of 5`}>
              <ul className="flex flex-col gap-8">
                {auth.criteria.map(c => (
                  <li key={c.label} className="flex items-start gap-12 rounded-control border border-[color:var(--hc-color-border-default)] px-12 py-12">
                    <span className={`flex size-20 shrink-0 items-center justify-center rounded-full ${c.met ? "bg-[color:var(--hc-color-status-success-bg)] text-[color:var(--hc-color-status-success-fg)]" : "border border-[color:var(--hc-color-border-strong)]"}`}>
                      {c.met && <Check className="size-12" />}
                    </span>
                    <span className={`text-14 ${c.met ? "text-[color:var(--hc-color-text-primary)]" : "text-[color:var(--hc-color-text-supporting)]"}`}>{c.label}</span>
                  </li>
                ))}
              </ul>
            </Section>

            <Section title="Diagnosis codes (ICD-10)">
              <div className="flex flex-wrap gap-8">
                {p.icdCodes.map(c => <Badge key={c} variant="primary" appearance="soft" size="sm">{c}</Badge>)}
              </div>
            </Section>

            <AiInsightCard
              title="Suggestions to improve authorization approval"
              description="These documentation gaps may reduce approval probability. Address them to strengthen the case before submission."
            >
              <div className="flex flex-col gap-12">
                {auth.suggestions.map(sg => (
                  <div key={sg.title} className="flex flex-col gap-8 rounded-control border border-[color:var(--hc-color-ai-border)] bg-[color:var(--hc-color-bg-surface)] px-16 py-12">
                    <span className="text-14 font-semibold text-[color:var(--hc-color-text-primary)]">{sg.title}</span>
                    <span className="text-14 text-[color:var(--hc-color-text-secondary)]">{sg.desc}</span>
                    <span className="text-12 font-medium text-[color:var(--hc-color-text-supporting)]">Recommended actions</span>
                    <ol className="flex flex-col gap-4">
                      {sg.actions.map((a, i) => (
                        <li key={a} className="flex items-start gap-8 text-14 text-[color:var(--hc-color-text-secondary)]">
                          <span className="flex size-20 shrink-0 items-center justify-center rounded-full bg-[color:var(--hc-color-ai-subtle-bg)] text-12 font-semibold text-[color:var(--hc-color-ai-text)]">{i + 1}</span>
                          {a}
                        </li>
                      ))}
                    </ol>
                  </div>
                ))}
                <p className="text-12 text-[color:var(--hc-color-text-supporting)]">
                  This is an estimated approval likelihood only. Refer to the payer's LCD/NCD or prior authorization policy for final coverage determinations.
                </p>
              </div>
            </AiInsightCard>

            <StepFooter>
              <Button variant="ghost" size="sm" onClick={() => setStep(0)}><ArrowLeft /> Back</Button>
              <Button variant="cta" size="sm" onClick={() => setStep(2)}>Proceed to notify <ArrowRight /></Button>
            </StepFooter>
          </div>
        )}

        {step === 2 && sent && completion && (
          <EmptyState>
            <EmptyState.Icon><CheckCircle2 /></EmptyState.Icon>
            <EmptyState.Title>Optimization recommendations sent</EmptyState.Title>
            <EmptyState.Description>
              The case has been completed and the patient removed from the active worklist.
              Sent to {completion.recipients.length} recipient{completion.recipients.length > 1 ? "s" : ""}: {completion.recipients.map(r => r.label).join(", ")}.
              Treatment recorded: {completion.medication} · {completion.dose} × {completion.numberOfDoses} dose{completion.numberOfDoses > 1 ? "s" : ""}.
            </EmptyState.Description>
            {CAN_CLINICAL_NAVIGATION && (
              <EmptyState.Actions>
                <FollowUpStatus p={p} onSchedule={() => setScheduleOpen(true)} />
              </EmptyState.Actions>
            )}
          </EmptyState>
        )}

        {step === 2 && !sent && (
          <div className="flex flex-col gap-24">
            <div className="flex flex-col gap-4">
              <span className="text-12 font-medium text-[color:var(--hc-color-text-supporting)]">Epic InBasket and patient portal</span>
              <h2 className="text-18 font-semibold text-[color:var(--hc-color-text-primary)]">Communicate optimization recommendations</h2>
            </div>

            <Section
              title="Select recipients"
              end={<Button variant="ghost" size="sm" onClick={() => { setQuery(""); setResults([]); setAddOpen(true); }}><UserPlus /> Add recipients</Button>}
            >
              <div className="flex flex-col gap-8">
                {standard.map(r => (
                  <PickRow
                    key={r.k}
                    checked={!!recipients[r.k]}
                    onChange={v => setRecipients(x => ({ ...x, [r.k]: v }))}
                    title={r.name}
                    sub={`NPI ${r.npi} · ${r.role}`}
                  />
                ))}
                {addedProviders.map(pr => (
                  <PickRow
                    key={pr.id}
                    checked
                    onChange={() => setAddedProviders(x => x.filter(a => a.id !== pr.id))}
                    title={pr.name}
                    sub={`NPI ${pr.npi} · ${pr.specialty}`}
                    onRemove={() => setAddedProviders(x => x.filter(a => a.id !== pr.id))}
                  />
                ))}
              </div>
            </Section>

            <Section title="Epic message pool">
              {pools.length === 0 ? (
                <p className="text-14 text-[color:var(--hc-color-text-supporting)]">No active pools configured. An admin can add pools in Settings → Config.</p>
              ) : (
                <div className="flex flex-col gap-8">
                  {pools.map(pool => (
                    <PickRow
                      key={pool.id}
                      checked={poolIds.includes(pool.id)}
                      onChange={() => setPoolIds(x => (x.includes(pool.id) ? x.filter(i => i !== pool.id) : [...x, pool.id]))}
                      icon={<Inbox className="size-16 shrink-0 text-[color:var(--hc-color-text-supporting)]" aria-hidden />}
                      title={pool.name}
                      sub={`Pool ID: ${pool.poolId}`}
                    />
                  ))}
                </div>
              )}
            </Section>

            <Section
              title="Message preview"
              end={editing
                ? <Button variant="default" size="sm" onClick={() => setEditing(false)}><Save /> Save</Button>
                : <Button variant="ghost" size="sm" onClick={() => setEditing(true)}><Pencil /> Edit</Button>}
            >
              {editing ? (
                <Textarea aria-label="Message" minRows={10} value={message} onChange={e => setMessage(e.target.value)} autoFocus />
              ) : (
                <pre className="whitespace-pre-wrap rounded-control bg-[color:var(--hc-color-bg-subtle)] px-16 py-12 text-14 leading-relaxed text-[color:var(--hc-color-text-secondary)] [font-family:var(--hc-font-sans)]">{message}</pre>
              )}
            </Section>

            {sendError && (
              <Alert variant="danger" role="alert"><Alert.Description>{sendError}</Alert.Description></Alert>
            )}

            <StepFooter>
              <Button variant="outline" size="sm" onClick={() => setStep(1)}><ArrowLeft /> Back</Button>
              <Button variant="cta" size="sm" onClick={send}><Send /> Send to all selected recipients</Button>
            </StepFooter>
          </div>
        )}
      </Card.Content>

      {addOpen && (
        <Dialog open onOpenChange={o => { if (!o) setAddOpen(false); }}>
          <Dialog.Content size="sm">
            <Dialog.Header>
              <Dialog.Title>Add recipients</Dialog.Title>
              <Dialog.Description>Search providers by name or NPI</Dialog.Description>
            </Dialog.Header>
            <Dialog.Body className="[&>*]:shrink-0">
              <div className="flex flex-col gap-12">
                <Input type="search" aria-label="Search providers" placeholder="Search by provider name or NPI…" autoFocus value={query}
                  onChange={e => { setQuery(e.target.value); setResults(searchProviders(e.target.value)); }} />
                {query.trim() === "" ? (
                  <p className="py-16 text-center text-14 text-[color:var(--hc-color-text-supporting)]">Start typing to search for providers by name or NPI.</p>
                ) : results.length === 0 ? (
                  <p className="py-16 text-center text-14 text-[color:var(--hc-color-text-supporting)]">No providers found</p>
                ) : (
                  <ul className="flex flex-col gap-8">
                    {results.map(pr => {
                      const added = addedProviders.some(a => a.id === pr.id || a.npi === pr.npi);
                      return (
                        <li key={pr.id} className="flex items-center gap-12 rounded-control border border-[color:var(--hc-color-border-default)] px-12 py-8">
                          <div className="flex min-w-0 flex-1 flex-col gap-4">
                            <span className="text-14 font-medium text-[color:var(--hc-color-text-primary)]">{pr.name}</span>
                            <span className="text-12 text-[color:var(--hc-color-text-supporting)]">NPI {pr.npi} · {pr.specialty}</span>
                          </div>
                          {added
                            ? <Badge variant="neutral" appearance="soft" size="sm">Added</Badge>
                            : <Button variant="outline" size="xs" onClick={() => setAddedProviders(x => [...x, pr])}>Add</Button>}
                        </li>
                      );
                    })}
                  </ul>
                )}
              </div>
            </Dialog.Body>
            <Dialog.Footer>
              <Dialog.Actions>
                <Button variant="default" size="sm" onClick={() => setAddOpen(false)}>Done</Button>
              </Dialog.Actions>
            </Dialog.Footer>
          </Dialog.Content>
        </Dialog>
      )}
      {scheduleOpen && <ScheduleFollowUpModal patient={p} onClose={() => setScheduleOpen(false)} />}
    </Card>
  );
}

function FollowUpStatus({ p, onSchedule }) {
  const decision = getFollowUpDecision(p.id);
  const latest = getFollowUps().filter(v => v.patientId === p.id && v.status === "Scheduled").sort((a, b) => new Date(b.followUpAt) - new Date(a.followUpAt))[0];
  if (decision === "scheduled" && latest) {
    return (
      <>
        <Badge variant="success" appearance="soft" size="md" leadingIcon={<CalendarClock />}>Follow-up scheduled · {fmtDateTime(latest.followUpAt)}</Badge>
        <Button variant="outline" size="sm" onClick={onSchedule}><CalendarClock /> Schedule another</Button>
      </>
    );
  }
  if (decision === "not_needed") {
    return (
      <>
        <Badge variant="neutral" appearance="soft" size="md">No follow-up needed</Badge>
        <Button variant="outline" size="sm" onClick={onSchedule}>Change</Button>
      </>
    );
  }
  return <Button variant="default" size="sm" onClick={onSchedule}><CalendarClock /> Schedule follow-up</Button>;
}
