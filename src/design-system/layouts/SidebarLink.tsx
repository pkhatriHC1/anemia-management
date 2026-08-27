import { useState } from "react";
import { scrollToSection } from "../utils";
import { aliases } from "../tokens";

const { color, radius, spacing } = aliases;

export function SidebarLink({
  id,
  label,
  active,
}: {
  id: string;
  label: string;
  active: boolean;
}) {
  const [hover, setHover] = useState(false);

  const background = active
    ? color.background.subtle
    : hover
      ? color.background.subtle
      : "transparent";
  const textColor = active ? color.action.primary : color.text.secondary;
  const fontWeight = active ? 600 : 400;

  return (
    <a
      href={`#${id}`}
      onClick={e => {
        e.preventDefault();
        scrollToSection(id);
      }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      aria-current={active ? "location" : undefined}
      style={{
        display: "block",
        width: "100%",
        padding: `${spacing.inline.xs} ${spacing.inline.md}`,
        borderRadius: radius.control,
        fontSize: 14,
        fontWeight,
        color: textColor,
        background,
        textDecoration: "none",
        transition: "background 150ms cubic-bezier(0.2, 0, 0, 1), color 150ms cubic-bezier(0.2, 0, 0, 1)",
      }}
    >
      {label}
    </a>
  );
}
