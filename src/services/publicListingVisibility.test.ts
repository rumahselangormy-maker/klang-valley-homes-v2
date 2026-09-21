import assert from 'node:assert/strict';
import test from 'node:test';
import { onRequestGet as getProjectsApi } from '../../functions/api/projects';
import { onRequestGet as getSubsaleApi } from '../../functions/api/subsale';
import {
  fetchProjects,
  fetchSubsale,
  normalizeProject,
  normalizeSubsale,
} from './api';
import {
  createPublicListingResponse,
  filterPublicListings,
  findPublicListingBySlug,
  isPublicListing,
} from './publicListingVisibility';

const originalFetch = globalThis.fetch;

test.afterEach(() => {
  globalThis.fetch = originalFetch;
});

test('only exact Available is public after case and whitespace normalization', () => {
  const cases: Array<[unknown, boolean]> = [
    ['Available', true],
    [' available ', true],
    ['AVAILABLE', true],
    ['AvAiLaBlE', true],
    ['Off Market', false],
    ['Draft', false],
    ['Unpublished', false],
    ['Sold', false],
    ['Booked', false],
    ['', false],
    ['Availability', false],
    ['Available Now', false],
    [undefined, false],
    [null, false],
  ];

  for (const [STATUS, expected] of cases) {
    assert.equal(isPublicListing({ STATUS }), expected, String(STATUS));
  }

  assert.equal(isPublicListing({}), false);
  assert.equal(isPublicListing(null), false);
});

test('Project and Subsale collections both hide non-public statuses', () => {
  const projects = filterPublicListings([
    { ID: 'P1', STATUS: 'Available' },
    { ID: 'P2', STATUS: 'Off Market' },
    { ID: 'P3' },
  ]);
  const subsale = filterPublicListings([
    { ID: 'S1', STATUS: ' AVAILABLE ' },
    { ID: 'S2', STATUS: 'Sold' },
    { ID: 'S3', STATUS: '' },
  ]);

  assert.deepEqual(projects.map(({ ID }) => ID), ['P1']);
  assert.deepEqual(subsale.map(({ ID }) => ID), ['S1']);
});

test('sanitized public payload exposes no hidden rows or unrelated fields', () => {
  const payload = createPublicListingResponse(
    {
      success: true,
      count: 3,
      projects: [
        { ID: 'P1', STATUS: 'Available', DESCRIPTION: 'public' },
        { ID: 'P2', STATUS: 'Off Market', DESCRIPTION: 'hidden secret' },
        { ID: 'P3', DESCRIPTION: 'missing status secret' },
      ],
      internalDebug: 'must not leak',
    },
    'projects',
  );

  assert.deepEqual(payload, {
    success: true,
    count: 1,
    projects: [
      { ID: 'P1', STATUS: 'Available', DESCRIPTION: 'public' },
    ],
  });
  assert.equal(JSON.stringify(payload).includes('hidden secret'), false);
  assert.equal(JSON.stringify(payload).includes('internalDebug'), false);
});

test('Project public API filters before responding to the browser', async () => {
  globalThis.fetch = async () => Response.json({
    success: true,
    count: 2,
    projects: [
      { ID: 'P1', STATUS: 'Available' },
      { ID: 'P2', STATUS: 'Draft', DESCRIPTION: 'private project' },
    ],
  });

  const response = await getProjectsApi();
  const body = await response.json() as Record<string, any>;

  assert.equal(response.status, 200);
  assert.equal(response.headers.get('Cache-Control'), 'public, max-age=0, s-maxage=120');
  assert.equal(body.count, 1);
  assert.deepEqual(body.projects.map((row: { ID: string }) => row.ID), ['P1']);
  assert.equal(JSON.stringify(body).includes('private project'), false);
});

test('Subsale public API filters before responding to the browser', async () => {
  globalThis.fetch = async () => Response.json({
    success: true,
    count: 2,
    subsale: [
      { ID: 'S1', STATUS: ' available ' },
      { ID: 'S2', STATUS: 'Booked', DESCRIPTION: 'private subsale' },
    ],
  });

  const response = await getSubsaleApi();
  const body = await response.json() as Record<string, any>;

  assert.equal(response.status, 200);
  assert.equal(response.headers.get('Cache-Control'), 'public, max-age=0, s-maxage=120');
  assert.equal(body.count, 1);
  assert.deepEqual(body.subsale.map((row: { ID: string }) => row.ID), ['S1']);
  assert.equal(JSON.stringify(body).includes('private subsale'), false);
});

test('frontend applies defense-in-depth filtering to Project and Subsale API data', async () => {
  globalThis.fetch = async (input) => {
    const url = String(input);

    if (url === '/api/projects') {
      return Response.json({
        success: true,
        projects: [
          { ID: 'P1', PROJECT_NAME: 'Visible Project', STATUS: 'AVAILABLE' },
          { ID: 'P2', PROJECT_NAME: 'Hidden Project', STATUS: 'Off Market' },
        ],
      });
    }

    return Response.json({
      success: true,
      subsale: [
        { ID: 'S1', PROPERTY_NAME: 'Visible Subsale', STATUS: 'Available' },
        { ID: 'S2', PROPERTY_NAME: 'Hidden Subsale', STATUS: 'Sold' },
      ],
    });
  };

  const [projects, subsale] = await Promise.all([
    fetchProjects(),
    fetchSubsale(),
  ]);

  assert.deepEqual(projects.map(({ ID }) => ID), ['P1']);
  assert.deepEqual(subsale.map(({ ID }) => ID), ['S1']);
});

test('listing fetch fails closed and never falls back to public Apps Script reads', async () => {
  const requestedUrls: string[] = [];
  globalThis.fetch = async (input) => {
    requestedUrls.push(String(input));
    throw new Error('Public API unavailable');
  };

  await assert.rejects(fetchProjects(), /Public API unavailable/);
  await assert.rejects(fetchSubsale(), /Public API unavailable/);
  assert.deepEqual(requestedUrls, ['/api/projects', '/api/subsale']);
});

test('direct Project and Subsale URLs cannot resolve hidden listings', () => {
  const projects = [
    { PROJECT_NAME: 'Public Project', STATUS: 'Available' },
    { PROJECT_NAME: 'QA Off Market', STATUS: 'Off Market' },
  ];
  const subsale = [
    { PROPERTY_NAME: 'Public Subsale', STATUS: 'Available' },
    { PROPERTY_NAME: 'Private Draft', STATUS: 'Draft' },
  ];

  assert.equal(
    findPublicListingBySlug(projects, 'public-project', (row) => row.PROJECT_NAME)
      ?.PROJECT_NAME,
    'Public Project',
  );
  assert.equal(
    findPublicListingBySlug(projects, 'qa-off-market', (row) => row.PROJECT_NAME),
    undefined,
  );
  assert.equal(
    findPublicListingBySlug(subsale, 'public-subsale', (row) => row.PROPERTY_NAME)
      ?.PROPERTY_NAME,
    'Public Subsale',
  );
  assert.equal(
    findPublicListingBySlug(subsale, 'private-draft', (row) => row.PROPERTY_NAME),
    undefined,
  );
});

test('homepage, cards, search, area and project-name inputs receive public-only rows', () => {
  const publicProjects = filterPublicListings([
    {
      ID: 'P1',
      PROJECT_NAME: 'Available Shah Alam',
      AREA: 'Shah Alam',
      STATUS: 'Available',
    },
    {
      ID: 'P2',
      PROJECT_NAME: 'Hidden Klang QA',
      AREA: 'Secret QA Area',
      STATUS: 'Off Market',
    },
  ]);

  const homepageCards = publicProjects.slice(0, 6);
  const searchResults = publicProjects.filter((row) =>
    row.PROJECT_NAME.toLowerCase().includes('available'),
  );
  const areas = [...new Set(publicProjects.map((row) => row.AREA))];
  const projectNames = publicProjects.map((row) => row.PROJECT_NAME);

  assert.deepEqual(homepageCards.map(({ ID }) => ID), ['P1']);
  assert.deepEqual(searchResults.map(({ ID }) => ID), ['P1']);
  assert.deepEqual(areas, ['Shah Alam']);
  assert.deepEqual(projectNames, ['Available Shah Alam']);
  assert.equal(JSON.stringify({ homepageCards, areas, projectNames }).includes('Hidden'), false);
});

test('existing Available Project and Subsale field mapping remains unchanged', () => {
  const projectRaw = {
    ID: 'P1',
    AREA: 'Shah Alam',
    PROJECT_NAME: 'Existing Project',
    STATUS: 'Available',
    'MAIN IMAGE': 'https://example.com/project.webp',
    DESCRIPTION: 'Existing description',
  };
  const subsaleRaw = {
    ID: 'S1',
    PROPERTY_NAME: 'Existing Subsale',
    STATUS: 'Available',
    IMAGE_1: 'https://example.com/subsale.webp',
    DESCRIPTION: 'Existing subsale description',
  };

  const project = normalizeProject(projectRaw);
  const subsale = normalizeSubsale(subsaleRaw);

  assert.equal(project.ID, projectRaw.ID);
  assert.equal(project.PROJECT_NAME, projectRaw.PROJECT_NAME);
  assert.equal(project.MAIN_IMAGE, projectRaw['MAIN IMAGE']);
  assert.equal(project.DESCRIPTION, projectRaw.DESCRIPTION);
  assert.equal(subsale.ID, subsaleRaw.ID);
  assert.equal(subsale.PROPERTY_NAME, subsaleRaw.PROPERTY_NAME);
  assert.equal(subsale.IMAGE_1, subsaleRaw.IMAGE_1);
  assert.equal(subsale.DESCRIPTION, subsaleRaw.DESCRIPTION);
});
