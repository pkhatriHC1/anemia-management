import { forwardRef } from "react";
import type { CSSProperties } from "react";
import type {
  BadgeAppearance,
  BadgeProps,
  BadgeSize,
  BadgeVariant,
} from "./Badge.types";

// Design-system CSS variables — imported here so consumers get tokens
// automatically wherever they mount the Badge.
import "../../tokens/css/variables.css";
import "./Badge.css";

/* ══════ CLASS NAMES ═══════════════════════════════════════════════ */

const CLASS = {
  root:        "hc-badge",
  variant:     (v: BadgeVariant)    => `hc-badge--variant-${v}`,
  appearance:  (a: BadgeAppearance) => `hc-badge--appearance-${a}`,
  size:        (s: BadgeSize)       => `hc-badge--size-${s}`,
  disabled:    "hc-badge--disabled",
  count:       "hc-badge--count",
  removable:   "hc-badge--removable",

  dot:         "hc-badge__dot",
  leading:     "hc-badge__leading",
  trailing:    "hc-badge__trailing",
  label:       "hc-badge__label",
  remove:      "hc-badge__remove",
};

function cx(...parts: (string | false | null | undefined)[]) {
  return parts.filter(Boolean).join(" ");
}

/* ══════ COMPONENT ═════════════════════════════════════════════════ */

/**
 * HC1 Badge — the canonical status-indicator primitive.
 *
 * Rendering rules:
 *   - The root is a `<span>`. Badges are inline surfaces, not blocks.
 *   - When `count` is provided, it becomes the content — the badge
 *     renders as a pill and any children are ignored.
 *   - When `dot` is set, a small variant-colored dot renders before
 *     the label. `dot` and `leadingIcon` do not stack — `dot` wins.
 *   - When `onRemove` is provided, a trailing "✕" button renders in
 *     the trailing slot. The X is a real button — the badge itself
 *     is never a button (that would break the "not a filter" rule).
 *   - When `disabled` is true, the badge dims and the remove control
 *     is disabled. The badge itself is not a form control.
 */
export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(function Badge(
  {
    variant     = "default",
    appearance  = "soft",
    size        = "md",
    dot         = false,
    leadingIcon,
    trailingIcon,
    count,
    maxCount    = 99,
    onRemove,
    removeLabel = "Remove",
    disabled    = false,
    className,
    children,
    style,
    ...rest
  },
  ref,
) {
  const hasCount    = typeof count === "number";
  const isRemovable = typeof onRemove === "function";

  // When `count` is set it takes over the content and forces the pill
  // shape. Children are ignored — passing both is not composed.
  const content = hasCount
    ? count > maxCount
      ? `${maxCount}+`
      : String(count)
    : children;

  const rootClass = cx(
    CLASS.root,
    CLASS.variant(variant),
    CLASS.appearance(appearance),
    CLASS.size(size),
    hasCount && CLASS.count,
    isRemovable && CLASS.removable,
    disabled && CLASS.disabled,
    className,
  );

  return (
    <span
      {...rest}
      ref={ref}
      className={rootClass}
      aria-disabled={disabled || undefined}
      style={style as CSSProperties}
    >
      {dot && !hasCount && (
        <span className={CLASS.dot} aria-hidden="true" />
      )}
      {!dot && leadingIcon && !hasCount && (
        <span className={CLASS.leading} aria-hidden="true">{leadingIcon}</span>
      )}
      <span className={CLASS.label}>{content}</span>
      {isRemovable ? (
        <button
          type="button"
          className={CLASS.remove}
          onClick={onRemove}
          disabled={disabled}
          aria-label={removeLabel}
        >
          <RemoveIcon />
        </button>
      ) : (
        trailingIcon && !hasCount && (
          <span className={CLASS.trailing} aria-hidden="true">{trailingIcon}</span>
        )
      )}
    </span>
  );
});
Badge.displayName = "Badge";

/**
 * Built-in remove glyph. Uses `currentColor` so it inherits the badge's
 * ink from the active variant × appearance pairing.
 */
function RemoveIcon() {
  return (
    <svg
      viewBox="0 0 12 12"
      width="1em"
      height="1em"
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      <path
        d="M2.5 2.5L9.5 9.5M9.5 2.5L2.5 9.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}
