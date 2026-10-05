export type ContactEmail = {
  name: string;
  email: string;
  subject: string;
  message: string;
  receivedAt: string;
};

function escapeHtml(value: string): string {
  return value.replace(/[&<>'"]/g, (character) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    "'": "&#39;",
    '"': "&quot;",
  })[character] ?? character);
}

function formatTimestamp(isoString: string): string {
  try {
    const d = new Date(isoString);
    return new Intl.DateTimeFormat("en-US", {
      dateStyle: "full",
      timeStyle: "short",
      timeZone: "UTC",
    }).format(d) + " (UTC)";
  } catch {
    return isoString;
  }
}

export function buildContactEmail(input: ContactEmail) {
  const safeName = escapeHtml(input.name);
  const safeEmail = escapeHtml(input.email);
  const safeSubject = escapeHtml(input.subject);
  const safeMessage = escapeHtml(input.message);
  const formattedDate = formatTimestamp(input.receivedAt);
  const replyMailto = `mailto:${safeEmail}?subject=Re:%20${encodeURIComponent(input.subject)}`;

  const textContent =
    `New Portfolio Message\n` +
    `=====================\n\n` +
    `From:    ${input.name} <${input.email}>\n` +
    `Subject: ${input.subject}\n` +
    `Time:    ${formattedDate}\n\n` +
    `Message:\n` +
    `---------------------\n` +
    `${input.message}\n` +
    `---------------------\n\n` +
    `Reply directly to: ${input.email}\n` +
    `CMS Messages Portal: https://mghulamqadir1.vercel.app/admin/messages\n`;

  const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>New Portfolio Message — ${safeSubject}</title>
</head>
<body style="margin:0;padding:0;background-color:#07080B;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:#E4E7EB;-webkit-font-smoothing:antialiased;">
  <!-- Outer Wrapper Table -->
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#07080B;padding:36px 16px;">
    <tr>
      <td align="center">
        <!-- Main Card Container -->
        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;background-color:#111319;border-radius:16px;border:1px solid #232733;overflow:hidden;box-shadow:0 24px 48px rgba(0,0,0,0.65);">
          
          <!-- Top Accent Gold Line -->
          <tr>
            <td style="height:4px;background:linear-gradient(90deg,#C98B27 0%,#F2B864 50%,#FCE1A8 100%);font-size:0;line-height:0;">&nbsp;</td>
          </tr>

          <!-- Header Section -->
          <tr>
            <td style="padding:32px 32px 24px 32px;background-color:#141722;border-bottom:1px solid #1F232F;">
              <table width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td style="vertical-align:middle;">
                    <table cellpadding="0" cellspacing="0" border="0">
                      <tr>
                        <!-- Gold Crescent Logo Mark -->
                        <td style="vertical-align:middle;padding-right:14px;">
                          <div style="width:38px;height:38px;border-radius:10px;background-color:#090A0E;border:1px solid rgba(242,184,100,0.35);text-align:center;line-height:38px;box-shadow:0 0 14px rgba(242,184,100,0.12);">
                            <div style="display:inline-block;width:14px;height:14px;border-radius:50%;box-shadow:4px 3px 0 0 #F2B864;margin-top:8px;margin-left:-3px;"></div>
                          </div>
                        </td>
                        <td style="vertical-align:middle;">
                          <div style="font-family:monospace;font-size:11px;letter-spacing:0.14em;text-transform:uppercase;color:#F2B864;font-weight:700;">
                            Ghulam Qadir
                          </div>
                          <div style="font-size:12px;color:#8590A2;margin-top:2px;letter-spacing:-0.01em;">
                            Portfolio Contact Inbound
                          </div>
                        </td>
                      </tr>
                    </table>
                  </td>
                  <td align="right" style="vertical-align:middle;">
                    <!-- Badge -->
                    <span style="display:inline-block;padding:5px 12px;border-radius:20px;background-color:rgba(242,184,100,0.12);border:1px solid rgba(242,184,100,0.25);font-size:11px;font-weight:600;color:#FCE1A8;font-family:monospace;letter-spacing:0.04em;">
                      New Message
                    </span>
                  </td>
                </tr>
                <tr>
                  <td colspan="2" style="padding-top:22px;">
                    <div style="font-size:12px;font-family:monospace;text-transform:uppercase;letter-spacing:0.08em;color:#8590A2;margin-bottom:6px;">
                      Subject
                    </div>
                    <h1 style="margin:0;font-size:22px;font-weight:700;color:#FFFFFF;letter-spacing:-0.02em;line-height:1.35;">
                      ${safeSubject}
                    </h1>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Metadata Box -->
          <tr>
            <td style="padding:24px 32px 16px 32px;">
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#0B0D13;border-radius:12px;border:1px solid #1C202C;">
                <tr>
                  <td style="padding:12px 16px;width:70px;font-family:monospace;font-size:11px;text-transform:uppercase;letter-spacing:0.08em;color:#788296;border-bottom:1px solid #161822;">
                    Sender
                  </td>
                  <td style="padding:12px 16px;font-size:14px;color:#FFFFFF;font-weight:600;border-bottom:1px solid #161822;">
                    ${safeName}
                  </td>
                </tr>
                <tr>
                  <td style="padding:12px 16px;width:70px;font-family:monospace;font-size:11px;text-transform:uppercase;letter-spacing:0.08em;color:#788296;border-bottom:1px solid #161822;">
                    Email
                  </td>
                  <td style="padding:12px 16px;font-size:14px;border-bottom:1px solid #161822;">
                    <a href="${replyMailto}" style="color:#F2B864;text-decoration:none;font-weight:500;">
                      ${safeEmail} &rarr;
                    </a>
                  </td>
                </tr>
                <tr>
                  <td style="padding:12px 16px;width:70px;font-family:monospace;font-size:11px;text-transform:uppercase;letter-spacing:0.08em;color:#788296;">
                    Received
                  </td>
                  <td style="padding:12px 16px;font-size:13px;color:#A2ABB9;font-family:monospace;">
                    ${formattedDate}
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Message Section Header -->
          <tr>
            <td style="padding:10px 32px 6px 32px;">
              <div style="font-family:monospace;font-size:11px;text-transform:uppercase;letter-spacing:0.08em;color:#788296;">
                Message Content
              </div>
            </td>
          </tr>

          <!-- Message Body Box -->
          <tr>
            <td style="padding:0 32px 28px 32px;">
              <div style="background-color:#08090D;border:1px solid #1F232F;border-left:3px solid #F2B864;border-radius:8px;padding:22px 24px;color:#F0E7DB;font-size:15px;line-height:1.7;white-space:pre-wrap;word-break:break-word;">${safeMessage}</div>
            </td>
          </tr>

          <!-- Actions / CTA Buttons -->
          <tr>
            <td style="padding:0 32px 32px 32px;">
              <table width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td>
                    <!-- Primary Gold Reply Button -->
                    <a href="${replyMailto}" style="display:inline-block;padding:12px 26px;background-color:#F2B864;color:#07080B;font-weight:700;font-size:14px;border-radius:8px;text-decoration:none;letter-spacing:0.01em;box-shadow:0 4px 14px rgba(242,184,100,0.3);">
                      Reply to ${safeName} &rarr;
                    </a>
                  </td>
                  <td align="right" style="vertical-align:middle;">
                    <!-- Secondary Link to CMS -->
                    <a href="https://mghulamqadir1.vercel.app/admin/messages" style="color:#8590A2;font-size:13px;text-decoration:none;font-weight:500;">
                      View in CMS &rarr;
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer Section -->
          <tr>
            <td style="padding:22px 32px;background-color:#0C0D13;border-top:1px solid #1A1D27;text-align:center;">
              <p style="margin:0 0 6px 0;font-size:12px;color:#636D7E;line-height:1.4;">
                Inbound submission from <a href="https://mghulamqadir1.vercel.app" style="color:#8590A2;text-decoration:underline;">mghulamqadir1.vercel.app</a>.
              </p>
              <p style="margin:0;font-size:11px;color:#495160;font-family:monospace;">
                Stored in MongoDB &bull; Routed via Brevo
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

  return { textContent, htmlContent };
}
