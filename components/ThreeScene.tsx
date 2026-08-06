"use client"

import React, { useEffect, useState } from 'react'

export default function ThreeScene({ module }: { module: string }) {
  const [Comp, setComp] = useState<React.ComponentType<any> | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let mounted = true
    import('./ThreeSceneInner')
      .then((m) => {
        if (!mounted) return
        setComp(() => m.default)
      })
      .catch((err) => {
        console.error('Failed to load ThreeSceneInner:', err)
        const msg = String(err?.message || err)
        setError(msg)
      })
    return () => { mounted = false }
  }, [])

  if (error) {
    // Likely caused by incompatible react/react-dom vs @react-three/fiber/@react-three/drei versions
    return (
      <div className="w-full h-full flex flex-col items-center justify-center p-4 text-sm text-center bg-slate-900 rounded">
        <div className="text-red-400 font-semibold mb-2">3D scene failed to load</div>
        <div className="text-slate-300 mb-3">{error}</div>
        <div className="text-slate-400 text-left max-w-xl">
          Common cause: version mismatch between React and @react-three packages. Your workspace currently uses React 18 while @react-three/fiber v9 requires React 19.
          Two ways to fix:
          <ol className="list-decimal list-inside mt-2 mb-2">
            <li>Upgrade React and React DOM to version 19: update package.json and run <code>pnpm install</code>.</li>
            <li>Or install versions of @react-three/fiber and @react-three/drei that are compatible with React 18 (downgrade them to v8 / v9 respectively) and run <code>pnpm install</code>.</li>
          </ol>
          After changing packages, restart your dev server.
        </div>
      </div>
    )
  }

  if (!Comp) {
    return <div className="w-full h-full flex items-center justify-center">Loading 3D...</div>
  }

  return (
    <div className="relative w-[520px] h-[520px] md:w-[640px] md:h-[640px]">
      <Comp module={module} />
    </div>
  )
}
