'use client'

import dynamic from 'next/dynamic'

// ssr: false prevents AzureGatewayExplainer (which uses useState) from ever
// being executed in the server renderer during static page generation.
// The MDX file imports this wrapper — never the component directly.
const AzureGatewayExplainer = dynamic(() => import('./AzureGatewayExplainer'), {
  ssr: false,
  loading: () => (
    <div className="relative my-8 flex min-h-[420px] items-center justify-center overflow-hidden rounded-3xl border border-slate-700/50 bg-[#0a0e1a] shadow-2xl">
      <div className="text-center">
        <div className="mx-auto mb-3 h-2 w-48 animate-pulse rounded-full bg-slate-700/60" />
        <div className="mx-auto mb-2 h-8 w-80 animate-pulse rounded-lg bg-slate-700/40" />
        <div className="mx-auto h-4 w-64 animate-pulse rounded bg-slate-800/60" />
      </div>
    </div>
  ),
})

export default AzureGatewayExplainer
