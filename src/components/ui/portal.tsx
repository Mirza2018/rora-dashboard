"use client";

import * as React from "react";
import { createPortal } from "react-dom";

/**
 * Renders children into document.body instead of their normal DOM position.
 * Use for floating panels (dropdowns, flyouts) that must never be clipped or
 * out-stacked by an ancestor's `overflow: hidden` or stacking context.
 *
 * Renders synchronously (no mount-gating useEffect) so that a ref placed on
 * the portaled content is already attached by the time a sibling/parent's
 * useLayoutEffect runs in the same commit — these are only ever opened in
 * response to user interaction, well after hydration, so `document` is
 * always available when this actually renders.
 */
export function Portal({ children }: { children: React.ReactNode }) {
  if (typeof document === "undefined") return null;
  return createPortal(children, document.body);
}
