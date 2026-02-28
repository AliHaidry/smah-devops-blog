import TOCInline from 'pliny/ui/TOCInline'
import Pre from 'pliny/ui/Pre'
import BlogNewsletterForm from 'pliny/ui/BlogNewsletterForm'
import type { MDXComponents } from 'mdx/types'
import Image from './Image'
import CustomLink from './Link'
import TableWrapper from './TableWrapper'

// ── Roadmap layout components ─────────────────────────────────────────────────
import { RoadmapNav } from './RoadmapNav'
import { CAPTheoremDiagram, ModuleSection, RoadmapFooter } from './learning/roadmap-wrappers'

// ── Module 01: Foundations ────────────────────────────────────────────────────
import BigOVisual, {
  DataStructuresTable,
  AlgorithmPatterns,
  ComputationalThinkingPillars,
  ProgrammingConcepts,
  NetworkingConcepts,
  LinuxCommands,
  FoundationsChecklist,
} from './learning/foundations'

// ── Module 02: Systems Design ─────────────────────────────────────────────────
import DesignFramework, {
  TradeoffExplorer,
  DistributedConceptsGrid,
  CachingStrategies,
  SecurityConceptsGrid,
  ObservabilityPillars,
  SystemsDesignChecklist,
} from './learning/systems-design'

// ── Module 04: AI / ML Engineering ───────────────────────────────────────────
import MLConceptsGrid, {
  PromptPatternsTable,
  VectorDBComparison,
  MLOpsToolsTable,
  AIDecisionTree,
  AIChecklist,
} from './learning/ai-ml'

// ── Module 05: Software Design & Craft ───────────────────────────────────────
import NamingTaxonomy, {
  SOLIDExplorer,
  PatternExplorer,
  ArchitectureExplorer,
  TestingPyramid,
  CodeSmells,
  APIDesignComparison,
  CraftChecklist,
} from './learning/software-design'

// ── Module 06: Communication & Influence ─────────────────────────────────────
import DocumentTypesTable, {
  C4ModelDiagram,
  CodeReviewPrinciples,
  TechnicalToBusinessTable,
  MentoringTechniques,
  CommChecklist,
} from './learning/communication'

export const components: MDXComponents = {
  Image,
  TOCInline,
  a: CustomLink,
  pre: Pre,
  table: TableWrapper,
  BlogNewsletterForm,

  // ...your existing stuff (Image, TOCInline, a, pre, etc.)...

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

  // ── Roadmap layout ────────────────────────────────────────────────────────
  RoadmapNav,
  ModuleSection,
  RoadmapFooter,
  CAPTheoremDiagram,
}
