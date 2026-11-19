import test from 'node:test';
import assert from 'node:assert/strict';
import {
  computeDistanceToViewportCenter,
  pickCenteredCardId,
  CardViewportMetrics
} from './videoViewport';

test('computeDistanceToViewportCenter returns 0 when perfectly centered', () => {
  const dist = computeDistanceToViewportCenter(250, 300, 0, 800);
  assert.equal(dist, 0);
});

test('computeDistanceToViewportCenter computes positive distance when off-center', () => {
  const dist = computeDistanceToViewportCenter(50, 200, 0, 800);
  // element center = 150, viewport center = 400 -> distance = 250
  assert.equal(dist, 250);
});

test('pickCenteredCardId returns null when no cards are intersecting', () => {
  const cards: CardViewportMetrics[] = [
    { id: 'a', isIntersecting: false, intersectionRatio: 0, distanceToCenter: 10 },
    { id: 'b', isIntersecting: true, intersectionRatio: 0, distanceToCenter: 5 }
  ];
  assert.equal(pickCenteredCardId(cards), null);
});

test('pickCenteredCardId picks the single card closest to viewport center', () => {
  const cards: CardViewportMetrics[] = [
    { id: 'top-card', isIntersecting: true, intersectionRatio: 0.7, distanceToCenter: 260 },
    { id: 'center-card', isIntersecting: true, intersectionRatio: 0.95, distanceToCenter: 18 },
    { id: 'bottom-card', isIntersecting: true, intersectionRatio: 0.4, distanceToCenter: 310 }
  ];
  assert.equal(pickCenteredCardId(cards), 'center-card');
});

test('pickCenteredCardId breaks ties within 1px using highest intersectionRatio', () => {
  const cards: CardViewportMetrics[] = [
    { id: 'left-col', isIntersecting: true, intersectionRatio: 0.65, distanceToCenter: 40 },
    { id: 'mid-col', isIntersecting: true, intersectionRatio: 0.92, distanceToCenter: 40.5 },
    { id: 'right-col', isIntersecting: true, intersectionRatio: 0.5, distanceToCenter: 40 }
  ];
  assert.equal(pickCenteredCardId(cards), 'mid-col');
});
