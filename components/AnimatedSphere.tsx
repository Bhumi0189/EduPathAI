'use client';

import React, { useRef, useEffect, useState } from 'react';

const AnimatedBackground = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [THREE, setTHREE] = useState<any>(null);
  const [animationId, setAnimationId] = useState<number | null>(null);

  useEffect(() => {
    // Only run on client side
    if (typeof window === 'undefined') return;

    // Dynamically import Three.js to avoid SSR issues
    import('three').then((threeModule) => {
      setTHREE(threeModule);
    }).catch((error) => {
      console.warn('Three.js could not be loaded:', error);
    });
  }, []);

  useEffect(() => {
    if (!THREE || !mountRef.current) return;

    let renderer: any;
    let scene: any;
    let camera: any;
    const spheres: any[] = [];

    try {
      scene = new THREE.Scene();
      camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
      renderer = new THREE.WebGLRenderer({ 
        alpha: true, 
        antialias: true,
        powerPreference: "high-performance"
      });
      
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setClearColor(0x000000, 0);
      renderer.domElement.style.position = 'fixed';
      renderer.domElement.style.top = '0';
      renderer.domElement.style.left = '0';
      renderer.domElement.style.zIndex = '-1';
      renderer.domElement.style.pointerEvents = 'none';
      
      if (mountRef.current) {
        mountRef.current.appendChild(renderer.domElement);
      }

      // Create animated spheres
      const sphereCount = 15;
      const colors = [0x3B82F6, 0x8B5CF6, 0x06B6D4, 0x10B981, 0xF59E0B];

      for (let i = 0; i < sphereCount; i++) {
        const radius = Math.random() * 0.8 + 0.3;
        const segments = Math.random() > 0.5 ? 8 : 16;
        
        const geometry = new THREE.SphereGeometry(radius, segments, segments);
        const material = new THREE.MeshBasicMaterial({
          color: colors[Math.floor(Math.random() * colors.length)],
          transparent: true,
          opacity: Math.random() * 0.4 + 0.2,
          wireframe: Math.random() > 0.6
        });
        
        const sphere = new THREE.Mesh(geometry, material);
        
        sphere.position.set(
          (Math.random() - 0.5) * 60,
          (Math.random() - 0.5) * 60,
          (Math.random() - 0.5) * 60
        );
        
        sphere.userData = {
          velocity: new THREE.Vector3(
            (Math.random() - 0.5) * 0.02,
            (Math.random() - 0.5) * 0.02,
            (Math.random() - 0.5) * 0.02
          ),
          rotationSpeed: {
            x: (Math.random() - 0.5) * 0.02,
            y: (Math.random() - 0.5) * 0.02,
            z: (Math.random() - 0.5) * 0.02
          }
        };
        
        scene.add(sphere);
        spheres.push(sphere);
      }

      camera.position.z = 30;

      // Animation loop
      const animate = () => {
        const id = requestAnimationFrame(animate);
        setAnimationId(id);
        
        spheres.forEach(sphere => {
          sphere.position.add(sphere.userData.velocity);
          sphere.rotation.x += sphere.userData.rotationSpeed.x;
          sphere.rotation.y += sphere.userData.rotationSpeed.y;
          sphere.rotation.z += sphere.userData.rotationSpeed.z;
          
          // Boundary check
          if (Math.abs(sphere.position.x) > 30) {
            sphere.userData.velocity.x *= -0.8;
            sphere.position.x = Math.sign(sphere.position.x) * 30;
          }
          if (Math.abs(sphere.position.y) > 30) {
            sphere.userData.velocity.y *= -0.8;
            sphere.position.y = Math.sign(sphere.position.y) * 30;
          }
          if (Math.abs(sphere.position.z) > 30) {
            sphere.userData.velocity.z *= -0.8;
            sphere.position.z = Math.sign(sphere.position.z) * 30;
          }
        });
        
        renderer.render(scene, camera);
      };

      animate();

      // Handle window resize
      const handleResize = () => {
        if (camera && renderer) {
          camera.aspect = window.innerWidth / window.innerHeight;
          camera.updateProjectionMatrix();
          renderer.setSize(window.innerWidth, window.innerHeight);
        }
      };
      
      window.addEventListener('resize', handleResize);

      // Cleanup function
      return () => {
        window.removeEventListener('resize', handleResize);
        if (animationId) {
          cancelAnimationFrame(animationId);
        }
        if (mountRef.current && renderer?.domElement) {
          mountRef.current.removeChild(renderer.domElement);
        }
        if (renderer) {
          renderer.dispose();
        }
        spheres.forEach(sphere => {
          if (sphere.geometry) sphere.geometry.dispose();
          if (sphere.material) sphere.material.dispose();
        });
      };
    } catch (error) {
      console.warn('Error initializing Three.js scene:', error);
    }
  }, [THREE, animationId]);

  return <div ref={mountRef} className="absolute inset-0 pointer-events-none" />;
};

export default AnimatedBackground;