import assert from 'node:assert/strict';
import test from 'node:test';
import { submitLead } from './api';
import { onRequestPost } from '../../functions/api/lead';
import { confirmedLeadId, createLeadSubmissionGuard, prepareLeadWhatsApp, UNCERTAIN_LEAD_MESSAGE } from './leadSubmission';
import type { LeadFormData } from '../types';

const draft: LeadFormData = {
  leadType: 'PROJEK BARU', name: 'Synthetic & Buyer', phone: '0123456789',
  email: 'test@example.invalid', preferredArea: 'Shah Alam', interestedProject: 'Synthetic / Home',
  grossIncome: 'PRIVATE_FINANCIAL_VALUE', netIncome: '', employmentStatus: 'SWASTA',
  loanCommitments: '', firstHomeBuyer: 'YA', propertyType: 'TERRACE',
  estimatedBudget: 'PRIVATE_BUDGET', remarks: 'PRIVATE_REMARKS', consent: true,
};
const saved = { success: true, leadId: 'LEAD-12345678' };
const originalFetch = globalThis.fetch;

test('only explicit success and the existing lead ID contract acknowledge persistence', () => {
  assert.equal(confirmedLeadId(saved), saved.leadId);
  for (const value of [null, [], {}, { ...saved, success: false }, { leadId: saved.leadId },
    { success: true }, { success: true, leadId: '' }, { success: true, leadId: ' ' },
    { success: true, leadId: 'invalid' }, { success: 'true', leadId: saved.leadId }]) {
    assert.equal(confirmedLeadId(value), null);
  }
});

for (const [label, response] of [
  ['confirmed', () => Response.json(saved)],
  ['false', () => Response.json({ success: false, error: 'PRIVATE_ERROR' })],
  ['missing success', () => Response.json({ leadId: saved.leadId })],
  ['missing ID', () => Response.json({ success: true })],
  ['blank ID', () => Response.json({ success: true, leadId: ' ' })],
  ['HTML', () => new Response('<html>PRIVATE_ERROR</html>')],
  ['malformed JSON', () => new Response('{')],
  ['HTTP error', () => Response.json(saved, { status: 503 })],
] as const) {
  test(`service makes exactly one same-origin POST for ${label}`, async () => {
    const calls: string[] = [];
    globalThis.fetch = async (url, options) => {
      calls.push(String(url));
      assert.equal(options?.method, 'POST');
      assert.deepEqual(JSON.parse(String(options?.body)).name, draft.name);
      return response();
    };
    try {
      const result = await submitLead(draft);
      assert.equal(result.outcome, label === 'confirmed' ? 'confirmed' : 'uncertain');
      assert.deepEqual(calls, ['/api/lead']);
    } finally { globalThis.fetch = originalFetch; }
  });
}

for (const name of ['NetworkError', 'TimeoutError']) {
  test(`${name} stays uncertain without retry and does not mutate draft`, async () => {
    let calls = 0;
    const before = structuredClone(draft);
    globalThis.fetch = async () => { calls++; throw new DOMException('PRIVATE_ERROR', name); };
    try {
      assert.deepEqual(await submitLead(draft), { success: false, outcome: 'uncertain', message: UNCERTAIN_LEAD_MESSAGE });
      assert.equal(calls, 1);
      assert.deepEqual(draft, before);
    } finally { globalThis.fetch = originalFetch; }
  });
}

test('local required-field and consent validation dispatches no request', async () => {
  let calls = 0;
  globalThis.fetch = async () => { calls++; throw new Error('Unexpected dispatch'); };
  try {
    for (const field of ['name', 'phone', 'email', 'preferredArea']) {
      assert.equal((await submitLead({ ...draft, [field]: '' })).outcome, 'rejected');
    }
    assert.equal((await submitLead({ ...draft, consent: false })).outcome, 'rejected');
    assert.equal(calls, 0);
  } finally { globalThis.fetch = originalFetch; }
});

test('proxy local rejection never forwards; valid rejection is safely correctable', async () => {
  let calls = 0;
  globalThis.fetch = async () => { calls++; throw new Error('Unexpected dispatch'); };
  try {
    const reply = await onRequestPost({ request: new Request('https://example.invalid/api/lead', { method: 'POST', body: JSON.stringify({ ...draft, consent: false }) }) });
    assert.equal(reply.status, 400);
    assert.equal((await reply.json()).outcome, 'rejected');
    assert.equal(calls, 0);
  } finally { globalThis.fetch = originalFetch; }
});

for (const mode of ['confirmed', 'rejected', 'HTML', 'malformed', 'missing success', 'missing ID', 'blank ID', 'network', 'timeout', 'HTTP error']) {
  test(`proxy ${mode} is sanitized and does not forward unrelated actions`, async () => {
    let calls = 0;
    globalThis.fetch = async (_url, options) => {
      calls++;
      const sent = JSON.parse(String(options?.body));
      assert.equal(sent.action, undefined);
      assert.equal(sent.importerSecret, undefined);
      assert.equal(sent.name, draft.name);
      if (mode === 'network') throw new Error('PRIVATE_ERROR');
      if (mode === 'timeout') throw new DOMException('PRIVATE_ERROR', 'TimeoutError');
      if (mode === 'HTML') return new Response('PRIVATE_ERROR');
      if (mode === 'malformed') return new Response('{');
      if (mode === 'missing success') return Response.json({ leadId: saved.leadId });
      if (mode === 'missing ID') return Response.json({ success: true });
      if (mode === 'blank ID') return Response.json({ success: true, leadId: ' ' });
      if (mode === 'rejected') return Response.json({ success: false, error: 'PRIVATE_ERROR' });
      return Response.json({ ...saved, internal: 'PRIVATE_ERROR' }, { status: mode === 'HTTP error' ? 503 : 200 });
    };
    try {
      const reply = await onRequestPost({ request: new Request('https://example.invalid/api/lead', {
        method: 'POST', body: JSON.stringify({ ...draft, action: 'updateProject', importerSecret: 'PRIVATE_ERROR' }),
      }) });
      const body = await reply.json();
      assert.equal(body.outcome, mode === 'confirmed' ? 'confirmed' : 'uncertain');
      assert.equal(JSON.stringify(body).includes('PRIVATE_ERROR'), false);
      assert.equal(calls, 1);
    } finally { globalThis.fetch = originalFetch; }
  });
}

test('dispatch guard blocks overlap and uncertainty; preserves draft with no WhatsApp handoff', async () => {
  const guard = createLeadSubmissionGuard();
  let finish!: (value: Awaited<ReturnType<typeof submitLead>>) => void;
  let calls = 0;
  const send = () => { calls++; return new Promise<Awaited<ReturnType<typeof submitLead>>>(resolve => { finish = resolve; }); };
  const pending = guard.run(draft, send);
  assert.equal(await guard.run(draft, send), null);
  finish({ success: false, outcome: 'uncertain', message: UNCERTAIN_LEAD_MESSAGE });
  const result = await pending;
  assert.deepEqual(result?.draft, draft);
  assert.equal(result?.whatsappUrl, undefined);
  assert.equal(await guard.run(draft, send), null);
  assert.equal(calls, 1);
});

test('confirmed guard prepares minimal encoded message and blocks repeated submission', async () => {
  const guard = createLeadSubmissionGuard();
  const result = await guard.run(draft, async () => ({ ...saved, success: true, outcome: 'confirmed' }));
  assert.equal(result?.whatsappUrl, prepareLeadWhatsApp(saved.leadId, draft));
  const url = new URL(result!.whatsappUrl!);
  assert.equal(url.origin + url.pathname, 'https://wa.me/60178399316');
  assert.match(url.searchParams.get('text')!, /Synthetic & Buyer/);
  assert.match(url.searchParams.get('text')!, /Synthetic \/ Home/);
  assert.match(url.searchParams.get('text')!, /Shah Alam/);
  assert.equal(url.searchParams.get('text'), 'Hi, saya Synthetic & Buyer.\n\nSaya berminat dengan rumah Synthetic / Home di Shah Alam.\n\nSaya sudah mengisi borang Semak Kelayakan melalui rumahselangor.my.\n\nRujukan: LEAD-12345678\n\nBoleh bantu saya untuk langkah seterusnya?');
  assert.ok(result!.whatsappUrl!.includes('Synthetic%20%26%20Buyer'));
  assert.ok(result!.whatsappUrl!.includes('Synthetic%20%2F%20Home'));
  assert.equal(result!.whatsappUrl!.includes('PRIVATE_'), false);
  assert.equal(result!.whatsappUrl!.includes(draft.email), false);
  assert.equal(await guard.run(draft, async () => { throw new Error('Must not dispatch'); }), null);
});

test('WhatsApp enquiry uses natural wording when property or area is unavailable', () => {
  for (const [property, area, expected] of [
    ['Synthetic Home', '   ', 'Saya berminat dengan rumah Synthetic Home.'],
    ['   ', 'Shah Alam', 'Saya berminat dengan rumah di Shah Alam.'],
    ['', '', 'Saya berminat untuk mencari rumah.'],
  ]) {
    const url = new URL(prepareLeadWhatsApp(saved.leadId, { ...draft, interestedProject: property, preferredArea: area }));
    const message = url.searchParams.get('text')!;
    assert.equal(message.split('\n\n')[1], expected);
    assert.equal(message.includes('PRIVATE_'), false);
    assert.equal(message.includes(draft.phone), false);
    assert.equal(message.includes(draft.email), false);
    assert.ok(message.includes(`Rujukan: ${saved.leadId}`));
  }
});

test('pre-forward rejection permits correction; thrown sender stays locked and uncertain', async () => {
  const guard = createLeadSubmissionGuard();
  const rejected = await guard.run({ ...draft, name: '' }, async () => { throw new Error('Must not dispatch'); });
  assert.equal(rejected?.result.outcome, 'rejected');
  const failed = await guard.run(draft, async () => { throw new Error('PRIVATE_ERROR'); });
  assert.equal(failed?.result.outcome, 'uncertain');
  assert.equal(failed?.whatsappUrl, undefined);
  assert.equal(await guard.run(draft, submitLead), null);
});

test('service recognizes only structured pre-forward rejection as safely correctable', async () => {
  let calls = 0;
  globalThis.fetch = async () => {
    calls++;
    return Response.json({ success: false, outcome: 'rejected' }, { status: 400 });
  };
  try {
    const guard = createLeadSubmissionGuard();
    assert.equal((await guard.run(draft, submitLead))?.result.outcome, 'rejected');
    assert.equal((await guard.run(draft, submitLead))?.result.outcome, 'rejected');
    assert.equal(calls, 2); // Two explicit corrected attempts, no automatic retry.
  } finally { globalThis.fetch = originalFetch; }
});

test('malformed incoming proxy request is rejected without contacting the backend', async () => {
  let calls = 0;
  globalThis.fetch = async () => { calls++; throw new Error('Unexpected dispatch'); };
  try {
    const response = await onRequestPost({ request: new Request('https://example.invalid/api/lead', { method: 'POST', body: '{' }) });
    assert.equal(response.status, 400);
    assert.equal((await response.json()).outcome, 'rejected');
    assert.equal(calls, 0);
  } finally { globalThis.fetch = originalFetch; }
});
