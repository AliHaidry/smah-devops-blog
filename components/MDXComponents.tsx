// components/MDXComponents.tsx
// ─────────────────────────────────────────────────────────────────────────────
// Register ALL custom components here.
// They become available in every .mdx file without any import.
//
// Usage in .mdx:
//   <SOLIDExplorer />
//   <Quiz question="..." opts={[...]} correct={1} explanations={[...]} />
//
// Rules (from tailwind-nextjs-starter-blog):
//   1. Always use DEFAULT exports in component files (not named exports)
//   2. Add 'use client' to any component using useState / useEffect
//   3. Register the component name here exactly as you want to use it in MDX
// ─────────────────────────────────────────────────────────────────────────────

import { MDXComponents } from 'mdx/types'
import Image from './Image'
import CustomLink from './Link'

// ── Module 01: Foundations ────────────────────────────────────────────────────
import BigOVisual, {
  AlgorithmPatterns,
  ComputationalThinkingPillars,
  DataStructuresTable,
  FoundationsChecklist,
  LinuxCommands,
  NetworkingConcepts,
  ProgrammingConcepts,
} from './learning/foundations'

// ── Module 02: Systems Design ─────────────────────────────────────────────────
import DesignFramework, {
  CachingStrategies,
  DistributedConceptsGrid,
  ObservabilityPillars,
  SecurityConceptsGrid,
  SystemsDesignChecklist,
  TradeoffExplorer,
} from './learning/systems-design'

// ── Module 04: AI / ML Engineering ───────────────────────────────────────────
import MLConceptsGrid, {
  AIChecklist,
  AIDecisionTree,
  MLOpsToolsTable,
  PromptPatternsTable,
  VectorDBComparison,
} from './learning/ai-ml'

// ── Module 05: Software Design & Craft ───────────────────────────────────────
import NamingTaxonomy, {
  APIDesignComparison,
  ArchitectureExplorer,
  CodeSmells,
  CraftChecklist,
  PatternExplorer,
  SOLIDExplorer,
  TestingPyramid,
} from './learning/software-design'

// ── Module 06: Communication & Influence ─────────────────────────────────────
import DocumentTypesTable, {
  C4ModelDiagram,
  CodeReviewPrinciples,
  CommChecklist,
  MentoringTechniques,
  TechnicalToBusinessTable,
} from './learning/communication'

// ── Boilerplate defaults (keep these) ────────────────────────────────────────
export const components: MDXComponents = {
  Image,
  a: CustomLink,

  // ── Module 01 ────────────────────────────────────────────────────────────
  BigOVisual,
  DataStructuresTable,
  AlgorithmPatterns,
  ComputationalThinkingPillars,
  ProgrammingConcepts,
  NetworkingConcepts,
  LinuxCommands,
  FoundationsChecklist,

  // ── Module 02 ────────────────────────────────────────────────────────────
  DesignFramework,
  TradeoffExplorer,
  DistributedConceptsGrid,
  CachingStrategies,
  SecurityConceptsGrid,
  ObservabilityPillars,
  SystemsDesignChecklist,

  // ── Module 04 ────────────────────────────────────────────────────────────
  MLConceptsGrid,
  PromptPatternsTable,
  VectorDBComparison,
  MLOpsToolsTable,
  AIDecisionTree,
  AIChecklist,

  // ── Module 05 ────────────────────────────────────────────────────────────
  NamingTaxonomy,
  SOLIDExplorer,
  PatternExplorer,
  ArchitectureExplorer,
  TestingPyramid,
  CodeSmells,
  APIDesignComparison,
  CraftChecklist,

  // ── Module 06 ────────────────────────────────────────────────────────────
  DocumentTypesTable,
  C4ModelDiagram,
  CodeReviewPrinciples,
  TechnicalToBusinessTable,
  MentoringTechniques,
  CommChecklist,
}
