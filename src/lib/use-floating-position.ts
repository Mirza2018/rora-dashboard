"use client";

import * as React from "react";

type Placement = "top" | "bottom" | "left" | "right";

/**
 * Positions a floating panel (dropdown, popover, flyout) relative to a trigger
 * element using fixed coordinates computed from getBoundingClientRect. This:
 *  - keeps the panel visible even when the trigger is inside a modal/scroll container
 *  - flips the panel to the opposite side when there isn't enough room
 *  - caps the panel's size to whatever space is actually available
 *
 * Usage:
 *   const { triggerRef, panelRef, style, placement } = useFloatingPosition(open)
 *   <button ref={triggerRef}>...</button>
 *   {open && <div ref={panelRef} style={style}>...</div>}
 */
export function useFloatingPosition(
  open: boolean,
  {
    gap = 6,
    matchWidth = true,
    align = "start",
    side = "bottom",
  }: {
    gap?: number;
    matchWidth?: boolean;
    align?: "start" | "end";
    /** "bottom" (default, flips to "top") or "right" (flips to "left"). */
    side?: "bottom" | "right";
  } = {},
) {
  const triggerRef = React.useRef<HTMLElement | null>(null);
  const panelRef = React.useRef<HTMLElement | null>(null);
  const [style, setStyle] = React.useState<React.CSSProperties>({
    visibility: "hidden",
  });
  const [placement, setPlacement] = React.useState<Placement>("bottom");

  React.useLayoutEffect(() => {
    if (!open) {
      setStyle({ visibility: "hidden" });
      return;
    }

    function reposition() {
      const trigger = triggerRef.current;
      const panel = panelRef.current;
      if (!trigger || !panel) return;

      const triggerRect = trigger.getBoundingClientRect();
      const panelWidth = panel.offsetWidth;
      const panelHeight = panel.offsetHeight;
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;

      if (side === "right") {
        const spaceRight = viewportWidth - triggerRect.right;
        const spaceLeft = triggerRect.left;
        const openLeft =
          spaceRight < panelWidth + gap && spaceLeft > spaceRight;

        let top = triggerRect.top;
        top = Math.max(gap, Math.min(top, viewportHeight - panelHeight - gap));

        setPlacement(openLeft ? "left" : "right");
        setStyle({
          position: "fixed",
          top,
          left: openLeft ? undefined : triggerRect.right + gap,
          right: openLeft ? viewportWidth - triggerRect.left + gap : undefined,
          maxHeight: viewportHeight - gap * 2,
          visibility: "visible",
        });
        return;
      }

      const spaceBelow = viewportHeight - triggerRect.bottom;
      const spaceAbove = triggerRect.top;

      // Flip up only if there's not enough room below AND more room above.
      const openUp = spaceBelow < panelHeight + gap && spaceAbove > spaceBelow;

      let left: number;
      if (matchWidth) {
        left = triggerRect.left;
      } else {
        left =
          align === "end" ? triggerRect.right - panelWidth : triggerRect.left;
        left = Math.max(gap, Math.min(left, viewportWidth - panelWidth - gap));
      }

      setPlacement(openUp ? "top" : "bottom");
      setStyle({
        position: "fixed",
        left,
        width: matchWidth ? triggerRect.width : undefined,
        top: openUp ? undefined : triggerRect.bottom + gap,
        bottom: openUp ? viewportHeight - triggerRect.top + gap : undefined,
        maxHeight: Math.max(120, (openUp ? spaceAbove : spaceBelow) - gap * 2),
        visibility: "visible",
      });
    }

    // Measure after the panel has rendered (so panel dimensions are real),
    // runs before paint so there's no visible flash.
    reposition();

    window.addEventListener("resize", reposition);
    window.addEventListener("scroll", reposition, true);
    return () => {
      window.removeEventListener("resize", reposition);
      window.removeEventListener("scroll", reposition, true);
    };
  }, [open, gap, matchWidth, align, side]);

  return { triggerRef, panelRef, style, placement };
}
