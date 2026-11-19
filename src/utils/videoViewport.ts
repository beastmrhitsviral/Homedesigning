export interface CardViewportMetrics {
  id: string;
  isIntersecting: boolean;
  intersectionRatio: number;
  distanceToCenter: number;
}

/**
 * Computes the vertical pixel distance from an element's center to the viewport's center.
 */
export function computeDistanceToViewportCenter(
  rectTop: number,
  rectHeight: number,
  viewportTop: number,
  viewportHeight: number
): number {
  const elementCenter = rectTop + rectHeight / 2;
  const viewportCenter = viewportTop + viewportHeight / 2;
  return Math.abs(elementCenter - viewportCenter);
}

/**
 * Selects the single card ID currently most centered in the viewport.
 * Returns null if no cards are intersecting.
 */
export function pickCenteredCardId(metrics: CardViewportMetrics[]): string | null {
  const visible = metrics.filter((m) => m.isIntersecting && m.intersectionRatio > 0);
  if (visible.length === 0) return null;

  let best = visible[0];
  for (let i = 1; i < visible.length; i++) {
    const candidate = visible[i];
    const distDiff = candidate.distanceToCenter - best.distanceToCenter;

    if (distDiff < -1) {
      best = candidate;
    } else if (Math.abs(distDiff) <= 1 && candidate.intersectionRatio > best.intersectionRatio) {
      best = candidate;
    }
  }

  return best.id;
}
