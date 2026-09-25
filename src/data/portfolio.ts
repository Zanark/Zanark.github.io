export interface StorySection {
  title: string;
  text: string;
}

export interface WorkStory {
  slug: string;
  number: string;
  title: string;
  kicker: string;
  summary: string;
  tools: string[];
  role: string;
  sections: StorySection[];
  takeaway: string;
}

export interface Project {
  slug: string;
  title: string;
  category: "creative" | "engineering" | "experiment";
  tagline: string;
  summary: string;
  description: string;
  status: string;
  tools: string[];
  decisions: string[];
  limitation: string;
  source?: string;
  demo?: string;
  art?: string;
  glyph: string;
}

export const channels = [
  { id: "signal", number: "01", label: "Signal" },
  { id: "work", number: "02", label: "Work" },
  { id: "projects", number: "03", label: "Play" },
  { id: "story", number: "04", label: "Story" },
  { id: "lab", number: "05", label: "Lab" },
  { id: "contact", number: "06", label: "Contact" },
] as const;

export const profile = {
  name: "Debashish Mishra",
  handle: "Zanark",
  role: "Software engineer & creative builder",
  employer: "Microsoft",
  github: "https://github.com/Zanark",
  intro: "I work where application engineering, cloud reliability, and creative tools meet. I like making complicated things useful, understandable, and a little more human.",
  about: "My path started with helping people make sense of data platforms. It moved through application development and into cloud reliability. Along the way, I kept building tools: some for operating software, others for drawing pixels, editing video, or making a workstation feel like my own.",
};

export const timeline = [
  { year: "2020", title: "Start with people.", role: "Customer engineering", text: "SQL Server assessments, Power BI workshops, technical troubleshooting and documentation. Learning to make a complex platform understandable was part of the job, not an extra." },
  { year: "2021", title: "Build the application.", role: "Application delivery", text: "Backend APIs, React interfaces, C# command-line tools and legacy .NET modernization. Implementation, production investigation and developer handoffs taught me how the pieces connect." },
  { year: "2024", title: "Care for the system.", role: "Cloud reliability", text: "Monitoring, deployment automation, configuration drift and reusable operational tooling. The focus expanded from making a feature work to helping people run and change it responsibly." },
] as const;

export const skills = [
  { title: "Application engineering", items: ["C#", ".NET / WCF", "Python", "Django REST", "React", "GraphQL integration"] },
  { title: "Systems & reliability", items: ["Azure", "PowerShell", "KQL", "Deployment pipelines", "Synthetic monitoring", "Configuration tooling"] },
  { title: "Creative tools", items: ["JavaScript", "SVG / Canvas", "Unity / C#", "FFmpeg", "Semantic palettes", "Local-first workflows"] },
] as const;

export const workStories: WorkStory[] = [
  {
    slug: "configuration-drift", number: "01", title: "Make the invisible difference visible.",
    kicker: "Configuration reliability",
    summary: "Turning the gap between deployed settings and repository configuration into something service owners can actually investigate.",
    tools: ["Configuration tooling", "Operational reporting", "Incident workflows"],
    role: "Tooling and reporting implementation",
    sections: [
      { title: "The problem", text: "A configuration in a repository describes intent. The settings running in an environment describe reality. When those two diverge, the difference needs to be understandable before anyone can decide what to change." },
      { title: "My contribution", text: "I developed tooling to compare deployed settings with their repository versions, then extended the workflow with visible differences, owner-facing reports and incident-workflow integration for critical discrepancies." },
      { title: "The important boundary", text: "Finding a difference is not the same as knowing which side is correct. The tool brings the discrepancy to the responsible people; investigation and corrective changes remain separate operational decisions." },
      { title: "Beyond the code", text: "The work evolved across review periods rather than appearing as a single finished platform. Reporting and integration were as important as the comparison: the result needed to reach the people who could act on it." },
    ],
    takeaway: "A useful operational tool makes the next decision clearer. It does not manufacture certainty.",
  },
  {
    slug: "developer-tooling", number: "02", title: "A good command is a good interface.",
    kicker: "C# developer tooling",
    summary: "Command-line operations, existing GraphQL APIs and a Linux demonstration environment—with documentation that travels with the code.",
    tools: ["C#", "GraphQL", "RHEL / Linux", "Technical documentation"],
    role: "Command implementation and developer enablement",
    sections: [
      { title: "The problem", text: "An existing computing workflow needed command-line operations that engineers could use and explain. The challenge included understanding the established architecture, not replacing it with a new platform." },
      { title: "My contribution", text: "I implemented C# commands integrated with the existing GraphQL APIs. Alongside command development, I helped bring up the legacy environment, prepared a RHEL-based container for demonstrations and addressed deployment bugs." },
      { title: "The handoff matters", text: "I documented the individual commands and provided knowledge transfer so that their purpose and behavior were easier for teammates to understand. A working demo is more useful when someone else can follow it." },
      { title: "Scope, honestly", text: "This was implementation within a team's architecture. It was not ownership of the GraphQL platform or the underlying computing infrastructure, and a demonstration should not be mistaken for every command being deployed in production." },
    ],
    takeaway: "Developer experience includes the command, the environment, and the explanation.",
  },
  {
    slug: "readiness", number: "03", title: "Ready is a question of evidence.",
    kicker: "Migration preparation",
    summary: "Keeping intended configuration, observed infrastructure and human approval separate in migration-readiness tooling.",
    tools: ["Python", "PowerShell", "Evidence validation", "Capacity modelling"],
    role: "Engineering, review and reporting contribution",
    sections: [
      { title: "The problem", text: "A green badge can hide several different questions: is the configuration understood, is the observation complete, does the model fit, and has someone approved the change? Combining those questions too early makes a report look more certain than it is." },
      { title: "The approach", text: "I contributed to workflows that prepare a scoped plan, collect read-only observations in a constrained administrative environment, and validate the returned evidence before producing an offline report." },
      { title: "Model the limits", text: "The capacity work distinguishes workload requirements from quota accounting, considers shared constraints, and keeps unknown results separate from verified incompatibility. A small bootstrap fit does not automatically approve later growth or activation." },
      { title: "What this delivers", text: "The deliverable is planning, collection and decision-support tooling. Provisioning, production operation and traffic changes are separate outcomes. The interactive sketch in this portfolio uses invented inputs, not operational records." },
    ],
    takeaway: "Missing evidence should stay visible—not quietly become a success state.",
  },
  {
    slug: "backend-apis", number: "04", title: "Make the backend easier to work with.",
    kicker: "Application engineering",
    summary: "Django REST endpoint work for an analytics application, paired with dashboard-facing APIs and practical documentation.",
    tools: ["Python", "Django REST", "API design", "Developer handoffs"],
    role: "Backend endpoint implementation",
    sections: [
      { title: "The problem", text: "An analytics application needed more responsive backend endpoints and additional APIs for its dashboards. The work took place inside an existing application, with its existing team and product context." },
      { title: "My contribution", text: "I refactored endpoint logic, added dashboard-facing endpoints and wrote technical documentation for leads and onboarding. The effort combined changes to the service with a clearer explanation of how to use it." },
      { title: "Explain the work, not a headline", text: "The engagement reported improved responsiveness. I am deliberately not presenting an independently unreproduced timing figure here, or assigning the improvement to an undocumented technique such as indexing or caching." },
      { title: "A recurring pattern", text: "Across backend, interface and command-line work, I keep returning to the same handoff: a useful implementation and enough context for the next engineer to understand it." },
    ],
    takeaway: "Performance work deserves measurement context. Useful software also deserves useful documentation.",
  },
];

export const projects: Project[] = [
  {
    slug: "spritecanvas", title: "SpriteCanvas", category: "creative", glyph: "PX",
    tagline: "Pixels with a human in the loop.",
    summary: "An editable pixel-art studio where a proposal never silently replaces your artwork.",
    description: "A browser studio for layered pixel art and animation, with review-first collaboration. An external agent can propose a separate candidate; the artist inspects the baseline, candidate and rendered differences before accepting it.",
    status: "Browser editor", tools: ["JavaScript", "IndexedDB", "Node.js", "Canvas"],
    decisions: ["Keep editable RGBA pixels, layers and frames in a validated document model.", "Separate the baseline and candidate, and reject acceptance against a stale revision.", "Show rendered-pixel differences instead of asking the user to trust an unseen change."],
    limitation: "Agent collaboration uses an optional local bridge or file handoffs, not simultaneous cloud collaboration or an embedded AI model.",
    source: "https://github.com/Zanark/SpriteCanvas", demo: "https://zanark.github.io/SpriteCanvas/", art: "/art/sprite-cartridge.svg",
  },
  {
    slug: "deepseafoam", title: "DeepSeaFoam", category: "creative", glyph: "DS",
    tagline: "One palette. Many different worlds.",
    summary: "A semantic color system that translates carefully across application theme formats.",
    description: "A cross-application dark theme and generator, derived from Solarized. The interesting part is preserving a consistent visual language while being honest about what each application's theme system can and cannot express.",
    status: "Theme collection", tools: ["JavaScript", "JSON", "CSS", "Static generation"],
    decisions: ["Define colors centrally by semantic role, not as unrelated per-app palettes.", "Translate through application-specific emitters and native format conventions.", "Check selected contrast pairs and generated-file freshness to catch drift."],
    limitation: "Targets have different capabilities. Some are limited presets or manual recipes rather than full native integrations.",
    source: "https://github.com/Zanark/DeepSeaFoam", demo: "https://zanark.github.io/DeepSeaFoam/", art: "/art/theme-cartridge.svg",
  },
  {
    slug: "clipfarm", title: "ClipFarm", category: "engineering", glyph: "CF",
    tagline: "Every cut keeps its story.",
    summary: "A local-first media workflow connecting source intervals, rendered clips and review.",
    description: "A local editing studio and editorial workflow for turning recordings into captioned clips. Source maps, transcripts and review records keep decisions attached to the particular output that was inspected.",
    status: "Local tool", tools: ["Python", "FastAPI", "SQLite", "FFmpeg"],
    decisions: ["Use transactional revision checks so an older editing session cannot overwrite newer state.", "Give the media worker a persisted submission snapshot and explicit cancellation states.", "Bind reviews to video and transcript hashes; do not silently replace a different final bundle."],
    limitation: "Rendering and review do not establish final human approval. Delivery creates local bundles, not automatic social-platform posts.",
    art: "/art/media-cartridge.svg",
  },
  {
    slug: "entropytag", title: "EntropyTag", category: "experiment", glyph: "ET",
    tagline: "Territory. Elements. A little chaos.",
    summary: "An original game prototype exploring elemental territory, movement and bounded paint.",
    description: "A Unity prototype with third-person movement, elemental territory control, bots and timed matches. Small, reviewable sandboxes keep rule changes and visible behavior close enough to inspect before expanding the experiment.",
    status: "In development", tools: ["C#", "Unity", "URP", "Gameplay rules"],
    decisions: ["Separate plain C# match rules from Unity adapters.", "Resolve actor hits first, then require valid static support before painting.", "Keep logical territory and visible splats on the same surface, clipping to its bounds."],
    limitation: "This is an unfinished prototype, not a released multiplayer game or a browser port.",
    source: "https://github.com/Zanark/Entropy-Tag",
  },
  {
    slug: "kardboardcode", title: "KardboardCode", category: "experiment", glyph: "KC",
    tagline: "A character made from the newest frame.",
    summary: "A cardboard-avatar pipeline that connects capture, face tracking, rendering and OBS.",
    description: "A personal creator tool integrating camera input, face tracking and GPU rendering into a stylized cardboard character. Freshness and explicit tracking-loss behavior are part of the pipeline, not just rendering details.",
    status: "Native prototype", tools: ["Python", "OpenCV", "MediaPipe", "ModernGL"],
    decisions: ["Keep a latest-frame slot rather than accumulating a delayed capture queue.", "Treat stale tracking as unavailable and retain an explicit safe-output fallback.", "Send composed frames to the virtual camera before preview-only debug overlays."],
    limitation: "A native vertical slice, not a browser application or a guarantee against every possible privacy failure.",
    source: "https://github.com/Zanark/KardboardCode-VTuber",
  },
  {
    slug: "resume-builder", title: "Resume Builder", category: "engineering", glyph: "RB",
    tagline: "Keep the story. Change the layout.",
    summary: "Structured career content projected into different roles and rendering systems.",
    description: "A Python utility that keeps a complete structured master while creating role-specific content and layouts. It separates source data, transformations and rendering rather than cutting the master down to fit one document.",
    status: "Local utility", tools: ["Python", "YAML", "Jinja", "RenderCV / Typst"],
    decisions: ["Deep-copy the master before applying explicit variant transformations.", "Keep HTML/browser and RenderCV/Typst rendering paths separate.", "Use bounded measured auto-fit attempts for supported HTML outputs."],
    limitation: "Automatic page fitting depends on the rendering path and successful measurement; it is not a universal page-count or ATS guarantee.",
  },
];
