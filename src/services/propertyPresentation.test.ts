import assert from 'node:assert/strict';
import test from 'node:test';
import {
  calculateMonthlyEstimate,
  formatRinggit,
  getPropertySizeDisplay,
  normalizeArea,
} from './propertyPresentation';

test('formats property prices with RM and thousands separators', () => {
  assert.equal(formatRinggit('420000'), 'RM420,000');
  assert.equal(formatRinggit('RM 608846'), 'RM608,846');
});

test('calculates the approved 3.8%, 35-year monthly estimate', () => {
  assert.equal(calculateMonthlyEstimate('420000'), 1810);
  assert.equal(calculateMonthlyEstimate('608846'), 2623);
  assert.equal(calculateMonthlyEstimate('449820'), 1938);
});

test('normalizes area aliases and chooses the relevant property size', () => {
  assert.equal(normalizeArea('SAH'), 'Shah Alam');
  assert.deepEqual(getPropertySizeDisplay('Apartment', '924', '0'), {
    label: 'Luas Binaan', value: '924',
  });
  assert.deepEqual(getPropertySizeDisplay('Double Storey Terrace', '1802', '1650'), {
    label: 'Luas Tanah', value: '1650',
  });
});
