import "dotenv/config";
import { MongoClient } from "mongodb";
import { randomUUID } from "crypto";

const uri = process.env.MONGO_URI || process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB_NAME || "portfolio";

if (!uri) {
  console.error("Error: MONGO_URI or MONGODB_URI is required.");
  process.exit(1);
}

const client = new MongoClient(uri);

const now = new Date().toISOString();

const projects = [
  {
    id: "crowdaxis",
    title: "CrowdAxis",
    slug: "crowdaxis",
    company: "CrowdAxis",
    role: "Backend Engineer",
    category: "AI",
    status: "published",
    featured: true,
    sort_order: 1,
    short_description: "AI event processing and marketing intelligence platform with a staged, validated pipeline.",
    overview: "Production-grade event intelligence workflow that ingests, cleanses, and processes real-time event signals through sequential AI evaluation stages.",
    problem: "High volume event streams required context-dependent AI responses to remain deterministic, validated, and low latency across dependent pipeline stages.",
    solution: "Engineered an orchestrated pipeline with schema validation via Zod, persistent step-level checkpoints, retry logic with backoff, and PostgreSQL storage.",
    my_role: "Backend architecture, event pipeline orchestration, validation layers, and database persistence.",
    architecture: "Event Ingestion -> Validation -> Staged AI Processing (Perplexity) -> PostgreSQL & Vector Store",
    challenges: ["Schema consistency across LLM outputs", "Zero-data-loss checkpointing under traffic bursts", "Incremental data persistence"],
    outcome: "Achieved 99.9% pipeline reliability and processed millions of event intelligence signals seamlessly.",
    live_url: "https://www.crowdaxis.co/",
    cover_image_url: "/images/projects/crowdaxis.webp",
    created_at: now,
    updated_at: now,
  },
  {
    id: "klippify",
    title: "Klippify",
    slug: "klippify",
    company: "Klippify",
    role: "Backend Engineer",
    category: "SaaS",
    status: "published",
    featured: true,
    sort_order: 2,
    short_description: "Creator campaign and brand performance platform with analytics, earnings calculation, and Stripe billing.",
    overview: "Performance-based marketing and creator compensation network connecting brands with content creators.",
    problem: "Attributing social engagement to conversions accurately in real time and managing high-frequency payout distribution with fraud checks.",
    solution: "Designed webhook ingest workers, automated attribution processing algorithms, ledger-based earnings accounting, and Stripe Connect payouts.",
    my_role: "Backend microservices, attribution metrics processing, billing workflows, and third-party API integrations.",
    architecture: "Creator Event Ingest -> Webhook Workers -> Attribution Engine -> Ledger DB -> Stripe Connect",
    challenges: ["High-throughput webhook delivery spikes", "Idempotent payment transactions", "Creator analytics caching"],
    outcome: "Reliably processed creator earnings with 100% accounting accuracy and sub-second analytics dashboards.",
    live_url: "https://klippify.com/",
    cover_image_url: "/images/projects/klippify.webp",
    created_at: now,
    updated_at: now,
  },
  {
    id: "alevo",
    title: "Alevo",
    slug: "alevo",
    company: "Alevo",
    role: "Backend & AI Engineer",
    category: "AI",
    status: "published",
    featured: true,
    sort_order: 3,
    short_description: "AI-driven executive coaching assistant providing conversational reflection and goal alignment.",
    overview: "Intelligent coaching companion designed for professionals to structure goals, track habit accountability, and receive context-rich leadership feedback.",
    problem: "Maintaining deep conversational continuity, user context, and coaching tone across multi-turn sessions without prompt drift or latency spikes.",
    solution: "Built a retrieval-augmented generation (RAG) backend utilizing vector embeddings for episodic memory retrieval and structured output formatting.",
    my_role: "LLM orchestration, prompt engineering, vector database indexing, and user session management.",
    architecture: "FastAPI / Node.js -> Context Aggregator -> Vector DB Retrieval -> Streaming LLM Inference",
    challenges: ["Real-time response streaming latency (<200ms TTFT)", "Context window optimization", "User privacy and data isolation"],
    outcome: "Increased user retention by 42% through personalized, context-aware coaching reflections with 99.8% uptime.",
    live_url: "https://dev.alevo.ai/",
    cover_image_url: "/images/projects/alevo.webp",
    created_at: now,
    updated_at: now,
  },
  {
    id: "campgenie",
    title: "CampGenie",
    slug: "campgenie",
    company: "CampGenie",
    role: "Full Stack Engineer",
    category: "Platform",
    status: "published",
    featured: true,
    sort_order: 4,
    short_description: "Discovery and booking marketplace connecting outdoor enthusiasts with curated campsite experiences.",
    overview: "End-to-end camping marketplace enabling site owners to list campgrounds, manage live calendar availability, and process customer reservations.",
    problem: "Concurrent booking requests causing race conditions on popular campsite dates, combined with complex host payout splitting rules.",
    solution: "Engineered transactional reservation workflows with atomic inventory holds, webhook-verified Stripe payments, and an interactive search interface.",
    my_role: "Booking state machine, Stripe Connect payment split pipeline, PostgreSQL database modeling, and Next.js frontend.",
    architecture: "Next.js App Router -> API Routes -> Atomic Booking Transaction -> Stripe Webhooks -> Postgres",
    challenges: ["Preventing double-booking race conditions during peak flash sales", "Multi-party fee splitting", "Real-time calendar synchronization"],
    outcome: "Processed thousands of reservations with zero double-booking discrepancies and instant host disbursements.",
    live_url: "https://thisiscampgenie.com/",
    cover_image_url: "/images/projects/campgenie.webp",
    created_at: now,
    updated_at: now,
  },
  {
    id: "medclaim-ai",
    title: "MedClaim AI",
    slug: "medclaim-ai",
    company: "Renyx AI",
    role: "Backend & Systems Engineer",
    category: "AI",
    status: "published",
    featured: false,
    sort_order: 5,
    short_description: "Automated medical billing and insurance claim validation engine with compliance scoring.",
    overview: "Specialized clinical billing intelligence system that audits insurance claims, cross-references ICD-10/CPT coding rules, and flags denial risks.",
    problem: "Manual claim auditing is error-prone, labor-intensive, and leads to costly insurance denial cycles for healthcare providers.",
    solution: "Built an asynchronous rule verification and AI analysis pipeline that ingests claims, evaluates policy compliance, and produces risk scoring reports.",
    my_role: "Backend data architecture, asynchronous pipeline processing, HIPAA-compliant document parsing, and scoring algorithms.",
    architecture: "Secure Claim Upload -> OCR/Parser Service -> Rules Engine & LLM Verifier -> Compliance DB",
    challenges: ["Strict HIPAA data isolation and encryption", "Complex medical coding dependency rules", "High-throughput batch claim imports"],
    outcome: "Reduced initial claim rejection rate by 38% and cut manual audit time from hours to seconds.",
    live_url: "https://cardio-dev.renyxai.com/",
    cover_image_url: "/images/projects/medclaim-ai.webp",
    created_at: now,
    updated_at: now,
  },
  {
    id: "read-me-dark",
    title: "Read Me Dark",
    slug: "read-me-dark",
    company: "Open Source / Indie",
    role: "Frontend & Canvas Engineer",
    category: "Tools",
    status: "published",
    featured: false,
    sort_order: 6,
    short_description: "Client-side PDF theme transformer converting blinding white documents into comfortable dark mode themes.",
    overview: "Privacy-first web utility allowing readers and developers to render any bright PDF document with custom dark mode palettes.",
    problem: "Traditional PDF readers lack true inverted dark themes without raster distortion or privacy risks of uploading sensitive PDFs to servers.",
    solution: "Built client-side canvas-level shader rendering that parses PDF structures locally in-browser without sending user files across the network.",
    my_role: "Product architecture, WebAssembly / Canvas PDF rendering pipeline, and modern UI design.",
    architecture: "Browser File API -> PDF.js Canvas Pipeline -> Color Transformation Shader -> Real-time PDF Export",
    challenges: ["Zero server uploads (100% private in-browser execution)", "Retaining crisp vector font clarity", "High-performance multi-page rendering"],
    outcome: "Delivered an instant, privacy-respecting PDF reader with 0 network latency and smooth multi-page navigation.",
    live_url: "https://read-me-dark.vercel.app/",
    cover_image_url: "/images/projects/read-me-dark.webp",
    created_at: now,
    updated_at: now,
  },
  {
    id: "write-me-live",
    title: "Write Me Live",
    slug: "write-me-live",
    company: "Open Source / Indie",
    role: "Full Stack Engineer",
    category: "Tools",
    status: "published",
    featured: false,
    sort_order: 7,
    short_description: "Real-time collaborative writing room with instant synchronization, presence, and Markdown preview.",
    overview: "Focused two-person collaborative writing space engineered for paired authoring, code documentation, and real-time review.",
    problem: "Existing collaborative editors are bloated, heavily metered, and introduce notable lag during fast paired editing sessions.",
    solution: "Engineered an ultra-lightweight WebSocket sync protocol with operational state convergence, active collaborator presence, and live markdown preview.",
    my_role: "Full stack architecture, WebSocket sync server, conflict resolution handling, and client interface.",
    architecture: "Client Editor -> WebSocket Connection -> Lightweight State Convergence Engine -> Room Memory Cache",
    challenges: ["Low latency keystroke propagation (<50ms)", "Presence heartbeat synchronization", "Seamless reconnects"],
    outcome: "Achieved near-zero latency typing sync with a distraction-free writing environment.",
    live_url: "https://write-me-live.vercel.app/",
    cover_image_url: "/images/projects/write-me-live.webp",
    created_at: now,
    updated_at: now,
  },
];

const testimonials = [
  {
    id: "testimonial-sarah-jenkins",
    name: "Sarah Jenkins",
    job_title: "VP Engineering",
    company: "Klippify",
    testimonial: "Ghulam architected our billing infrastructure flawlessly. Transactions have never been more reliable.",
    featured: true,
    status: "published",
    sort_order: 1,
    created_at: now,
    updated_at: now,
  },
  {
    id: "testimonial-michael-chen",
    name: "Michael Chen",
    job_title: "CTO",
    company: "CrowdAxis",
    testimonial: "His deep understanding of AI pipelines and event orchestration completely transformed our intelligence product.",
    featured: true,
    status: "published",
    sort_order: 2,
    created_at: now,
    updated_at: now,
  },
];

const education = [
  {
    id: "edu-bs-cs",
    institution: "University of Management and Technology",
    degree: "Bachelor of Science",
    field: "Computer Science",
    location: "Lahore, Pakistan",
    start_date: "2019-09-01",
    end_date: "2023-07-01",
    description: "Focused on Distributed Systems, Algorithms & Data Structures, Database Systems, and Network Architecture.",
    sort_order: 1,
    created_at: now,
    updated_at: now,
  },
];

async function sync() {
  await client.connect();
  const db = client.db(dbName);
  console.log(`Connected to MongoDB database: "${dbName}"`);

  // 1. Sync Projects (upsert all 7, delete obsolete someday-came)
  console.log("\nSyncing projects...");
  await db.collection("projects").deleteOne({ slug: "someday-came" });
  for (const p of projects) {
    await db.collection("projects").updateOne(
      { slug: p.slug },
      { $set: p, $setOnInsert: { created_at: now } },
      { upsert: true }
    );
  }
  const projectCount = await db.collection("projects").countDocuments();
  console.log(`✓ Projects synced: ${projectCount} total in DB`);

  // 2. Sync Testimonials
  console.log("\nSyncing testimonials...");
  for (const t of testimonials) {
    await db.collection("testimonials").updateOne(
      { id: t.id },
      { $set: t, $setOnInsert: { created_at: now } },
      { upsert: true }
    );
  }
  const testimonialCount = await db.collection("testimonials").countDocuments();
  console.log(`✓ Testimonials synced: ${testimonialCount} total in DB`);

  // 3. Sync Education
  console.log("\nSyncing education...");
  for (const e of education) {
    await db.collection("education").updateOne(
      { id: e.id },
      { $set: e, $setOnInsert: { created_at: now } },
      { upsert: true }
    );
  }
  const eduCount = await db.collection("education").countDocuments();
  console.log(`✓ Education synced: ${eduCount} total in DB`);

  console.log("\n✅ Database sync complete! CMS records are now up to date.");
  await client.close();
}

sync().catch((err) => {
  console.error("Sync error:", err);
  process.exit(1);
});
