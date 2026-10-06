import { ArrowUpRight, BadgeCheck } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Eyebrow } from "@/components/ui/eyebrow";
import { Button } from "@/components/ui/button";
import type { Certification } from "@/lib/types";

export function Certifications({ certifications }: { certifications: Certification[] }) {
  if (!certifications.length) return null;

  return (
    <section className="relative py-20 md:py-28" aria-labelledby="certifications-heading">
      <Container>
        <div className="mb-14 max-w-2xl space-y-3">
          <Eyebrow>Recognition</Eyebrow>
          <h2 id="certifications-heading" className="text-heading-2 font-semibold tracking-tight text-text">Hackathon certificates</h2>
          <p className="text-body-lg leading-relaxed text-text-muted">Verified participation and achievement records from AI-focused builder programs.</p>
        </div>
        <div className="grid gap-5 md:grid-cols-3">
          {certifications.map((certificate) => (
            <article key={certificate.id} className="flex min-h-64 flex-col rounded-2xl border border-border bg-surface p-7 shadow-sm transition-colors hover:border-border-strong hover:bg-surface-2">
              <BadgeCheck className="mb-8 h-8 w-8 text-accent" aria-hidden="true" />
              <div className="flex-1">
                <p className="font-mono text-xs uppercase tracking-wider text-text-faint">{certificate.issuer || "Certificate"}</p>
                <h3 className="mt-3 text-xl font-semibold leading-snug tracking-tight text-text">{certificate.name}</h3>
                {certificate.date_label && <p className="mt-2 text-sm text-text-muted">{certificate.date_label}</p>}
                {certificate.credential_id && <p className="mt-2 break-all font-mono text-[11px] text-text-faint">ID: {certificate.credential_id}</p>}
              </div>
              {certificate.credential_url && (
                <Button href={certificate.credential_url} external variant="secondary" size="sm" className="mt-8 w-full">
                  Verify certificate <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
                </Button>
              )}
            </article>
          ))}
        </div>
      </Container>
    </section>
  );
}
