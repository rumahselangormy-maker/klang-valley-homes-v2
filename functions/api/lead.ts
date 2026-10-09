import { confirmedLeadId, validateLead, UNCERTAIN_LEAD_MESSAGE } from '../../src/services/leadSubmission';
const APPS_SCRIPT_URL =
  'https://script.google.com/macros/s/AKfycbwe2A2tkjeqpwt6pqYRzdKfR2B6jdebprKqN0oSe_XQ8PaoWRc9XCqSEAucx-im1vGEoQ/exec';
export const onRequestPost = async (context) => {
  let input: unknown;
  try { input = await context.request.json(); }
  catch { return Response.json({ success: false, outcome: 'rejected', message: 'Maklumat borang tidak sah.' }, { status: 400 }); }
  const error = validateLead(input);
  if (error) return Response.json({ success: false, outcome: 'rejected', message: error }, { status: 400 });
  // Lead fields only: arbitrary Apps Script actions must never be forwarded.
  const fields = ['leadType', 'name', 'phone', 'email', 'preferredArea', 'interestedProject', 'grossIncome', 'netIncome', 'employmentStatus', 'loanCommitments', 'firstHomeBuyer', 'propertyType', 'estimatedBudget', 'remarks', 'consent', 'source'];
  const data = input as Record<string, unknown>;
  const payload = Object.fromEntries(fields.filter(field => Object.prototype.hasOwnProperty.call(data, field)).map(field => [field, data[field]]));
  try {
    const response = await fetch(APPS_SCRIPT_URL, {
      method: 'POST', headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify(payload), signal: AbortSignal.timeout(30000),
    });
    const result = await response.json();
    const leadId = confirmedLeadId(result);
    if (response.ok && leadId) return Response.json({ success: true, outcome: 'confirmed', leadId });
  } catch { /* Failed response cannot prove that append did not occur. */ }
  return Response.json({ success: false, outcome: 'uncertain', message: UNCERTAIN_LEAD_MESSAGE }, { status: 502 });
};
