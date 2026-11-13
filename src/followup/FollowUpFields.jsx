import { Checkbox, DatePicker, Select } from "@hc1com/design-system";
import { SPECIALTIES } from "./followUpStore";

/* Visit times offered in 15-minute steps across the clinic day. */
const pad = n => String(n).padStart(2, "0");
const TIME_OPTIONS = [];
for (let h = 7; h <= 19; h++) {
  for (const m of [0, 15, 30, 45]) {
    if (h === 19 && m > 0) break;
    const label = `${((h + 11) % 12) + 1}:${pad(m)} ${h < 12 ? "AM" : "PM"}`;
    TIME_OPTIONS.push({ value: `${pad(h)}:${pad(m)}`, label });
  }
}
const DEFAULT_TIME = "09:00";

const timeOf = iso => {
  if (!iso) return undefined;
  const d = new Date(iso);
  if (isNaN(d)) return undefined;
  return `${pad(d.getHours())}:${pad(d.getMinutes())}`;
};

/** Combine a calendar day and an "HH:MM" time into one ISO timestamp. */
const combine = (day, time) => {
  if (!day) return null;
  const [h, m] = (time || DEFAULT_TIME).split(":").map(Number);
  const d = new Date(day);
  d.setHours(h, m, 0, 0);
  return d.toISOString();
};

const FieldLabel = ({ children, htmlFor }) => (
  <label htmlFor={htmlFor} className="text-14 font-medium text-[color:var(--hc-color-text-primary)]">
    {children} <span className="text-[color:var(--hc-color-status-error-fg)]" aria-hidden>*</span>
  </label>
);

/** Referral specialty (one or more) and the follow-up date and time. */
export function FollowUpFields({ specialties, onSpecialtiesChange, followUpAt, onFollowUpAtChange }) {
  const day = followUpAt ? new Date(followUpAt) : undefined;
  const existingTime = timeOf(followUpAt);
  const timeOptions = existingTime && !TIME_OPTIONS.some(o => o.value === existingTime)
    ? [{ value: existingTime, label: existingTime }, ...TIME_OPTIONS]
    : TIME_OPTIONS;
  const toggle = sp => onSpecialtiesChange(specialties.includes(sp) ? specialties.filter(s => s !== sp) : [...specialties, sp]);

  return (
    <div className="flex flex-col gap-24">
      <fieldset className="flex flex-col gap-12">
        <legend className="mb-12"><FieldLabel>Referral specialty</FieldLabel></legend>
        {SPECIALTIES.map(sp => (
          <Checkbox key={sp} checked={specialties.includes(sp)} onCheckedChange={() => toggle(sp)}>{sp}</Checkbox>
        ))}
      </fieldset>

      <div className="flex flex-col gap-8">
        <FieldLabel>Follow-up date and time</FieldLabel>
        <div className="grid grid-cols-[minmax(0,3fr)_minmax(0,2fr)] gap-12">
          <DatePicker
            ariaLabel="Follow-up date"
            placeholder="Choose a date"
            value={day}
            onChange={d => onFollowUpAtChange(combine(d, existingTime))}
          />
          <Select
            aria-label="Follow-up time"
            placeholder="Time"
            options={timeOptions}
            value={existingTime}
            onChange={t => onFollowUpAtChange(combine(day || new Date(), t))}
            fullWidth
          />
        </div>
      </div>
    </div>
  );
}
