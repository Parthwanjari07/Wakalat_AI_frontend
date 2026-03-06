'use client'

import dynamic from 'next/dynamic'

const ArchitectureDiagram = dynamic(
  () => import('@/components/ArchitectureDiagram'),
  { ssr: false, loading: () => <div className="flex items-center justify-center h-screen text-lg">Loading architecture diagram...</div> }
)

export default function ArchitecturePage() {
  return <ArchitectureDiagram />
}
