'use client'

import { useState } from 'react'
import { C, Card, Checklist, DataTable } from './shared'

// ── ML Concepts Grid ──────────────────────────────────────────────────────────
export default function MLConceptsGrid() {
  const concepts = [
    {
      name: 'Loss Function',
      color: C.amber,
      desc: "Measures how wrong the model's predictions are. Training minimises this. Cross-entropy for classification, MSE for regression.",
    },
    {
      name: 'Gradient Descent',
      color: C.cyan,
      desc: 'The optimisation algorithm. Calculate the gradient (direction of steepest error increase), step in the opposite direction. Repeat.',
    },
    {
      name: 'Learning Rate',
      color: C.green,
      desc: 'Step size for each gradient update. Too high: overshoots minimum. Too low: takes forever. Learning rate schedules adjust it during training.',
    },
    {
      name: 'Epoch & Batch',
      color: C.blue,
      desc: 'Epoch = one full pass through training data. Batch = subset of data processed together. Mini-batches balance speed and stability.',
    },
    {
      name: 'Regularisation',
      color: C.purple,
      desc: 'Techniques to prevent overfitting: L1/L2 weight penalties, dropout (randomly zero-out neurons), early stopping, data augmentation.',
    },
    {
      name: 'Evaluation Metrics',
      color: C.red,
      desc: 'Accuracy, precision, recall, F1 for classification. RMSE, MAE for regression. AUC-ROC for ranking. Choose based on what failure costs.',
    },
  ]
  return (
    <div className="my-4 grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3">
      {concepts.map((c) => (
        <Card key={c.name} accent={c.color}>
          <div className="mb-2 text-sm font-bold" style={{ color: c.color }}>
            {c.name}
          </div>
          <div className="leading-relaxed text-zinc-400">{c.desc}</div>
        </Card>
      ))}
    </div>
  )
}

// ── Prompt Patterns Table ─────────────────────────────────────────────────────
export function PromptPatternsTable() {
  const patterns = [
    {
      name: 'Zero-shot',
      when: 'Simple, clear tasks',
      example: '"Classify this review as positive/negative."',
      note: 'Start here. Often enough.',
    },
    {
      name: 'Few-shot',
      when: 'Specific format or edge cases',
      example: '"Here are 3 examples of the format I want: [...] Now do this one:"',
      note: "Show, don't just tell.",
    },
    {
      name: 'Chain-of-Thought',
      when: 'Reasoning, multi-step problems',
      example: '"Think step by step before answering."',
      note: 'Improves accuracy on hard problems.',
    },
    {
      name: 'Structured Output',
      when: 'Downstream processing',
      example: '"Respond only as JSON with keys: verdict, issues, summary."',
      note: 'Essential for production integrations.',
    },
  ]
  return (
    <DataTable
      heads={['Pattern', 'Use When', 'Example Instruction', 'Why It Works']}
      rows={patterns.map((p) => [p.name, p.when, p.example, p.note])}
    />
  )
}

// ── Vector DB Comparison ──────────────────────────────────────────────────────
export function VectorDBComparison() {
  const dbs = [
    {
      name: 'Pinecone',
      color: C.cyan,
      type: 'Managed',
      bestFor: 'Fastest to production, no ops burden',
      tradeoff: 'Cost at scale, vendor lock-in',
    },
    {
      name: 'pgvector',
      color: C.green,
      type: 'PostgreSQL ext',
      bestFor: 'You already use Postgres, simple needs',
      tradeoff: 'Slower ANN search at large scale',
    },
    {
      name: 'Weaviate',
      color: C.amber,
      type: 'OSS / Managed',
      bestFor: 'Hybrid search (vector + keyword)',
      tradeoff: 'Heavier to self-host',
    },
    {
      name: 'Chroma',
      color: C.purple,
      type: 'OSS / Embedded',
      bestFor: 'Local dev, prototyping, small datasets',
      tradeoff: 'Not production-scale',
    },
    {
      name: 'Qdrant',
      color: C.blue,
      type: 'OSS / Cloud',
      bestFor: 'High performance, rich filtering',
      tradeoff: 'Newer, smaller community',
    },
  ]
  return (
    <div className="my-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
      {dbs.map((db) => (
        <Card key={db.name} accent={db.color}>
          <div className="mb-2 flex items-center justify-between">
            <div className="text-sm font-bold" style={{ color: db.color }}>
              {db.name}
            </div>
            <span
              className="rounded-sm px-2 py-0.5 font-mono text-[9px]"
              style={{ background: `${db.color}22`, color: db.color }}
            >
              {db.type}
            </span>
          </div>
          <div className="mb-1 text-xs text-zinc-400">
            <span style={{ color: C.green }}>+</span> {db.bestFor}
          </div>
          <div className="text-xs text-zinc-500">
            <span style={{ color: C.red }}>−</span> {db.tradeoff}
          </div>
        </Card>
      ))}
    </div>
  )
}

// ── MLOps Tools Table ─────────────────────────────────────────────────────────
export function MLOpsToolsTable() {
  return (
    <DataTable
      heads={['Category', 'Tools', 'What It Solves']}
      rows={[
        [
          'Experiment Tracking',
          'MLflow, Weights & Biases, Neptune',
          'Reproducibility — track params, metrics, artefacts per run',
        ],
        [
          'Model Registry',
          'MLflow, Hugging Face Hub, SageMaker',
          'Versioned model storage, promotion workflows (staging → prod)',
        ],
        [
          'Feature Store',
          'Feast, Tecton, Vertex AI Feature Store',
          'Consistent features between training and serving',
        ],
        [
          'Model Serving',
          'FastAPI + Docker, BentoML, Seldon, TorchServe',
          'Low-latency inference endpoints with scaling',
        ],
        [
          'Pipeline Orchestration',
          'Airflow, Kubeflow, Prefect, ZenML',
          'Automated data→train→evaluate→deploy pipelines',
        ],
        [
          'Monitoring',
          'Evidently, WhyLabs, Arize, Prometheus',
          'Drift detection, data quality, performance degradation',
        ],
        [
          'CI/CD for ML',
          'GitHub Actions + DVC, CML',
          'Automated testing, model evaluation on every commit',
        ],
      ]}
    />
  )
}

// ── AI Decision Tree ──────────────────────────────────────────────────────────
export function AIDecisionTree() {
  const nodes = [
    {
      q: 'Does the problem have clear patterns in historical data?',
      yes: 1,
      no: 'Use rules/heuristics. Save the complexity.',
    },
    { q: 'Does it need to understand or generate natural language?', yes: 2, no: 3 },
    { q: 'Is proprietary/recent knowledge required?', yes: 'LLM + RAG', no: 4 },
    {
      q: 'Is it classification, regression, or ranking on tabular data?',
      yes: 'Classical ML (XGBoost, sklearn)',
      no: 5,
    },
    { q: 'Can a well-crafted prompt solve it today?', yes: 'Prompt engineering first', no: 6 },
    {
      q: 'Do you need a specific style, format, or niche domain vocabulary?',
      yes: 'Fine-tuning',
      no: 'Re-examine problem definition',
    },
  ]
  const [step, setStep] = useState<number | string>(0)
  const current = nodes[typeof step === 'number' ? step : 0]
  const isLeaf = typeof current?.yes === 'string'

  return (
    <div className="my-6 rounded-sm border border-zinc-700 bg-zinc-900 p-5">
      <div className="mb-4 font-mono text-[9px] tracking-[3px] text-zinc-500 uppercase">
        AI Approach Decision Tree
      </div>
      {typeof step === 'string' ? (
        <div>
          <div className="mb-4 text-sm font-bold" style={{ color: C.green }}>
            → Recommendation: {step}
          </div>
          <button
            onClick={() => setStep(0)}
            className="rounded-sm border border-zinc-700 px-3 py-1.5 font-mono text-xs text-zinc-400 transition-colors hover:border-zinc-500"
          >
            ↩ Start over
          </button>
        </div>
      ) : (
        <div>
          <p className="mb-4 text-sm leading-relaxed font-semibold text-zinc-200">{current.q}</p>
          <div className="flex gap-3">
            <button
              onClick={() => setStep(isLeaf ? (current.yes as string) : (current.yes as number))}
              className="flex-1 rounded-sm border border-zinc-700 px-4 py-2.5 text-sm transition-all duration-150 hover:border-green-500/50 hover:bg-green-500/10"
              style={{ color: C.green }}
            >
              Yes →
            </button>
            <button
              onClick={() =>
                setStep(typeof current.no === 'number' ? current.no : (current.no as string))
              }
              className="flex-1 rounded-sm border border-zinc-700 px-4 py-2.5 text-sm transition-all duration-150 hover:border-red-500/50 hover:bg-red-500/10"
              style={{ color: C.red }}
            >
              No →
            </button>
          </div>
          {typeof step === 'number' && step > 0 && (
            <button
              onClick={() => setStep(0)}
              className="mt-3 font-mono text-xs text-zinc-600 transition-colors hover:text-zinc-400"
            >
              ↩ Start over
            </button>
          )}
        </div>
      )}
    </div>
  )
}

// ── AI Checklist ──────────────────────────────────────────────────────────────
export function AIChecklist() {
  return (
    <Checklist
      storageKey="ai-ml-checklist"
      items={[
        'Trained a classifier end-to-end: data → model → evaluation → iteration',
        'Can read a loss curve and diagnose overfitting vs underfitting',
        'Built and evaluated a RAG pipeline (chunking, embedding, retrieval, generation)',
        'Measured retrieval quality with recall@k on a test set',
        'Written a systematic eval suite with >20 test cases for an LLM application',
        'Implemented at least 2 prompt engineering patterns: few-shot and chain-of-thought',
        'Served a model via a REST API with proper error handling and timeouts',
        'Set up experiment tracking (MLflow or W&B) with parameter and metric logging',
        "Implemented drift detection on a deployed model's input distribution",
        'Built a CI pipeline that runs model evals on every commit',
        'Can explain the OWASP Top 5 for LLMs with a concrete example of each',
        'Calculated and tracked cost-per-inference for a production LLM endpoint',
        'Completed fast.ai Practical Deep Learning Part 1',
        'Watched Karpathy's "Let's build GPT from scratch"',
      ]}
    />
  )
}
