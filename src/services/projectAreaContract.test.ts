import assert from 'node:assert/strict';
import test from 'node:test';
import { normalizeProject } from './api';
import { getAreaOptions, matchesArea } from './propertyPresentation';

const mappings = [
  ['SAH', 'Shah Alam'], ['KLG', 'Klang'], ['PAL', 'Puncak Alam'],
  ['PCH', 'Puchong'], ['JER', 'Jenjarom'], ['PI', 'Pulau Indah'],
  ['TPG', 'Telok Panglima Garang'], ['PJ', 'Petaling Jaya'],
];

test('Project ingestion canonicalizes all eight legacy areas and full names', () => {
  for (const [code, name] of mappings) {
    for (const value of [code, code.toLowerCase(), name, name.toUpperCase(), `  ${name.replace(/ /g, '   ')}  `]) {
      for (const field of ['AREA', 'area', 'Area']) {
        assert.equal(normalizeProject({ [field]: value }).AREA, name);
      }
    }
  }
});

test('mixed ingested records produce one Shah Alam option with accurate counts', () => {
  const projects = ['SAH', 'Shah Alam', ' sah ', 'SHAH ALAM', 'PAL'].map(AREA => normalizeProject({ AREA }));
  assert.deepEqual(getAreaOptions(projects.map(project => project.AREA)), ['Puncak Alam', 'Shah Alam']);
  assert.equal(projects.filter(project => matchesArea(project.AREA, 'Shah Alam')).length, 4);
});

test('area migration preserves all other normalized fields and does not mutate input', () => {
  const raw = {
    ID: 'SYNTHETIC-AREA-TEST', AREA: 'SAH', PROJECT_NAME: 'Synthetic Area Test',
    STATUS: 'Available', PUBLIC_VISIBILITY: 'Hidden', PRICE_FROM: '400000',
    'MAIN IMAGE': 'https://example.com/main.webp', GALLERY_URLS: 'https://example.com/gallery.webp',
    GOOGLE_MAPS_URL: 'https://example.com/map', DESCRIPTION: 'Unchanged description',
    PROPERTY_TYPE: 'Terrace', TENURE: 'Leasehold', LOT_STATUS: 'Open Title',
  };
  const original = structuredClone(raw);
  const legacy = normalizeProject(raw);
  const canonical = normalizeProject({ ...raw, AREA: 'Shah Alam' });
  assert.deepEqual(legacy, canonical);
  assert.deepEqual(raw, original);
  for (const [field, value] of Object.entries(raw)) {
    if (field !== 'AREA' && field !== 'MAIN IMAGE') assert.equal(legacy[field as keyof typeof legacy], value);
  }
  assert.equal(legacy.MAIN_IMAGE, raw['MAIN IMAGE']);
});

test('unknown and missing Project areas remain supported', () => {
  assert.equal(normalizeProject({ AREA: '  bandar   baru  ' }).AREA, 'Bandar Baru');
  assert.equal(normalizeProject({ AREA: 'XYZ' }).AREA, 'Xyz');
  assert.equal(normalizeProject({}).AREA, '');
});
