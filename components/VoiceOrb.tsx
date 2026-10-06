"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

type RingConfig = {
  radius: number;
  color: number;
  rotation: [number, number];
  speed: number;
  opacity: number;
};

export default function VoiceOrb() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 1000);
    camera.position.z = 5.2;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);

    scene.add(new THREE.AmbientLight(0x020617, 1.4));
    const cobaltLight = new THREE.PointLight(0x0284c7, 2.2, 22);
    cobaltLight.position.set(4, 3, 4);
    scene.add(cobaltLight);
    const blueLight = new THREE.PointLight(0x1d4ed8, 2.4, 22);
    blueLight.position.set(-4, -2, 4);
    scene.add(blueLight);

    const orbGroup = new THREE.Group();
    scene.add(orbGroup);

    const orb = new THREE.Mesh(
      new THREE.IcosahedronGeometry(1.22, 5),
      new THREE.MeshStandardMaterial({
        color: 0x075985,
        emissive: 0x082f49,
        emissiveIntensity: 1.2,
        roughness: 0.26,
        metalness: 0.42,
        flatShading: true,
        transparent: true,
        opacity: 0.9,
      }),
    );
    orbGroup.add(orb);

    const cage = new THREE.Mesh(
      new THREE.IcosahedronGeometry(1.55, 2),
      new THREE.MeshBasicMaterial({ color: 0x0284c7, wireframe: true, transparent: true, opacity: 0.2 }),
    );
    orbGroup.add(cage);

    const rings: Array<{ mesh: THREE.Mesh; speed: number }> = [];
    const ringConfigs: RingConfig[] = [
      { radius: 1.85, color: 0x0284c7, rotation: [1.1, 0.3], speed: 0.65, opacity: 0.38 },
      { radius: 2.1, color: 0x1d4ed8, rotation: [0.4, 1.2], speed: -0.45, opacity: 0.3 },
      { radius: 2.35, color: 0x3730a3, rotation: [1.7, 0.8], speed: 0.75, opacity: 0.22 },
    ];

    ringConfigs.forEach((config) => {
      const ring = new THREE.Mesh(
        new THREE.TorusGeometry(config.radius, 0.009, 12, 100),
        new THREE.MeshBasicMaterial({ color: config.color, transparent: true, opacity: config.opacity, blending: THREE.AdditiveBlending }),
      );
      ring.rotation.x = config.rotation[0];
      ring.rotation.y = config.rotation[1];
      orbGroup.add(ring);
      rings.push({ mesh: ring, speed: config.speed });
    });

    const particleCount = 260;
    const particlePositions = new Float32Array(particleCount * 3);
    for (let index = 0; index < particleCount; index += 1) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);
      const radius = 1.9 + Math.random() * 1.5;
      particlePositions[index * 3] = radius * Math.sin(phi) * Math.cos(theta);
      particlePositions[index * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      particlePositions[index * 3 + 2] = radius * Math.cos(phi);
    }

    const particleGeometry = new THREE.BufferGeometry();
    particleGeometry.setAttribute("position", new THREE.BufferAttribute(particlePositions, 3));
    const particleMaterial = new THREE.PointsMaterial({ color: 0x60a5fa, size: 0.045, transparent: true, opacity: 0.55, blending: THREE.AdditiveBlending, depthWrite: false });
    const particles = new THREE.Points(particleGeometry, particleMaterial);
    orbGroup.add(particles);

    let animationFrame = 0;
    let elapsed = 0;
    const clock = new THREE.Clock();
    const resize = () => {
      const width = container.clientWidth || window.innerWidth;
      const height = container.clientHeight || window.innerHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height, false);
    };

    const animate = () => {
      animationFrame = window.requestAnimationFrame(animate);
      elapsed = clock.getElapsedTime();
      orb.rotation.y = elapsed * 0.12;
      orb.rotation.x = Math.sin(elapsed * 0.55) * 0.08;
      orb.scale.setScalar(1 + Math.sin(elapsed * 2.2) * 0.045);
      cage.rotation.y = -elapsed * 0.1;
      cage.rotation.x = elapsed * 0.07;
      particles.rotation.y = elapsed * 0.035;
      particles.rotation.x = Math.sin(elapsed * 0.4) * 0.08;
      rings.forEach(({ mesh, speed }, index) => {
        mesh.rotation.z += speed * 0.008;
        mesh.rotation.y += speed * 0.004;
        const ringScale = 1 + 0.02 * Math.sin(elapsed * 2 + index);
        mesh.scale.setScalar(ringScale);
      });
      orbGroup.position.y = Math.sin(elapsed * 1.3) * 0.08;
      renderer.render(scene, camera);
    };

    resize();
    animate();
    window.addEventListener("resize", resize);

    return () => {
      window.removeEventListener("resize", resize);
      window.cancelAnimationFrame(animationFrame);
      particleGeometry.dispose();
      particleMaterial.dispose();
      orb.geometry.dispose();
      (orb.material as THREE.Material).dispose();
      cage.geometry.dispose();
      (cage.material as THREE.Material).dispose();
      rings.forEach(({ mesh }) => {
        mesh.geometry.dispose();
        (mesh.material as THREE.Material).dispose();
      });
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, []);

  return <div ref={containerRef} aria-hidden="true" className="voice-orb" />;
}
