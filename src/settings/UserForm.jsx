import { useMemo, useState } from "react";
import { ArrowLeft, Save } from "lucide-react";
import { Alert, Button, Card, Checkbox, Input, PageHeader, Select } from "@hc1com/design-system";
import { PageTemplate } from "@hc1com/design-system/patterns";

const STORAGE_KEY = "clinicaliq-feature-users";

const ROLE_GROUPS = [
  { label: "Client Admin", children: ["Contents", "Users", "Settings", "Clinical Navigation", "Reports", "Mappings"] },
  { label: "Read Only", children: [] },
];
const FACILITY_GROUPS = [
  { label: "Test Region", children: ["Test Facility 2", "Test Facility 3", "Test Facility 1"] },
  { label: "Test Region 2", children: [] },
  { label: "Test Region 3", children: ["Testing North Hospital"] },
];
const NAME_FIELDS = [
  ["firstName", "First name", true],
  ["middleName", "Middle name", false],
  ["lastName", "Last name", true],
  ["title", "Title", false],
  ["suffix", "Suffix", false],
  ["credentials", "Credentials", true],
];
const STATUS_OPTIONS = [{ value: "Active", label: "Active" }, { value: "Inactive", label: "Inactive" }];

const initialForm = {
  firstName: "", middleName: "", lastName: "", title: "", suffix: "",
  credentials: "", clinicalRole: "", email: "", status: "Active",
};

/** A group checkbox with its children indented beneath it. */
function TreeCheckboxes({ groups, selected, onChange }) {
  const toggle = value => onChange(selected.includes(value) ? selected.filter(v => v !== value) : [...selected, value]);
  const toggleGroup = group => {
    const values = [group.label, ...group.children];
    const all = values.every(v => selected.includes(v));
    onChange(all ? selected.filter(v => !values.includes(v)) : [...new Set([...selected, ...values])]);
  };
  return (
    <div className="flex flex-col gap-16">
      {groups.map(group => {
        const some = group.children.some(c => selected.includes(c));
        const checked = selected.includes(group.label);
        return (
          <div key={group.label} className="flex flex-col gap-12">
            <Checkbox checked={checked} indeterminate={!checked && some} onCheckedChange={() => toggleGroup(group)}>
              <span className="font-medium">{group.label}</span>
            </Checkbox>
            {group.children.length > 0 && (
              <div className="ml-12 flex flex-col gap-12 border-l border-[color:var(--hc-color-border-subtle)] pl-20">
                {group.children.map(child => (
                  <Checkbox key={child} checked={selected.includes(child)} onCheckedChange={() => toggle(child)}>{child}</Checkbox>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

function Section({ title, description, children }) {
  return (
    <Card variant="default" density="comfortable">
      <Card.Header>
        <Card.Title>{title}</Card.Title>
        {description && <Card.Description>{description}</Card.Description>}
      </Card.Header>
      <Card.Content>{children}</Card.Content>
    </Card>
  );
}

/** Create (or edit) a user: identity, roles, facilities and email preferences. */
export function UserForm({ onBack, editingUser }) {
  const [form, setForm] = useState(() => (editingUser ? { ...initialForm, ...editingUser } : initialForm));
  const [roles, setRoles] = useState(editingUser?.roles || []);
  const [facilities, setFacilities] = useState(editingUser?.facilities || []);
  const [optOut, setOptOut] = useState(false);
  const [saved, setSaved] = useState(false);
  const [missing, setMissing] = useState([]);

  const update = (field, value) => { setForm(f => ({ ...f, [field]: value })); setSaved(false); setMissing([]); };
  const fullName = useMemo(() => [form.firstName, form.middleName, form.lastName].filter(Boolean).join(" "), [form]);

  const save = () => {
    const required = [["firstName", "First name"], ["lastName", "Last name"], ["email", "Email"], ["credentials", "Credentials"], ["clinicalRole", "Clinical role"]];
    const gaps = required.filter(([k]) => !String(form[k]).trim());
    if (gaps.length > 0) { setMissing(gaps.map(([k]) => k)); setSaved(false); return; }
    let existing = [];
    try { existing = JSON.parse(window.localStorage.getItem(STORAGE_KEY) || "[]"); } catch { existing = []; }
    const record = { ...form, roles, facilities, notificationOptOut: optOut };
    const next = editingUser
      ? existing.map(u => (u.id === editingUser.id ? { ...record, id: editingUser.id, createdAt: editingUser.createdAt, updatedAt: new Date().toISOString() } : u))
      : [...existing, { ...record, id: crypto.randomUUID(), createdAt: new Date().toISOString() }];
    try { window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next)); } catch { /* keep the form usable */ }
    setSaved(true);
  };

  const errorFor = (k, label) => (missing.includes(k) ? `${label} is required` : undefined);
  const missingLabels = { firstName: "First name", lastName: "Last name", email: "Email", credentials: "Credentials", clinicalRole: "Clinical role" };

  return (
    <PageTemplate variant="focused">
      <PageHeader
        breadcrumb={<Button variant="link" size="sm" className="px-0" onClick={onBack}><ArrowLeft /> Back to worklist</Button>}
        title={editingUser ? "Edit user" : "Create user"}
        subtitle="Users can sign in to ClinicalIQ with the roles and facilities chosen here"
        actions={<Button variant="default" size="sm" onClick={save}><Save /> {saved ? "User saved" : "Save user"}</Button>}
      />

      {missing.length > 0 && (
        <Alert variant="danger">
          <Alert.Title>Some required fields are empty</Alert.Title>
          <Alert.Description>{missing.map(k => missingLabels[k]).join(", ")} {missing.length > 1 ? "are" : "is"} required.</Alert.Description>
        </Alert>
      )}
      {saved && (
        <Alert variant="success">
          <Alert.Title>{fullName || "User"} was saved</Alert.Title>
          <Alert.Description>They now appear in the shared user directory.</Alert.Description>
        </Alert>
      )}

      <Section title="User information">
        <div className="flex flex-col gap-16">
          <div className="grid grid-cols-1 gap-16 md:grid-cols-3">
            {NAME_FIELDS.map(([field, label, req]) => (
              <Input
                key={field}
                label={label}
                required={req}
                optional={!req}
                value={form[field]}
                onChange={e => update(field, e.target.value)}
                errorMessage={req ? errorFor(field, label) : undefined}
                validation={req && missing.includes(field) ? "error" : undefined}
                fullWidth
              />
            ))}
          </div>
          <div className="grid grid-cols-1 gap-16 md:grid-cols-3">
            <Input label="Clinical role" required value={form.clinicalRole} onChange={e => update("clinicalRole", e.target.value)}
              placeholder="For example, Anemia Nurse Navigator"
              errorMessage={errorFor("clinicalRole", "Clinical role")} validation={missing.includes("clinicalRole") ? "error" : undefined} fullWidth />
            <Input label="Email" type="email" required value={form.email} onChange={e => update("email", e.target.value)}
              placeholder="name@hospital.org"
              errorMessage={errorFor("email", "Email")} validation={missing.includes("email") ? "error" : undefined} fullWidth />
            <Select label="Status" required options={STATUS_OPTIONS} value={form.status} onChange={v => update("status", v)} fullWidth />
          </div>
        </div>
      </Section>

      <div className="grid grid-cols-1 gap-24 md:grid-cols-2">
        <Section title="User roles" description="What the user can see and change">
          <TreeCheckboxes groups={ROLE_GROUPS} selected={roles} onChange={setRoles} />
        </Section>
        <Section title="User facilities" description="Which facilities' patients the user can see">
          <TreeCheckboxes groups={FACILITY_GROUPS} selected={facilities} onChange={setFacilities} />
        </Section>
      </div>

      <Section title="Email preferences">
        <Checkbox checked={optOut} onCheckedChange={setOptOut}>Opt out of notification emails</Checkbox>
      </Section>
    </PageTemplate>
  );
}
