import { CTASection } from "@/components/portfolio/cta-section";
import { Certifications } from "@/components/portfolio/certifications";
import { EngineeringPhilosophy } from "@/components/portfolio/philosophy";
import { ExperiencePreview } from "@/components/portfolio/experience-preview";
import { Expertise } from "@/components/portfolio/expertise";
import { FeaturedProjects } from "@/components/portfolio/featured-projects";
import { Hero } from "@/components/portfolio/hero";
import { HowIBuild } from "@/components/portfolio/how-i-build";
import { TechStack } from "@/components/portfolio/tech-stack";
import { Testimonials } from "@/components/portfolio/testimonials";
import { TrustStrip } from "@/components/portfolio/trust-strip";
import {
  getExperiences,
  getCertifications,
  getFeaturedProjects,
  getTechnologies,
  getTestimonials,
} from "@/lib/data/public";

export default async function HomePage() {
  const [projects, experiences, technologies, testimonials, certifications] = await Promise.all([
    getFeaturedProjects(),
    getExperiences(),
    getTechnologies(),
    getTestimonials(),
    getCertifications(),
  ]);

  return (
    <div className="flex w-full flex-col">
      <Hero />
      <TrustStrip />
      <HowIBuild />
      <Expertise />
      <FeaturedProjects projects={projects} />
      <EngineeringPhilosophy />
      <ExperiencePreview experiences={experiences} />
      <Certifications certifications={certifications} />
      <TechStack technologies={technologies} />
      <Testimonials testimonials={testimonials} />
      <CTASection />
    </div>
  );
}
