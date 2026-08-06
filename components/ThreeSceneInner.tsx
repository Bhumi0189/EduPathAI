"use client"

import React, { Suspense, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Environment, ContactShadows, Html } from '@react-three/drei'

function Plant3D() {
  const stemRef = useRef<any>(null)
  const leavesRef = useRef<any>(null)
  useFrame((state) => {
    if (stemRef.current) stemRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.6) * 0.05
    if (leavesRef.current) leavesRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.8) * 0.1
  })
  return (
    <group>
      <mesh position={[0, -0.35, 0]} rotation={[0, 0, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.5, 0.6, 0.4, 24]} />
        <meshStandardMaterial color="#6B4F3C" metalness={0.1} roughness={0.8} />
      </mesh>
      <mesh ref={stemRef} position={[0, -0.05, 0]} castShadow>
        <cylinderGeometry args={[0.05, 0.06, 1.2, 12]} />
        <meshStandardMaterial color="#2F6F3E" metalness={0.05} roughness={0.6} />
      </mesh>
      <group ref={leavesRef} position={[0, 0.4, 0]}>
        {[[ -0.35, 0.2, 0.5 ], [0.35, 0.2, -0.5], [ -0.15, 0.45, -0.2 ]].map((pos, i) => (
          <mesh key={i} position={pos as any} rotation={[0, 0.4 * (i - 1), -0.6 + i * 0.1]} castShadow>
            <boxGeometry args={[0.6, 0.12, 0.3]} />
            <meshStandardMaterial color={["#4CAF50", "#43A047", "#66BB6A"][i]} roughness={0.4} metalness={0.02} />
          </mesh>
        ))}
      </group>
    </group>
  )
}

function Solar3D() {
  const sunRef = useRef<any>(null)
  const planetRefs = useRef<any[]>([])
  useFrame((state) => {
    const t = state.clock.elapsedTime
    if (sunRef.current) sunRef.current.rotation.y = t * 0.1
    planetRefs.current.forEach((p, i) => {
      if (!p) return
      const speed = 0.4 + i * 0.15
      const dist = 0.9 + i * 0.5
      p.position.x = Math.cos(t * speed + i) * dist
      p.position.z = Math.sin(t * speed + i) * dist
      p.rotation.y = t * speed * 0.5
    })
  })
  return (
    <group>
      <mesh ref={sunRef} position={[0, 0, 0]} castShadow>
        <sphereGeometry args={[0.6, 32, 32]} />
        <meshStandardMaterial emissive="#FFB74D" emissiveIntensity={1.2} color="#FFD54F" />
      </mesh>
      {[{ r: 0.12, c: '#7FB3D5' }, { r: 0.18, c: '#4FC3F7' }, { r: 0.14, c: '#F48FB1' }].map((p, i) => (
        <mesh key={i} ref={el => (planetRefs.current[i] = el)} position={[1.2 + i * 0.6, 0, 0]} castShadow>
          <sphereGeometry args={[p.r, 24, 24]} />
          <meshStandardMaterial color={p.c} metalness={0.1} roughness={0.7} />
        </mesh>
      ))}
    </group>
  )
}

function Body3D() {
  const heartRef = useRef<any>(null)
  useFrame((state) => {
    const s = 1 + Math.sin(state.clock.elapsedTime * 3) * 0.08
    if (heartRef.current) heartRef.current.scale.set(s, s, s)
  })
  return (
    <group>
      <mesh position={[0, 0.3, 0]} castShadow>
        <boxGeometry args={[0.9, 1.2, 0.5]} />
        <meshStandardMaterial color="#E0E7FF" roughness={0.5} metalness={0.02} />
      </mesh>
      <mesh position={[0, 1.05, 0]} castShadow>
        <sphereGeometry args={[0.35, 24, 24]} />
        <meshStandardMaterial color="#FDE2D9" roughness={0.6} />
      </mesh>
      <mesh ref={heartRef} position={[0.25, 0.5, 0.22]} castShadow>
        <sphereGeometry args={[0.12, 16, 16]} />
        <meshStandardMaterial color="#E53935" emissive="#FF6F60" emissiveIntensity={0.4} />
      </mesh>
    </group>
  )
}

function Coding3D() {
  const blocksRef = useRef<any[]>([])
  useFrame((state) => {
    const t = state.clock.elapsedTime
    blocksRef.current.forEach((b, i) => {
      if (!b) return
      b.position.y = 0.2 + Math.sin(t * (1 + i * 0.3) + i) * 0.08
      b.rotation.y = t * 0.3 * (i % 2 === 0 ? 1 : -1)
    })
  })
  return (
    <group>
      <mesh position={[0, 0.05, 0]} castShadow>
        <boxGeometry args={[1.2, 0.72, 0.08]} />
        <meshStandardMaterial color="#0F172A" metalness={0.2} roughness={0.3} />
      </mesh>
      <mesh position={[0, -0.22, 0.03]} castShadow>
        <boxGeometry args={[0.6, 0.04, 0.2]} />
        <meshStandardMaterial color="#111827" />
      </mesh>
      {[0, 1, 2, 3].map((i) => (
        <mesh key={i} ref={el => (blocksRef.current[i] = el)} position={[-0.6 + i * 0.4, 0.4, -0.2 + (i % 2) * 0.4]} castShadow>
          <boxGeometry args={[0.22, 0.06, 0.06]} />
          <meshStandardMaterial color={["#60A5FA", "#34D399", "#FDE68A", "#FCA5A5"][i]} emissive={0x111111} />
        </mesh>
      ))}
    </group>
  )
}

export default function ThreeSceneInner({ module }: { module: string }) {
  return (
    <div className="relative w-[520px] h-[520px] md:w-[640px] md:h-[640px]">
      <Canvas shadows camera={{ position: [0, 1.2, 3.2], fov: 50 }}>
        <Suspense fallback={<Html center>Loading 3D...</Html>}>
          <ambientLight intensity={0.6} />
          <directionalLight castShadow position={[5, 10, 5]} intensity={1.2} shadow-mapSize-width={1024} shadow-mapSize-height={1024} />
          <pointLight position={[-10, -10, -10]} intensity={0.3} />
          <ContactShadows rotation-x={Math.PI / 2} position={[0, -0.9, 0]} opacity={0.6} width={4} height={4} blur={2} far={1} />
          <group position={[0, -0.6, 0]}>
            {module === 'plant' && <Plant3D />}
            {module === 'solar' && <Solar3D />}
            {module === 'body' && <Body3D />}
            {module === 'coding' && <Coding3D />}
          </group>
          <Environment preset="city" />
          <OrbitControls enablePan={false} enableDamping dampingFactor={0.07} rotateSpeed={0.6} maxPolarAngle={Math.PI - 0.2} />
        </Suspense>
      </Canvas>
    </div>
  )
}
