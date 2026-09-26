type ContactEmail = { name: string; email: string; subject: string; message: string; receivedAt: string };

function escapeHtml(value: string) { return value.replace(/[&<>'"]/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" })[character] ?? character); }

export function buildContactEmail(input: ContactEmail) {
  const details = [["Name", input.name], ["Email", input.email], ["Subject", input.subject], ["Received", input.receivedAt]];
  const textContent = `New Portfolio Message\n\n${details.map(([label, value]) => `${label}: ${value}`).join("\n")}\n\nMessage:\n${input.message}`;
  const htmlContent = `<main style="font-family:Arial,sans-serif;color:#18181b;max-width:640px;margin:auto"><h1 style="font-size:22px">New Portfolio Message</h1>${details.map(([label, value]) => `<p><strong>${label}:</strong> ${escapeHtml(value)}</p>`).join("")}<hr style="border:0;border-top:1px solid #e4e4e7;margin:24px 0"/><p style="white-space:pre-wrap">${escapeHtml(input.message)}</p></main>`;
  return { textContent, htmlContent };
}
