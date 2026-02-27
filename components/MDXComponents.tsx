import TOCInline from 'pliny/ui/TOCInline'
import Pre from 'pliny/ui/Pre'
import BlogNewsletterForm from 'pliny/ui/BlogNewsletterForm'
import type { MDXComponents } from 'mdx/types'
import Image from './Image'
import CustomLink from './Link'
import TableWrapper from './TableWrapper'


import { RoadmapNav, ModuleSection, RoadmapFooter } from './RoadmapNav'
import BigOVisual, {
  DataStructuresTable, AlgorithmPatterns, ComputationalThinkingPillars,
  ProgrammingConcepts, NetworkingConcepts, LinuxCommands, FoundationsChecklist,
} from './learning/foundations'
import DesignFramework, {
  TradeoffExplorer, DistributedConceptsGrid, CachingStrategies,
  SecurityConceptsGrid, ObservabilityPillars, SystemsDesignChecklist, CAPTheoremDiagram,
} from './learning/systems-design'
import MLConceptsGrid, {
  PromptPatternsTable, VectorDBComparison, MLOpsToolsTable, AIDecisionTree, AIChecklist,
} from './learning/ai-ml'
import NamingTaxonomy, {
  SOLIDExplorer, PatternExplorer, ArchitectureExplorer,
  TestingPyramid, CodeSmells, APIDesignComparison, CraftChecklist,
} from './learning/software-design'
import DocumentTypesTable, {
  C4ModelDiagram, CodeReviewPrinciples, TechnicalToBusinessTable,
  MentoringTechniques, CommChecklist,
} from './learning/communication'


export const components: MDXComponents = {
  Image,
  TOCInline,
  a: CustomLink,
  pre: Pre,
  table: TableWrapper,
  BlogNewsletterForm,
  
  // ...your existing stuff (Image, TOCInline, a, pre, etc.)...

  RoadmapNav,
  ModuleSection,
  RoadmapFooter,
  BigOVisual, DataStructuresTable, AlgorithmPatterns, ComputationalThinkingPillars,
  ProgrammingConcepts, NetworkingConcepts, LinuxCommands, FoundationsChecklist,
  DesignFramework, TradeoffExplorer, DistributedConceptsGrid, CachingStrategies,
  SecurityConceptsGrid, ObservabilityPillars, SystemsDesignChecklist, CAPTheoremDiagram,
  MLConceptsGrid, PromptPatternsTable, VectorDBComparison, MLOpsToolsTable,
  AIDecisionTree, AIChecklist,
  NamingTaxonomy, SOLIDExplorer, PatternExplorer, ArchitectureExplorer,
  TestingPyramid, CodeSmells, APIDesignComparison, CraftChecklist,
  DocumentTypesTable, C4ModelDiagram, CodeReviewPrinciples, TechnicalToBusinessTable,
  MentoringTechniques, CommChecklist,

}


