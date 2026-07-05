import nodemailer from "nodemailer";
import { LoanRecord, ActivityEntry } from "./types";
import { LOAN_TYPE_LABELS } from "./document-checklists";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

const COMPANY_EMAIL = process.env.COMPANY_EMAIL || "srivastavaassociates01@gmail.com";
const COMPANY_NAME = "Srivastava Associates";
const COMPANY_PHONE = "8306445333";

function baseTemplate(content: string, title: string): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: Arial, sans-serif; background: #f4f4f4; margin: 0; padding: 0; }
    .container { max-width: 600px; margin: 20px auto; background: white; border-radius: 8px; overflow: hidden; }
    .header { background: #0B1D3E; padding: 24px; text-align: center; }
    .header h1 { color: #C9A227; margin: 0; font-size: 20px; }
    .header p { color: #aaa; margin: 4px 0 0; font-size: 13px; }
    .body { padding: 24px; }
    .title { color: #0B1D3E; font-size: 18px; font-weight: bold; margin-bottom: 16px; }
    .field { margin-bottom: 12px; }
    .field-label { color: #666; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px; }
    .field-value { color: #222; font-size: 15px; font-weight: 500; }
    .badge { display: inline-block; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: bold; background: #C9A22722; color: #C9A227; }
    .footer { background: #f4f4f4; padding: 16px 24px; text-align: center; color: #888; font-size: 12px; }
    .btn { display: inline-block; background: #C9A227; color: #0B1D3E; padding: 10px 24px; border-radius: 6px; text-decoration: none; font-weight: bold; margin-top: 16px; }
    .divider { border: none; border-top: 1px solid #eee; margin: 20px 0; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>SA | Srivastava Associates</h1>
      <p>Easy Loan, Happy Life</p>
    </div>
    <div class="body">
      <div class="title">${title}</div>
      ${content}
    </div>
    <div class="footer">
      ${COMPANY_NAME} &bull; ${COMPANY_PHONE} &bull; Kota, Rajasthan
    </div>
  </div>
</body>
</html>`;
}

export async function sendNewLeadEmail(record: LoanRecord): Promise<void> {
  const loanLabel = LOAN_TYPE_LABELS[record.loanType] || record.loanType;
  const content = `
    <div class="field"><div class="field-label">Name</div><div class="field-value">${record.name}</div></div>
    <div class="field"><div class="field-label">Phone</div><div class="field-value">${record.phone}</div></div>
    ${record.email ? `<div class="field"><div class="field-label">Email</div><div class="field-value">${record.email}</div></div>` : ""}
    <div class="field"><div class="field-label">Loan Type</div><div class="field-value">${loanLabel}</div></div>
    ${record.amount ? `<div class="field"><div class="field-label">Loan Amount</div><div class="field-value">₹${record.amount.toLocaleString("en-IN")}</div></div>` : ""}
    ${record.city ? `<div class="field"><div class="field-label">City</div><div class="field-value">${record.city}</div></div>` : ""}
    <div class="field"><div class="field-label">Source</div><div class="field-value">${record.source}</div></div>
    <div class="field"><div class="field-label">Received At</div><div class="field-value">${new Date(record.createdAt).toLocaleString("en-IN")}</div></div>
    <hr class="divider">
    <a href="${process.env.NEXT_PUBLIC_APP_URL}/admin/leads/${record.id}" class="btn">View in Admin Portal →</a>
  `;

  await transporter.sendMail({
    from: `"Srivastava Associates" <${COMPANY_EMAIL}>`,
    to: COMPANY_EMAIL,
    subject: `🔔 New ${loanLabel} Lead – ${record.name} (${record.phone})`,
    html: baseTemplate(content, `New Lead: ${record.name}`),
  });
}

export async function sendStatusUpdateEmail(
  record: LoanRecord,
  oldStatus: string,
  newStatus: string
): Promise<void> {
  const loanLabel = LOAN_TYPE_LABELS[record.loanType] || record.loanType;
  const content = `
    <div class="field"><div class="field-label">Lead Name</div><div class="field-value">${record.name}</div></div>
    <div class="field"><div class="field-label">Phone</div><div class="field-value">${record.phone}</div></div>
    <div class="field"><div class="field-label">Loan Type</div><div class="field-value">${loanLabel}</div></div>
    <div class="field"><div class="field-label">Status Changed</div><div class="field-value"><span class="badge">${oldStatus}</span> → <span class="badge">${newStatus}</span></div></div>
    <div class="field"><div class="field-label">Updated At</div><div class="field-value">${new Date().toLocaleString("en-IN")}</div></div>
    <hr class="divider">
    <a href="${process.env.NEXT_PUBLIC_APP_URL}/admin/leads/${record.id}" class="btn">View Record →</a>
  `;

  await transporter.sendMail({
    from: `"Srivastava Associates" <${COMPANY_EMAIL}>`,
    to: COMPANY_EMAIL,
    subject: `📊 Status Update – ${record.name}: ${oldStatus} → ${newStatus}`,
    html: baseTemplate(content, "Lead Status Updated"),
  });
}

export async function sendCallbackEmail(data: {
  name: string;
  phone: string;
  loanType: string;
  preferredTime: string;
  city: string;
}): Promise<void> {
  const content = `
    <div class="field"><div class="field-label">Name</div><div class="field-value">${data.name}</div></div>
    <div class="field"><div class="field-label">Phone</div><div class="field-value">${data.phone}</div></div>
    <div class="field"><div class="field-label">Loan Type</div><div class="field-value">${data.loanType}</div></div>
    <div class="field"><div class="field-label">Preferred Time</div><div class="field-value">${data.preferredTime}</div></div>
    <div class="field"><div class="field-label">City</div><div class="field-value">${data.city}</div></div>
  `;

  await transporter.sendMail({
    from: `"Srivastava Associates" <${COMPANY_EMAIL}>`,
    to: COMPANY_EMAIL,
    subject: `📞 Callback Request – ${data.name} (${data.phone})`,
    html: baseTemplate(content, "New Callback Request"),
  });
}

export async function sendDailyDigest(stats: {
  newLeads: number;
  pendingFollowUps: number;
  docsAwaited: number;
  leadsToday: Array<{ name: string; phone: string; loanType: string }>;
}): Promise<void> {
  const leadsHtml = stats.leadsToday
    .map(
      (l) =>
        `<div class="field"><div class="field-value">${l.name} – ${l.phone} – ${l.loanType}</div></div>`
    )
    .join("");

  const content = `
    <div style="display:flex;gap:16px;margin-bottom:20px;">
      <div style="flex:1;background:#f0f4ff;border-radius:8px;padding:16px;text-align:center;">
        <div style="font-size:28px;font-weight:bold;color:#0B1D3E;">${stats.newLeads}</div>
        <div style="color:#666;font-size:13px;">New Leads</div>
      </div>
      <div style="flex:1;background:#fff7ed;border-radius:8px;padding:16px;text-align:center;">
        <div style="font-size:28px;font-weight:bold;color:#C9A227;">${stats.pendingFollowUps}</div>
        <div style="color:#666;font-size:13px;">Pending Follow-ups</div>
      </div>
      <div style="flex:1;background:#fff0f0;border-radius:8px;padding:16px;text-align:center;">
        <div style="font-size:28px;font-weight:bold;color:#dc2626;">${stats.docsAwaited}</div>
        <div style="color:#666;font-size:13px;">Docs Awaited</div>
      </div>
    </div>
    ${stats.leadsToday.length > 0 ? `<div class="field-label">Today's Leads</div>${leadsHtml}` : ""}
    <a href="${process.env.NEXT_PUBLIC_APP_URL}/admin" class="btn">Open Admin Portal →</a>
  `;

  await transporter.sendMail({
    from: `"Srivastava Associates" <${COMPANY_EMAIL}>`,
    to: COMPANY_EMAIL,
    subject: `📊 Daily Digest – ${new Date().toLocaleDateString("en-IN")}`,
    html: baseTemplate(content, "Daily Summary"),
  });
}
