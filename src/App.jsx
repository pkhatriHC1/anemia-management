import { useEffect, useState } from "react";
import { Toast } from "@hc1com/design-system";
import { AssistantPanel } from "@hc1com/design-system/patterns";
import { ClinicalShell } from "./shell/ClinicalShell";
import { PatientWorklist } from "./worklist/PatientWorklist";
import { PatientWorkspace } from "./workspace/PatientWorkspace";
import { CarePlan } from "./workspace/CarePlan";
import { TrsDialog } from "./workspace/TrsDialog";
import { UserForm } from "./settings/UserForm";
import { FollowUpWorklist } from "./followup/FollowUpWorklist";
import { VisitCancellationModal } from "./followup/VisitCancellationModal";
import { EpicPoolConfig } from "./settings/EpicPoolConfig";
import { cancelPatientVisit, getVisitCancellations } from "./followup/visitCancellationStore";
import { getCompletedPatients } from "./lib/notifyStores";
import { PATIENTS, getAnemiaGrade } from "./lib/clinical";

const time = () => new Date().toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });

/** Re-render when another part of the prototype changes shared demo state. */
function useStoreEvents(events, read) {
  const [value, setValue] = useState(read);
  useEffect(() => {
    const update = () => setValue(read());
    events.forEach(e => window.addEventListener(e, update));
    return () => events.forEach(e => window.removeEventListener(e, update));
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  return value;
}

export default function App() {
  const [screen, setScreen] = useState("worklist");
  const [activePatient, setActivePatient] = useState(null);
  const [defaultZone, setDefaultZone] = useState("overview");
  const [returnTo, setReturnTo] = useState("worklist");
  const [cancellationPatient, setCancellationPatient] = useState(null);
  const [trsPatient, setTrsPatient] = useState(null);
  const [toast, setToast] = useState("");
  const [assistantOpen, setAssistantOpen] = useState(false);
  const [messages, setMessages] = useState([]);

  const completed = useStoreEvents(["case-completions-updated", "storage"], getCompletedPatients);
  const cancellations = useStoreEvents(["visit-cancellations-updated", "storage"], getVisitCancellations);
  useStoreEvents(["storage", "care-coordination-updated", "follow-ups-updated"], () => Date.now());

  const openPatient = (p, zone = "overview", from = "worklist") => {
    setActivePatient(p); setDefaultZone(zone); setReturnTo(from); setScreen("workspace");
  };
  const openPatientFromFollowUp = patientId => {
    const p = PATIENTS.find(pt => pt.id === patientId);
    if (p) openPatient(p, "overview", "followup");
  };

  /* IQ Assistant: answers about the open patient (demo replies, as in the original prototype). */
  const assistantPatient = screen === "workspace" ? activePatient : null;
  useEffect(() => {
    setMessages([{
      id: "greeting", role: "assistant", time: time(),
      content: assistantPatient
        ? `IQ Assistant ready for ${assistantPatient.name}. Ask about transfusion risk, differential diagnosis, or optimization recommendations.`
        : "IQ Assistant ready. Open a patient to ask about their transfusion risk, differential diagnosis or optimization recommendations.",
    }]);
  }, [assistantPatient?.id]); // eslint-disable-line react-hooks/exhaustive-deps
  const ask = text => {
    const q = text.trim();
    if (!q) return;
    setMessages(m => [...m, { id: `u${m.length}`, role: "user", content: q, time: time() }]);
    const p = assistantPatient;
    const reply = p
      ? `Based on ${p.name}'s profile and AABB guidelines — recommended: ${p.order}. ${getAnemiaGrade(p.labs[0].value).label === "Severe" ? "Immediate intervention warranted." : "Optimization window remains open."}`
      : "Open a patient from the worklist and I can answer with their labs, risk score and recommendations in view.";
    setTimeout(() => setMessages(m => [...m, { id: `a${m.length}`, role: "assistant", content: reply, time: time() }]), 500);
  };

  let content;
  if (screen === "users") content = <UserForm onBack={() => setScreen("worklist")} />;
  else if (screen === "config") content = <EpicPoolConfig onBack={() => setScreen("worklist")} />;
  else if (screen === "followup") content = <FollowUpWorklist patients={PATIENTS} onOpenPatient={openPatientFromFollowUp} />;
  else if (screen === "workspace" && activePatient) {
    content = (
      <PatientWorkspace
        patient={activePatient}
        defaultZone={defaultZone}
        backLabel={returnTo === "followup" ? "Back to follow-up visits" : "Back to worklist"}
        onBack={() => { setScreen(returnTo); setReturnTo("worklist"); }}
        renderCarePlan={p => <CarePlan key={p.id} p={p} />}
      />
    );
  } else {
    content = (
      <PatientWorklist
        completed={new Set(completed)}
        cancelled={new Set(Object.keys(cancellations))}
        onOpen={(p, zone) => openPatient(p, zone)}
        onCancel={setCancellationPatient}
        onOpenTrs={setTrsPatient}
      />
    );
  }

  return (
    <ClinicalShell screen={screen} onNavigate={setScreen} onOpenAssistant={() => setAssistantOpen(true)}>
      {content}
      {trsPatient && <TrsDialog p={trsPatient} onClose={() => setTrsPatient(null)} />}
      {cancellationPatient && (
        <VisitCancellationModal
          patient={cancellationPatient}
          onClose={() => setCancellationPatient(null)}
          onConfirm={reason => {
            cancelPatientVisit({ patientId: cancellationPatient.id, patientName: cancellationPatient.name, visitDate: cancellationPatient.admitDate, reason });
            setCancellationPatient(null);
            setToast("The follow-up visit was cancelled.");
          }}
        />
      )}
      <AssistantPanel
        open={assistantOpen}
        onOpenChange={setAssistantOpen}
        title="IQ Assistant"
        subtitle={assistantPatient ? `Anemia management · ${assistantPatient.name}` : "Anemia management"}
        messages={messages}
        onSend={ask}
        placeholder={assistantPatient ? "Ask about this patient…" : "Ask a question…"}
        footnote="Recommendations follow AABB guidelines. A clinician reviews every action."
      />
      {toast && (
        <div className="fixed right-24 bottom-24 z-[var(--hc-z-toast)]">
          <Toast variant="success" onDismiss={() => setToast("")}>
            <Toast.Title>{toast}</Toast.Title>
          </Toast>
        </div>
      )}
    </ClinicalShell>
  );
}
