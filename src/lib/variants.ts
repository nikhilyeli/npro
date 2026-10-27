// Per-company content variants: truthful re-framing of what's already in portfolio.json.
// Nothing here invents a fact — it only reorders, re-weights or re-phrases real data so the
// page reads as "why I'd fit here" for the company whose theme is active. Signal (the default)
// has no variant and renders exactly as before.
import type { BrandId } from './brandIds';

export interface CompanyVariant {
  // A tailored one-line replacement for the hero's default description.
  heroDescription: string;
  // 2-4 short, truthful reasons this background fits the company. Every claim must trace to
  // something already in portfolio.json (skills, experience highlights, or projects).
  whyFit: string[];
  // Project ids in preferred display order; any project not listed keeps its original relative order, appended after.
  projectOrder?: number[];
  // Skill category display order (categories not listed keep their default relative order, appended after).
  skillOrder?: Array<'frontend' | 'backend' | 'tools' | 'design'>;
}

export const VARIANTS: Partial<Record<BrandId, CompanyVariant>> = {
  microsoft: {
    heroDescription: 'Full-stack engineer building on the Microsoft stack: C#, .NET/ASP.NET, and Azure data engineering, end to end.',
    whyFit: [
      'Builds day to day on the Microsoft stack: C#, .NET/ASP.NET, Entity Framework, SQL Server, and Azure Databricks/Data Factory for data engineering.',
      'Daily tools are Visual Studio, VS Code, and Azure DevOps.',
      'Delivered measurable wins on Microsoft-stack projects: a 20% rise in customer satisfaction and a 15% drop in issue escalation at HCL Technologies.',
    ],
    projectOrder: [3, 1, 7],
    skillOrder: ['backend', 'tools', 'frontend', 'design'],
  },
  anthropic: {
    heroDescription: 'Full-stack engineer who likes thinking calmly through hard problems and building small, thoughtful AI-assisted tools.',
    whyFit: [
      'Built an AI-orchestration tool (AI Work Diary) that summarizes work activity across Jira and Bitbucket using AI.',
      'Approaches problems methodically: 300+ bugs resolved and testing plans that cut post-release defects by 15% at HCL.',
      'Comfortable across the stack, from React/TypeScript frontends to Python-based computer vision (Live Yoga Simulation).',
    ],
    projectOrder: [1, 4, 7],
    skillOrder: ['frontend', 'backend', 'tools', 'design'],
  },
  google: {
    heroDescription: 'Full-stack engineer with hands-on cloud data engineering experience and a habit of testing what ships.',
    whyFit: [
      'Built and shipped ETL/ELT pipelines and KPI dashboards on Azure Databricks, Data Factory, and PySpark — the same data-engineering muscles cloud-scale systems need.',
      'Writes end-to-end tests (Playwright) and cares about reliability, not just features.',
      'Cut customer attrition by 10% and lifted retention by 15% on a Customer 360 analytics project by turning data into decisions.',
    ],
    projectOrder: [3, 7, 1],
    skillOrder: ['backend', 'tools', 'frontend', 'design'],
  },
  apple: {
    heroDescription: 'Full-stack engineer with a UI/UX design background who sweats the details of an interface.',
    whyFit: [
      'Trained and works in UI/UX: Figma prototyping, Material UI and Tailwind design systems, micro-animations.',
      'Shipped a computer-vision product (Live Yoga Simulation) end to end, from model to a live, usable interface.',
      'A 30% increase in user engagement on a personal project (Code Ninja) came from getting the small interaction details right.',
    ],
    projectOrder: [2, 6, 4],
    skillOrder: ['design', 'frontend', 'backend', 'tools'],
  },
  meta: {
    heroDescription: 'React and TypeScript developer who ships fast and iterates in the open.',
    whyFit: [
      'React and TypeScript are the daily stack, both at work and across personal projects.',
      'Comfortable moving quickly: shipped seven personal projects alongside full-time work.',
      'Believes in testing what matters: end-to-end coverage with Playwright, not brittle tests for their own sake.',
    ],
    projectOrder: [2, 1, 6],
    skillOrder: ['frontend', 'tools', 'backend', 'design'],
  },
  netflix: {
    heroDescription: 'Full-stack engineer who thinks in metrics: what moved, by how much, and why.',
    whyFit: [
      "Nearly every highlight on this page has a number attached: a 10% cut in customer attrition, a 25% faster data pipeline, a 30% lift in engagement — shipping gets measured, not assumed.",
      'Built large-scale data pipelines (Azure Databricks, Data Factory, PySpark) that turned raw activity into dashboards people actually used.',
      'Full-stack range from React/TypeScript frontends to backend services and data engineering.',
    ],
    projectOrder: [3, 7, 1],
    skillOrder: ['backend', 'frontend', 'tools', 'design'],
  },
  amazon: {
    heroDescription: 'Full-stack engineer with a track record of measurable ownership across customer satisfaction, resolution time, and data accuracy.',
    whyFit: [
      'Consistently ships outcomes with numbers behind them: a 20% rise in customer satisfaction, a 15% drop in escalations, and a 95% client satisfaction rate while resolving 500+ technical queries a month.',
      'Owns problems end to end: transitioned roles within 3 months, resolved 300+ bugs, and cut backlog by 30%.',
      'Data-engineering background (Azure Databricks, Data Factory, PySpark) built for scale and accuracy.',
    ],
    projectOrder: [3, 1, 7],
    skillOrder: ['backend', 'tools', 'frontend', 'design'],
  },
  openai: {
    heroDescription: 'Full-stack engineer building toward AI-native products, from an AI work-summarization tool to computer-vision pose detection.',
    whyFit: [
      'Built an AI orchestration tool (AI Work Diary) that uses AI to summarize work activity across multiple sources.',
      'Shipped a computer-vision ML project (Live Yoga Simulation) with 90% pose-detection accuracy using OpenCV and MediaPipe.',
      'Full-stack range (React/TypeScript to Python/PySpark) to build both the model side and the product around it.',
    ],
    projectOrder: [1, 4, 7],
    skillOrder: ['backend', 'frontend', 'tools', 'design'],
  },
};

export const getVariant = (brand: BrandId): CompanyVariant | null => VARIANTS[brand] ?? null;

export const orderByIds = <T extends { id: number }>(items: T[], order?: number[]): T[] => {
  if (!order || order.length === 0) return items;
  const rank = new Map(order.map((id, i) => [id, i]));
  return [...items].sort((a, b) => (rank.get(a.id) ?? order.length + a.id) - (rank.get(b.id) ?? order.length + b.id));
};

export const orderByCategory = <T extends { category: string }>(items: T[], order?: string[]): T[] => {
  if (!order || order.length === 0) return items;
  const rank = new Map(order.map((c, i) => [c, i]));
  return [...items].sort((a, b) => (rank.get(a.category) ?? order.length) - (rank.get(b.category) ?? order.length));
};
