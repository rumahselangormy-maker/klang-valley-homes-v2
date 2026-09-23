import assert from 'node:assert/strict';
import test from 'node:test';
import {
  calculateMonthlyEstimate,
  formatRinggit,
  getPropertySizeDisplay,
  normalizeArea,
  matchesArea,
  getAreaOptions,
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

const verifiedAreas = [
  ['SAH', 'Shah Alam'], ['PAL', 'Puncak Alam'], ['KLG', 'Klang'], ['PCH', 'Puchong'],
  ['JER', 'Jenjarom'], ['PI', 'Pulau Indah'], ['TPG', 'Telok Panglima Garang'], ['PJ', 'Petaling Jaya'],
];

for (const [id, name] of verifiedAreas) {
  test('normalizes and matches verified area ' + id, () => {
    assert.equal(normalizeArea(id), name);
    assert.equal(normalizeArea('  ' + id.toLowerCase() + '  '), name);
    assert.equal(normalizeArea(name.toUpperCase()), name);
    assert.equal(matchesArea(id, name), true);
    assert.equal(matchesArea(name, id), true);
    assert.equal(matchesArea(name.toUpperCase(), name), true);
  });
}

test('deduplicates area dropdown names and IDs without changing input records', () => {
  const values = verifiedAreas.flatMap(([id, name]) => [id, name, name.toUpperCase()]);
  const original = [...values];
  assert.deepEqual(getAreaOptions([...values, '', '  ']), verifiedAreas.map(([, name]) => name).sort());
  assert.deepEqual(values, original);
});

test('keeps unknown and free-text areas usable without admitting unrelated matches', () => {
  assert.equal(normalizeArea('  bandar   baru  '), 'Bandar Baru');
  assert.equal(normalizeArea('XYZ'), 'Xyz');
  assert.equal(matchesArea('Bandar Baru', 'bandar baru'), true);
  assert.equal(matchesArea('XYZ', 'xyz'), true);
  assert.equal(matchesArea('XYZ', ''), true);
  assert.equal(matchesArea('', ''), true);
  assert.equal(matchesArea('', 'Shah Alam'), false);
  assert.equal(matchesArea('PAL', 'Shah Alam'), false);
  assert.deepEqual(getAreaOptions(['XYZ', 'xyz', 'Bandar Baru']), ['Bandar Baru', 'Xyz']);
});

test('counts supplied public inventory consistently with area filtering', () => {
  const areas = ['SAH', 'PAL', 'SAH'];
  assert.equal(areas.filter(area => matchesArea(area, 'Shah Alam')).length, 2);
  assert.equal(areas.filter(area => matchesArea(area, 'Puncak Alam')).length, 1);
});
