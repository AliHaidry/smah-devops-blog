'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

const TOOLTIPS = [
  '👋 Click me!',
  '☁️ Azure expert on duty',
  '🚀 13+ blog posts live',
  '🤖 AI/ML DevOps',
  '⚙️ Terraform your infra',
  '🐳 Kubernetes all day',
  '📊 Grafana and Prometheus',
  '🔐 DevSecOps mindset',
]

const TECH_STACKS = [
  {
    label: 'Cloud',
    color: '#ec4899',
    items: [
      { name: 'Azure', tag: 'azure' },
      { name: 'AKS', tag: 'aks' },
      { name: 'FinOps', tag: 'finops' },
    ],
  },
  {
    label: 'IaC',
    color: '#a78bfa',
    items: [
      { name: 'Terraform', tag: 'terraform' },
      { name: 'Ansible', tag: 'ansible' },
    ],
  },
  {
    label: 'Containers',
    color: '#34d399',
    items: [
      { name: 'Kubernetes', tag: 'kubernetes' },
      { name: 'Docker', tag: 'docker' },
      { name: 'ArgoCD', tag: 'argo-cd' },
    ],
  },
  {
    label: 'Observability',
    color: '#fb923c',
    items: [
      { name: 'Prometheus', tag: 'prometheus' },
      { name: 'Grafana', tag: 'grafana' },
    ],
  },
]

// 4-frame leg positions [leftX, rightX] at y=50
const LEG_FRAMES: [number, number][] = [
  [14, 34],
  [10, 38],
  [14, 34],
  [20, 28],
]

export default function TechAvatar() {
  const [open, setOpen] = useState(false)
  const [tooltipIdx, setTooltipIdx] = useState(0)
  const [frame, setFrame] = useState(0)
  const [hovered, setHovered] = useState(false)
  const canvasWrapRef = useRef<HTMLDivElement>(null)
  const popupRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  // Tooltip cycling
  useEffect(() => {
    const id = setInterval(() => setTooltipIdx((i) => (i + 1) % TOOLTIPS.length), 3200)
    return () => clearInterval(id)
  }, [])

  // Leg animation
  useEffect(() => {
    const id = setInterval(() => setFrame((f) => (f + 1) % 4), 180)
    return () => clearInterval(id)
  }, [])

  // Three.js sphere
  useEffect(() => {
    if (!open || !canvasWrapRef.current) return
    const el = canvasWrapRef.current
    let cleanup: (() => void) | undefined

    import('three').then((THREE) => {
      if (!canvasWrapRef.current) return
      const W = el.clientWidth || 256
      const H = 120

      const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false })
      renderer.setSize(W, H)
      renderer.setPixelRatio(window.devicePixelRatio)
      renderer.setClearColor(0x050a14, 1)
      el.appendChild(renderer.domElement)

      const scene = new THREE.Scene()
      const camera = new THREE.PerspectiveCamera(55, W / H, 0.1, 100)
      camera.position.set(0, 0, 3.2)

      const sphere = new THREE.Mesh(
        new THREE.SphereGeometry(1, 18, 18),
        new THREE.MeshBasicMaterial({ color: 0xec4899, wireframe: true })
      )
      scene.add(sphere)

      const dotColors = [0xec4899, 0xa78bfa, 0x34d399, 0xfb923c]
      const dots = dotColors.map((c) =>
        new THREE.Mesh(
          new THREE.SphereGeometry(0.07, 8, 8),
          new THREE.MeshBasicMaterial({ color: c })
        )
      )
      dots.forEach((d) => scene.add(d))

      let raf: number
      let t = 0
      const animate = () => {
        raf = requestAnimationFrame(animate)
        t += 0.012
        sphere.rotation.y = t
        sphere.rotation.x = t * 0.3
        dots.forEach((d, i) => {
          const angle = t * 1.4 + (i * Math.PI) / 2
          d.position.set(
            Math.cos(angle) * 1.35,
            Math.sin(i * 0.8 + t * 0.6) * 0.5,
            Math.sin(angle) * 1.35
          )
        })
        renderer.render(scene, camera)
      }
      animate()

      cleanup = () => {
        cancelAnimationFrame(raf)
        renderer.dispose()
        if (el.contains(renderer.domElement)) el.removeChild(renderer.domElement)
      }
    })

    return () => cleanup?.()
  }, [open])

  // Click outside to close
  useEffect(() => {
    if (!open) return
    const handler = (e: MouseEvent) => {
      if (popupRef.current && !popupRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [open])

  const [leftX, rightX] = LEG_FRAMES[frame]

  return (
    <div ref={popupRef} className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-2">
      {/* Popup panel */}
      {open && (
        <div className="mb-2 w-72 rounded-2xl border border-pink-500 bg-[#0a0f1e] p-4 shadow-2xl">
          {/* Three.js canvas with label overlay */}
          <div className="relative mb-4 overflow-hidden rounded-xl" style={{ height: 120, background: '#050a14' }}>
            <div ref={canvasWrapRef} className="h-full w-full" />
            <span
              className="pointer-events-none absolute inset-0 flex items-center justify-center font-mono text-sm font-bold"
              style={{ color: '#ec4899', textShadow: '0 0 8px #ec4899' }}
            >
              {'</>'}
            </span>
          </div>

          {/* Tech stacks */}
          <div className="space-y-3">
            {TECH_STACKS.map((stack) => (
              <div key={stack.label}>
                <div className="mb-1.5 text-xs font-semibold text-gray-400">{stack.label}</div>
                <div className="flex flex-wrap gap-1.5">
                  {stack.items.map((item) => (
                    <button
                      key={item.tag}
                      onClick={() => {
                        router.push(`/tags/${item.tag}`)
                        setOpen(false)
                      }}
                      className="rounded-full px-2.5 py-0.5 text-xs font-medium transition hover:opacity-75"
                      style={{
                        backgroundColor: `${stack.color}20`,
                        color: stack.color,
                        border: `1px solid ${stack.color}40`,
                      }}
                    >
                      {item.name}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* CTAs */}
          <div className="mt-4 flex gap-2">
            <Link
              href="/blog"
              onClick={() => setOpen(false)}
              className="flex-1 rounded-lg bg-pink-500 py-2 text-center text-xs font-semibold text-white transition hover:bg-pink-600"
            >
              Read blog →
            </Link>
            <Link
              href="/about"
              onClick={() => setOpen(false)}
              className="flex-1 rounded-lg border border-pink-500/50 py-2 text-center text-xs font-semibold text-pink-400 transition hover:bg-pink-500/10"
            >
              About me
            </Link>
          </div>
        </div>
      )}

      {/* Idle tooltip */}
      {!open && (
        <div className="rounded-lg border border-pink-500/30 bg-[#0a0f1e] px-3 py-1.5 text-xs text-white shadow-lg">
          {TOOLTIPS[tooltipIdx]}
        </div>
      )}

      {/* Animated SVG avatar */}
      <div
        role="button"
        aria-label="Open tech panel"
        tabIndex={0}
        onClick={() => setOpen((o) => !o)}
        onKeyDown={(e) => e.key === 'Enter' && setOpen((o) => !o)}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className="cursor-pointer select-none"
        style={{
          filter: hovered ? 'drop-shadow(0 0 10px rgba(236,72,153,0.55))' : 'none',
          transition: 'filter 0.2s',
        }}
      >
        <svg
          width="52"
          height="58"
          viewBox="0 0 52 58"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          {/* Head */}
          <rect x="14" y="2" width="24" height="22" rx="6" fill="#0a0f1e" stroke="#ec4899" strokeWidth="1.5" />
          {/* </> face text */}
          <text
            x="17"
            y="18"
            fontFamily="'Courier New',Courier,monospace"
            fontSize="9"
            fill="#ec4899"
            fontWeight="bold"
          >
            {'</>'}
          </text>

          {/* Body / laptop */}
          <rect x="10" y="26" width="32" height="14" rx="4" fill="#0f172a" stroke="#ec4899" strokeWidth="1" />
          {/* Code lines */}
          <line x1="14" y1="31" x2="28" y2="31" stroke="#ec4899" strokeWidth="1.2" strokeLinecap="round" opacity="0.8" />
          <line x1="14" y1="35" x2="22" y2="35" stroke="#ec4899" strokeWidth="1.2" strokeLinecap="round" opacity="0.5" />

          {/* Arms */}
          <line x1="10" y1="29" x2="4" y2="36" stroke="#ec4899" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="42" y1="29" x2="48" y2="36" stroke="#ec4899" strokeWidth="1.5" strokeLinecap="round" />
          {/* Tool orbs on hands */}
          <circle cx="4" cy="37" r="3" fill="#ec4899" />
          <circle cx="48" cy="37" r="3" fill="#ec4899" />

          {/* Animated legs */}
          <line
            x1="20"
            y1="40"
            x2={leftX}
            y2="50"
            stroke="#334155"
            strokeWidth="3"
            strokeLinecap="round"
          />
          <line
            x1="32"
            y1="40"
            x2={rightX}
            y2="50"
            stroke="#334155"
            strokeWidth="3"
            strokeLinecap="round"
          />
        </svg>
      </div>
    </div>
  )
}
