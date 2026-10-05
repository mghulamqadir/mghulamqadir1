import { ImageResponse } from "next/og";

export const runtime = "nodejs";
export const alt = "Ghulam Qadir — Backend-Focused Full Stack Engineer";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default async function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px 80px",
          backgroundColor: "#07080B",
          backgroundImage:
            "radial-gradient(circle at 85% 25%, rgba(242, 184, 100, 0.16) 0%, rgba(7, 8, 11, 0) 60%)",
          color: "#EDEFF5",
          fontFamily: "system-ui, -apple-system, sans-serif",
          position: "relative",
        }}
      >
        {/* Subtle grid border decoration */}
        <div
          style={{
            position: "absolute",
            inset: "24px",
            border: "1px solid rgba(242, 184, 100, 0.18)",
            borderRadius: "20px",
            pointerEvents: "none",
          }}
        />

        {/* Top bar: Brand identifier */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
            <div
              style={{
                width: "44px",
                height: "44px",
                borderRadius: "12px",
                backgroundColor: "#13161F",
                border: "1px solid rgba(242, 184, 100, 0.3)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#F2B864",
                fontSize: "20px",
                fontWeight: "bold",
              }}
            >
              <svg width="24" height="24" viewBox="0 0 32 32" fill="none">
                <path d="M19.5 7.5C14.8 7.5 11 11.3 11 16C11 20.7 14.8 24.5 19.5 24.5C16.2 22.5 14.2 19.4 14.2 16C14.2 12.6 16.2 9.5 19.5 7.5Z" fill="#F2B864" />
                <circle cx="21" cy="12" r="1.5" fill="#FCE1A8" />
              </svg>
            </div>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <span style={{ fontSize: "20px", fontWeight: "700", color: "#F0E7DB" }}>
                Ghulam Qadir
              </span>
              <span
                style={{
                  fontSize: "13px",
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  color: "#9DB4D6",
                  fontFamily: "monospace",
                }}
              >
                Production Portfolio
              </span>
            </div>
          </div>

          {/* Status pill */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              padding: "8px 16px",
              borderRadius: "9999px",
              backgroundColor: "rgba(34, 197, 94, 0.1)",
              border: "1px solid rgba(34, 197, 94, 0.25)",
              color: "#4ADE80",
              fontSize: "13px",
              fontFamily: "monospace",
            }}
          >
            <div
              style={{
                width: "8px",
                height: "8px",
                borderRadius: "50%",
                backgroundColor: "#4ADE80",
              }}
            />
            Available for Senior Roles
          </div>
        </div>

        {/* Center: Headline & Value proposition */}
        <div style={{ display: "flex", flexDirection: "column", gap: "16px", maxWidth: "900px" }}>
          <div
            style={{
              fontSize: "14px",
              fontWeight: "600",
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              color: "#F2B864",
              fontFamily: "monospace",
            }}
          >
            Backend-Focused Full Stack Engineer
          </div>
          <h1
            style={{
              fontSize: "56px",
              fontWeight: "800",
              lineHeight: "1.12",
              letterSpacing: "-0.03em",
              color: "#F5F6F9",
              margin: 0,
            }}
          >
            Production Systems, AI/RAG Pipelines & High-Scale APIs.
          </h1>
          <p
            style={{
              fontSize: "22px",
              lineHeight: "1.4",
              color: "#A2A7B5",
              margin: 0,
            }}
          >
            Node.js, PostgreSQL, Distributed Queues, Next.js, and Vector Architectures.
          </p>
        </div>

        {/* Bottom bar: Metrics & Stack proof */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderTop: "1px solid rgba(255, 255, 255, 0.08)",
            paddingTop: "24px",
          }}
        >
          <div style={{ display: "flex", gap: "36px" }}>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <span style={{ fontSize: "22px", fontWeight: "700", color: "#F2B864", fontFamily: "monospace" }}>
                10k+
              </span>
              <span style={{ fontSize: "12px", color: "#6A7182", textTransform: "uppercase" }}>
                Active Users Served
              </span>
            </div>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <span style={{ fontSize: "22px", fontWeight: "700", color: "#F2B864", fontFamily: "monospace" }}>
                4
              </span>
              <span style={{ fontSize: "12px", color: "#6A7182", textTransform: "uppercase" }}>
                Production Platforms
              </span>
            </div>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <span style={{ fontSize: "22px", fontWeight: "700", color: "#F2B864", fontFamily: "monospace" }}>
                99.9%
              </span>
              <span style={{ fontSize: "12px", color: "#6A7182", textTransform: "uppercase" }}>
                Target SLA
              </span>
            </div>
          </div>

          <div
            style={{
              fontSize: "14px",
              color: "#9DB4D6",
              fontFamily: "monospace",
            }}
          >
            mghulamqadir1.vercel.app
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
