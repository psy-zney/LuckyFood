import React, { useRef, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei/native';
import * as THREE from 'three';

// Preload the model so it doesn't stutter when the Canvas mounts
useGLTF.preload(require('../assets/models/dice.glb'));

type Props = {
  rollTrigger: number;
  onComplete: () => void;
};

export default function DiceModel({ rollTrigger, onComplete }: Props) {
  const { scene } = useGLTF(require('../assets/models/dice.glb')) as any;
  const meshRef = useRef<THREE.Group>(null);
  
  const [targets, setTargets] = useState<THREE.Euler[]>([]);
  const [phase, setPhase] = useState(3); // start idle
  const [startTime, setStartTime] = useState(0);
  const completedRef = useRef(false);

  // Standard dice face rotations – each lands a different face upward
  const FACE_ROTATIONS: THREE.Euler[] = [
    new THREE.Euler(0, 0, 0),
    new THREE.Euler(Math.PI / 2, 0, 0),
    new THREE.Euler(0, 0, -Math.PI / 2),
    new THREE.Euler(0, 0, Math.PI / 2),
    new THREE.Euler(-Math.PI / 2, 0, 0),
    new THREE.Euler(Math.PI, 0, 0),
  ];

  useEffect(() => {
    if (rollTrigger <= 0) return;
    completedRef.current = false;

    const addSpins = (base: THREE.Euler, spins: number): THREE.Euler => {
      const rad = Math.PI * 2 * spins;
      const dir = Math.random() > 0.5 ? 1 : -1;
      return new THREE.Euler(
        base.x + dir * rad + (Math.random() - 0.5) * Math.PI,
        base.y + dir * rad + (Math.random() - 0.5) * Math.PI,
        base.z + dir * rad + (Math.random() - 0.5) * Math.PI,
      );
    };

    const finalFace = FACE_ROTATIONS[Math.floor(Math.random() * 6)];
    const cur = meshRef.current?.rotation ?? new THREE.Euler(0, 0, 0);
    const base = new THREE.Euler(cur.x, cur.y, cur.z);
    const t1 = addSpins(base, 3);
    const t2 = addSpins(t1, 3);
    // Last spin phase ends approaching the final face
    const t3 = new THREE.Euler(
      finalFace.x + Math.PI * 4 * (Math.random() > 0.5 ? 1 : -1),
      finalFace.y + Math.PI * 4 * (Math.random() > 0.5 ? 1 : -1),
      finalFace.z,
    );

    setTargets([t1, t2, t3, finalFace]);
    setPhase(0);
    setStartTime(performance.now() / 1000);
  }, [rollTrigger]);

  useFrame((_, delta) => {
    if (!meshRef.current || targets.length < 4 || phase === 3) return;

    const elapsed = (performance.now() / 1000) - startTime;
    const SPIN_PER_PHASE = 2.0; // 2s × 3 phases = 6s total spin
    const HOLD = 1.5;           // 1.5s hold still → user reads face
    const TOTAL_SPIN = SPIN_PER_PHASE * 3;

    if (elapsed < TOTAL_SPIN) {
      const phaseIdx = Math.min(Math.floor(elapsed / SPIN_PER_PHASE), 2);
      const target = targets[phaseIdx];
      const phaseElapsed = elapsed - phaseIdx * SPIN_PER_PHASE;
      // Fast tumble for first 1.2s, then fast snap to target in last 0.8s
      const speed = phaseElapsed < 1.2 ? 5 : 18;
      meshRef.current.rotation.x = THREE.MathUtils.lerp(meshRef.current.rotation.x, target.x, speed * delta);
      meshRef.current.rotation.y = THREE.MathUtils.lerp(meshRef.current.rotation.y, target.y, speed * delta);
      meshRef.current.rotation.z = THREE.MathUtils.lerp(meshRef.current.rotation.z, target.z, speed * delta);
    } else if (elapsed < TOTAL_SPIN + HOLD) {
      // Snap to exact clean face and hold
      const face = targets[3];
      meshRef.current.rotation.x = THREE.MathUtils.lerp(meshRef.current.rotation.x, face.x, 24 * delta);
      meshRef.current.rotation.y = THREE.MathUtils.lerp(meshRef.current.rotation.y, face.y, 24 * delta);
      meshRef.current.rotation.z = THREE.MathUtils.lerp(meshRef.current.rotation.z, face.z, 24 * delta);
    } else {
      if (!completedRef.current) {
        completedRef.current = true;
        setPhase(3);
        onComplete();
      }
    }
  });

  return (
    <group ref={meshRef}>
      {/* scale=1.2 fits a standard dice.glb inside a 260×260 canvas at fov=50 */}
      <primitive object={scene} scale={1.2} />
    </group>
  );
}
