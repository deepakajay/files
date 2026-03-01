import { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Sphere, MeshDistortMaterial, Float, Stars, Trail } from '@react-three/drei'
import * as THREE from 'three'

function FloatingOrb({ position, color, speed, distort, scale }) {
  const meshRef = useRef()

  useFrame((state) => {
    if (!meshRef.current) return
    meshRef.current.rotation.x = state.clock.elapsedTime * speed * 0.3
    meshRef.current.rotation.y = state.clock.elapsedTime * speed * 0.5
  })

  return (
    <Float speed={speed} rotationIntensity={0.5} floatIntensity={2}>
      <Sphere ref={meshRef} args={[scale, 64, 64]} position={position}>
        <MeshDistortMaterial
          color={color}
          distort={distort}
          speed={2}
          roughness={0}
          metalness={0.8}
          transparent
          opacity={0.7}
        />
      </Sphere>
    </Float>
  )
}

function ParticleField() {
  const count = 800
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 20
      arr[i * 3 + 1] = (Math.random() - 0.5) * 20
      arr[i * 3 + 2] = (Math.random() - 0.5) * 10
    }
    return arr
  }, [])

  const ref = useRef()
  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y = state.clock.elapsedTime * 0.02
      ref.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.01) * 0.1
    }
  })

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.03}
        color="#a78bfa"
        transparent
        opacity={0.6}
        sizeAttenuation
      />
    </points>
  )
}

function RotatingRing({ radius, color, speed }) {
  const ref = useRef()
  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.x = state.clock.elapsedTime * speed
      ref.current.rotation.z = state.clock.elapsedTime * speed * 0.7
    }
  })
  return (
    <mesh ref={ref}>
      <torusGeometry args={[radius, 0.008, 16, 100]} />
      <meshBasicMaterial color={color} transparent opacity={0.3} />
    </mesh>
  )
}

export default function Scene3D({ isGenerating }) {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none">
      <Canvas
        camera={{ position: [0, 0, 6], fov: 60 }}
        gl={{ alpha: true, antialias: true }}
        style={{ background: 'transparent' }}
      >
        <ambientLight intensity={0.2} />
        <pointLight position={[10, 10, 10]} intensity={1} color="#a78bfa" />
        <pointLight position={[-10, -10, -10]} intensity={0.5} color="#f97316" />

        <Stars radius={100} depth={50} count={3000} factor={3} saturation={0} fade speed={0.5} />
        <ParticleField />

        <FloatingOrb
          position={[-3.5, 1.5, -2]}
          color="#7C3AED"
          speed={0.8}
          distort={0.5}
          scale={1.2}
        />
        <FloatingOrb
          position={[3.5, -1, -3]}
          color="#f97316"
          speed={1.2}
          distort={0.4}
          scale={0.9}
        />
        <FloatingOrb
          position={[0, 2.5, -4]}
          color="#a78bfa"
          speed={0.6}
          distort={0.6}
          scale={0.6}
        />

        <RotatingRing radius={2.5} color="#a78bfa" speed={isGenerating ? 0.8 : 0.2} />
        <RotatingRing radius={3.5} color="#f97316" speed={isGenerating ? -0.6 : -0.1} />
        <RotatingRing radius={1.8} color="#7C3AED" speed={isGenerating ? 1.2 : 0.15} />
      </Canvas>
    </div>
  )
}
