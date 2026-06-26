'use client'

import dynamic from 'next/dynamic'

const TechAvatar = dynamic(() => import('./TechAvatar'), { ssr: false })

export default function TechAvatarLoader() {
  return <TechAvatar />
}
