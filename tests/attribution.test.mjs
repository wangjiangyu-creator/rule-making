import assert from 'node:assert/strict';
import test from 'node:test';
import {
  authorDisplay,
  attributionDisplay,
  hasAttribution,
} from '../src/lib/attribution.js';

test('authorDisplay joins multiple authors naturally', () => {
  assert.equal(
    authorDisplay([
      { name: 'Judith Goldstein', kind: 'person' },
      { name: 'Miles Kahler', kind: 'person' },
      { name: 'Robert O. Keohane', kind: 'person' },
    ]),
    'Judith Goldstein, Miles Kahler, and Robert O. Keohane',
  );
});

test('attributionDisplay combines authors and publisher', () => {
  assert.equal(
    attributionDisplay({
      authors: [{ name: 'Richard H. Steinberg', kind: 'person' }],
      publisher: 'Cambridge University Press',
    }),
    'Richard H. Steinberg | Cambridge University Press',
  );
});

test('attributionDisplay falls back to publisher-only when authors are absent', () => {
  assert.equal(
    attributionDisplay({ publisher: 'World Trade Organization' }),
    'World Trade Organization',
  );
});

test('hasAttribution is false when neither authors nor publisher is present', () => {
  assert.equal(hasAttribution({}), false);
});
