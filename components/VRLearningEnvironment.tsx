'use client';

import React, { useRef, useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Play, Pause, RotateCcw, Maximize, Settings, BookOpen, Atom, Dna, Globe } from 'lucide-react';

// Import Three.js dynamically to avoid SSR issues
const VRLearningEnvironment = () => {
  const [isClient, setIsClient] = useState(false);
  const [THREE, setTHREE] = useState<any>(null);
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<any>(null);
  const rendererRef = useRef<any>(null);
  const cameraRef = useRef<any>(null);
  const animationIdRef = useRef<number | null>(null);
  const [isVRActive, setIsVRActive] = useState(false);
  const [currentModel, setCurrentModel] = useState('atom');
  const [isAnimating, setIsAnimating] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  // Available 3D models/concepts
  const concepts = [
    { id: 'atom', name: 'Atomic Structure', icon: Atom, color: '#3B82F6' },
    { id: 'dna', name: 'DNA Structure', icon: Dna, color: '#10B981' },
    { id: 'solar', name: 'Solar System', icon: Globe, color: '#F59E0B' },
    { id: 'molecule', name: 'Water Molecule', icon: BookOpen, color: '#8B5CF6' }
  ];

  useEffect(() => {
    setIsClient(true);
    
    // Dynamically import Three.js
    import('three').then((threeModule) => {
      setTHREE(threeModule);
      setIsLoading(false);
    });
  }, []);

  useEffect(() => {
    if (!isClient || !THREE || !mountRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0a0a0a);
    sceneRef.current = scene;

    // Camera setup
    const camera = new THREE.PerspectiveCamera(75, 800 / 600, 0.1, 1000);
    camera.position.set(0, 0, 5);
    cameraRef.current = camera;

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(800, 600);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    rendererRef.current = renderer;
    mountRef.current.appendChild(renderer.domElement);

    // Initialize scene with lighting and models
    initializeScene(scene, THREE);
    createModel(currentModel, scene, THREE);

    // Animation loop
    const animate = () => {
      animationIdRef.current = requestAnimationFrame(animate);
      
      if (isAnimating) {
        scene.traverse((child: any) => {
          if (child.userData.isModel) {
            child.rotation.y += 0.01;
            child.rotation.x += 0.005;
          }
          if (child.userData.isParticles) {
            child.rotation.y += 0.001;
            child.rotation.x += 0.0005;
          }
        });
      }
      
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
      }
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [isClient, THREE, currentModel, isAnimating]);

  const initializeScene = (scene: any, THREE: any) => {
    // Lighting
    const ambientLight = new THREE.AmbientLight(0x404040, 0.6);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(10, 10, 5);
    directionalLight.castShadow = true;
    scene.add(directionalLight);

    const pointLight = new THREE.PointLight(0x00ff88, 0.5);
    pointLight.position.set(-10, -10, -10);
    scene.add(pointLight);

    // Environment sphere
    const environmentGeometry = new THREE.SphereGeometry(50, 32, 32);
    const environmentMaterial = new THREE.MeshBasicMaterial({
      color: 0x001122,
      side: THREE.BackSide,
      transparent: true,
      opacity: 0.3
    });
    const environmentSphere = new THREE.Mesh(environmentGeometry, environmentMaterial);
    scene.add(environmentSphere);

    // Particles
    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = 1000;
    const positions = new Float32Array(particlesCount * 3);
    
    for (let i = 0; i < particlesCount * 3; i++) {
      positions[i] = (Math.random() - 0.5) * 100;
    }
    
    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const particlesMaterial = new THREE.PointsMaterial({
      color: 0x88ccff,
      size: 0.1,
      transparent: true,
      opacity: 0.6
    });
    const particles = new THREE.Points(particlesGeometry, particlesMaterial);
    particles.userData.isParticles = true;
    scene.add(particles);
  };

  const createModel = (modelType: string, scene: any, THREE: any) => {
    // Clear existing models
    const objectsToRemove: any[] = [];
    scene.traverse((child: any) => {
      if (child.userData.isModel) {
        objectsToRemove.push(child);
      }
    });
    objectsToRemove.forEach(obj => scene.remove(obj));

    switch (modelType) {
      case 'atom':
        createAtomModel(scene, THREE);
        break;
      case 'dna':
        createDNAModel(scene, THREE);
        break;
      case 'solar':
        createSolarSystemModel(scene, THREE);
        break;
      case 'molecule':
        createWaterMoleculeModel(scene, THREE);
        break;
    }
  };

  const createAtomModel = (scene: any, THREE: any) => {
    const atomGroup = new THREE.Group();
    atomGroup.userData.isModel = true;

    // Nucleus
    const nucleusGeometry = new THREE.SphereGeometry(0.5, 16, 16);
    const nucleusMaterial = new THREE.MeshPhongMaterial({ color: 0xff4444 });
    const nucleus = new THREE.Mesh(nucleusGeometry, nucleusMaterial);
    atomGroup.add(nucleus);

    // Electron orbits
    const orbitRadius = [1.5, 2.5, 3.5];
    const electronColors = [0x44ff44, 0x4444ff, 0xffff44];

    orbitRadius.forEach((radius, i) => {
      // Orbit ring
      const orbitGeometry = new THREE.RingGeometry(radius - 0.02, radius + 0.02, 64);
      const orbitMaterial = new THREE.MeshBasicMaterial({ 
        color: electronColors[i], 
        transparent: true, 
        opacity: 0.3 
      });
      const orbit = new THREE.Mesh(orbitGeometry, orbitMaterial);
      orbit.rotation.x = Math.PI / 2;
      orbit.rotation.z = i * 0.5;
      atomGroup.add(orbit);

      // Electron
      const electronGeometry = new THREE.SphereGeometry(0.1, 8, 8);
      const electronMaterial = new THREE.MeshPhongMaterial({ color: electronColors[i] });
      const electron = new THREE.Mesh(electronGeometry, electronMaterial);
      electron.position.set(radius, 0, 0);
      
      const electronPivot = new THREE.Object3D();
      electronPivot.add(electron);
      electronPivot.rotation.x = i * 0.3;
      electronPivot.rotation.y = i * 0.7;
      atomGroup.add(electronPivot);
    });

    scene.add(atomGroup);
  };

  const createDNAModel = (scene: any, THREE: any) => {
    const dnaGroup = new THREE.Group();
    dnaGroup.userData.isModel = true;

    const height = 4;
    const radius = 1;
    const segments = 50;

    for (let i = 0; i < segments; i++) {
      const y = (i / segments) * height - height / 2;
      const angle1 = (i / segments) * Math.PI * 8;
      const angle2 = angle1 + Math.PI;

      // DNA strands
      const x1 = Math.cos(angle1) * radius;
      const z1 = Math.sin(angle1) * radius;
      const sphere1Geometry = new THREE.SphereGeometry(0.1, 8, 8);
      const sphere1Material = new THREE.MeshPhongMaterial({ color: 0x3B82F6 });
      const sphere1 = new THREE.Mesh(sphere1Geometry, sphere1Material);
      sphere1.position.set(x1, y, z1);
      dnaGroup.add(sphere1);

      const x2 = Math.cos(angle2) * radius;
      const z2 = Math.sin(angle2) * radius;
      const sphere2Geometry = new THREE.SphereGeometry(0.1, 8, 8);
      const sphere2Material = new THREE.MeshPhongMaterial({ color: 0x10B981 });
      const sphere2 = new THREE.Mesh(sphere2Geometry, sphere2Material);
      sphere2.position.set(x2, y, z2);
      dnaGroup.add(sphere2);

      // Base pairs
      if (i % 3 === 0) {
        const connectionGeometry = new THREE.CylinderGeometry(0.02, 0.02, Math.sqrt((x2-x1)**2 + (z2-z1)**2));
        const connectionMaterial = new THREE.MeshPhongMaterial({ color: 0xFFFFFF });
        const connection = new THREE.Mesh(connectionGeometry, connectionMaterial);
        connection.position.set((x1+x2)/2, y, (z1+z2)/2);
        connection.lookAt(new THREE.Vector3(x2, y, z2));
        connection.rotateX(Math.PI / 2);
        dnaGroup.add(connection);
      }
    }

    scene.add(dnaGroup);
  };

  const createSolarSystemModel = (scene: any, THREE: any) => {
    const solarGroup = new THREE.Group();
    solarGroup.userData.isModel = true;

    // Sun
    const sunGeometry = new THREE.SphereGeometry(0.5, 16, 16);
    const sunMaterial = new THREE.MeshPhongMaterial({ 
      color: 0xFFA500,
      emissive: 0xFF4500,
      emissiveIntensity: 0.3
    });
    const sun = new THREE.Mesh(sunGeometry, sunMaterial);
    solarGroup.add(sun);

    // Planets
    const planets = [
      { radius: 0.1, distance: 1, color: 0x8C7853 },
      { radius: 0.15, distance: 1.5, color: 0xFFA500 },
      { radius: 0.16, distance: 2, color: 0x6B93D6 },
      { radius: 0.12, distance: 2.5, color: 0xC1440E }
    ];

    planets.forEach((planetData) => {
      const orbitGeometry = new THREE.RingGeometry(planetData.distance - 0.01, planetData.distance + 0.01, 64);
      const orbitMaterial = new THREE.MeshBasicMaterial({ 
        color: 0x444444, 
        transparent: true, 
        opacity: 0.3 
      });
      const orbit = new THREE.Mesh(orbitGeometry, orbitMaterial);
      orbit.rotation.x = Math.PI / 2;
      solarGroup.add(orbit);

      const planetGeometry = new THREE.SphereGeometry(planetData.radius, 12, 12);
      const planetMaterial = new THREE.MeshPhongMaterial({ color: planetData.color });
      const planet = new THREE.Mesh(planetGeometry, planetMaterial);
      planet.position.set(planetData.distance, 0, 0);
      
      const planetPivot = new THREE.Object3D();
      planetPivot.add(planet);
      solarGroup.add(planetPivot);
    });

    scene.add(solarGroup);
  };

  const createWaterMoleculeModel = (scene: any, THREE: any) => {
    const waterGroup = new THREE.Group();
    waterGroup.userData.isModel = true;

    // Oxygen
    const oxygenGeometry = new THREE.SphereGeometry(0.3, 16, 16);
    const oxygenMaterial = new THREE.MeshPhongMaterial({ color: 0xFF0000 });
    const oxygen = new THREE.Mesh(oxygenGeometry, oxygenMaterial);
    waterGroup.add(oxygen);

    // Hydrogens
    const angle = 104.5 * Math.PI / 180;
    const bondLength = 0.8;

    for (let i = 0; i < 2; i++) {
      const hydrogenGeometry = new THREE.SphereGeometry(0.15, 12, 12);
      const hydrogenMaterial = new THREE.MeshPhongMaterial({ color: 0xFFFFFF });
      const hydrogen = new THREE.Mesh(hydrogenGeometry, hydrogenMaterial);
      
      const hydrogenAngle = i === 0 ? angle / 2 : -angle / 2;
      hydrogen.position.set(
        Math.cos(hydrogenAngle) * bondLength,
        Math.sin(hydrogenAngle) * bondLength,
        0
      );
      waterGroup.add(hydrogen);

      // Bonds
      const bondGeometry = new THREE.CylinderGeometry(0.02, 0.02, bondLength);
      const bondMaterial = new THREE.MeshPhongMaterial({ color: 0x888888 });
      const bond = new THREE.Mesh(bondGeometry, bondMaterial);
      bond.position.set(
        Math.cos(hydrogenAngle) * bondLength / 2,
        Math.sin(hydrogenAngle) * bondLength / 2,
        0
      );
      bond.rotation.z = -hydrogenAngle;
      waterGroup.add(bond);
    }

    scene.add(waterGroup);
  };

  if (!isClient || isLoading) {
    return (
      <Card className="bg-white/10 backdrop-blur-lg border-white/20">
        <CardContent className="p-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-white">Loading VR Environment...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      {/* Control Panel */}
      <div className="lg:col-span-1 space-y-4">
        <Card className="bg-white/10 backdrop-blur-lg border-white/20">
          <CardContent className="p-6">
            <h3 className="text-white font-semibold text-lg mb-4 flex items-center">
              <BookOpen className="mr-2" />
              Learning Concepts
            </h3>
            <div className="space-y-3">
              {concepts.map((concept) => {
                const IconComponent = concept.icon;
                return (
                  <button
                    key={concept.id}
                    onClick={() => setCurrentModel(concept.id)}
                    className={`w-full p-3 rounded-lg transition-all duration-200 flex items-center space-x-3 ${
                      currentModel === concept.id
                        ? 'bg-blue-600 text-white shadow-lg'
                        : 'bg-white/5 text-gray-300 hover:bg-white/10'
                    }`}
                  >
                    <IconComponent size={20} style={{ color: concept.color }} />
                    <span className="font-medium">{concept.name}</span>
                  </button>
                );
              })}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/10 backdrop-blur-lg border-white/20">
          <CardContent className="p-6 space-y-3">
            <Button
              onClick={() => setIsVRActive(!isVRActive)}
              className={`w-full ${
                isVRActive
                  ? 'bg-green-600 hover:bg-green-700'
                  : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              <Maximize className="w-4 h-4 mr-2" />
              {isVRActive ? 'Exit VR' : 'Enter VR Mode'}
            </Button>
            
            <Button
              onClick={() => setIsAnimating(!isAnimating)}
              className="w-full bg-purple-600 hover:bg-purple-700"
            >
              {isAnimating ? <Pause className="w-4 h-4 mr-2" /> : <Play className="w-4 h-4 mr-2" />}
              {isAnimating ? 'Pause' : 'Play'} Animation
            </Button>
            
            <Button
              onClick={() => {
                if (cameraRef.current) {
                  cameraRef.current.position.set(0, 0, 5);
                  cameraRef.current.lookAt(0, 0, 0);
                }
              }}
              className="w-full bg-gray-600 hover:bg-gray-700"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Reset View
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* 3D Viewport */}
      <div className="lg:col-span-3">
        <Card className="bg-black border-white/20 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-4">
            <div className="flex items-center justify-between">
              <h3 className="text-white font-semibold text-lg">
                3D Interactive Model: {concepts.find(c => c.id === currentModel)?.name}
              </h3>
              <div className="flex items-center space-x-2">
                {isVRActive && (
                  <Badge className="bg-green-500 text-white animate-pulse">
                    VR Active
                  </Badge>
                )}
                <Settings className="text-white cursor-pointer hover:text-blue-200" size={20} />
              </div>
            </div>
          </div>
          
          <div ref={mountRef} className="relative bg-black" style={{ height: '600px' }} />
          
          <div className="bg-gray-900/90 p-4">
            <div className="text-white text-sm space-y-2">
              <p>
                <strong>Controls:</strong> Mouse to rotate view • Scroll to zoom • Click and drag to interact
              </p>
              <p className="text-blue-300">
                VR Ready - Put on your headset and click "Enter VR Mode" for immersive learning!
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default VRLearningEnvironment;
