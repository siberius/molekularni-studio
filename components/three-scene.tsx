'use client';

/**
 * Izolovaná Three.js scéna pouze pro klientský rendering
 * Používá čistý Three.js pro maximální kompatibilitu
 * Obsahuje všechny Three.js komponenty v jedné izolované komponentě
 */

import { useEffect, useRef, useCallback } from 'react';
import * as THREE from 'three';
import { Molecule, Atom, Bond } from '@/lib/types';
import { getElementStyle, BOND_CONSTANTS } from '@/lib/constants';

/**
 * Props pro ThreeScene komponentu
 */
interface ThreeSceneProps {
  molecule: Molecule;
}

/**
 * Výpočet parametrů pro vykreslení vazby mezi atomy
 * Vrací pozici, rotaci a délku válce reprezentujícího vazbu
 */
function calculateBondParams(start: THREE.Vector3, end: THREE.Vector3) {
  // Střed vazby
  const position = new THREE.Vector3().addVectors(start, end).multiplyScalar(0.5);
  // Délka vazby
  const length = start.distanceTo(end);
  // Směr vazby
  const direction = new THREE.Vector3().subVectors(end, start).normalize();
  // Výchozí směr válce (nahoru)
  const defaultDirection = new THREE.Vector3(0, 1, 0);
  // Kvaterion pro rotaci válce do směru vazby
  const quaternion = new THREE.Quaternion().setFromUnitVectors(defaultDirection, direction);
  
  // Výpočet kolmého vektoru pro dvojné/trojné vazby
  const perpendicular = new THREE.Vector3(1, 0, 0);
  if (Math.abs(direction.dot(perpendicular)) > 0.9) {
    perpendicular.set(0, 1, 0);
  }
  const offset = new THREE.Vector3().crossVectors(direction, perpendicular).normalize();
  
  return { position, quaternion, length, offset };
}

/**
 * Vytvoření mesh pro atom (koule)
 * Používá CPK barevné schéma pro různé prvky
 */
function createAtomMesh(element: string, position: [number, number, number]): THREE.Mesh {
  const style = getElementStyle(element);
  
  // Geometrie koule pro atom
  const geometry = new THREE.SphereGeometry(style.radius * 0.5, 32, 32);
  
  // Materiál s emisí pro světelný efekt
  const material = new THREE.MeshStandardMaterial({
    color: new THREE.Color(style.color),
    emissive: new THREE.Color(style.color),
    emissiveIntensity: 0.2,
    roughness: 0.3,
    metalness: 0.2,
  });
  
  const mesh = new THREE.Mesh(geometry, material);
  mesh.position.set(position[0], position[1], position[2]);
  
  return mesh;
}

/**
 * Vytvoření mesh pro jednoduchou vazbu (válec)
 */
function createSingleBond(
  position: THREE.Vector3,
  quaternion: THREE.Quaternion,
  length: number,
  radius: number
): THREE.Mesh {
  const geometry = new THREE.CylinderGeometry(radius, radius, length, 8);
  const material = new THREE.MeshStandardMaterial({
    color: new THREE.Color(BOND_CONSTANTS.COLOR),
    roughness: 0.5,
  });
  
  const mesh = new THREE.Mesh(geometry, material);
  mesh.position.copy(position);
  mesh.quaternion.copy(quaternion);
  
  return mesh;
}

/**
 * Vytvoření mesh pro vazbu mezi dvěma atomy
 * Podporuje jednoduché, dvojné a trojné vazby
 */
function createBondMesh(from: Atom, to: Atom, order: number): THREE.Group {
  const group = new THREE.Group();
  
  const start = new THREE.Vector3(from.x, from.y, from.z);
  const end = new THREE.Vector3(to.x, to.y, to.z);
  const { position, quaternion, length, offset } = calculateBondParams(start, end);
  
  const { SINGLE_RADIUS, DOUBLE_SPACING, TRIPLE_SPACING } = BOND_CONSTANTS;
  
  if (order === 1) {
    // Jednoduchá vazba
    const bond = createSingleBond(position, quaternion, length, SINGLE_RADIUS);
    group.add(bond);
  } else if (order === 2) {
    // Dvojná vazba - dva válce vedle sebe
    const offset1 = offset.clone().multiplyScalar(DOUBLE_SPACING / 2);
    const offset2 = offset.clone().multiplyScalar(-DOUBLE_SPACING / 2);
    
    const bond1 = createSingleBond(
      position.clone().add(offset1),
      quaternion,
      length,
      SINGLE_RADIUS * 0.7
    );
    const bond2 = createSingleBond(
      position.clone().add(offset2),
      quaternion,
      length,
      SINGLE_RADIUS * 0.7
    );
    
    group.add(bond1);
    group.add(bond2);
  } else {
    // Trojná vazba - tři válce
    const offsetT1 = offset.clone().multiplyScalar(TRIPLE_SPACING);
    const offsetT2 = offset.clone().multiplyScalar(-TRIPLE_SPACING);
    
    const bondCenter = createSingleBond(position, quaternion, length, SINGLE_RADIUS * 0.6);
    const bondLeft = createSingleBond(
      position.clone().add(offsetT1),
      quaternion,
      length,
      SINGLE_RADIUS * 0.6
    );
    const bondRight = createSingleBond(
      position.clone().add(offsetT2),
      quaternion,
      length,
      SINGLE_RADIUS * 0.6
    );
    
    group.add(bondCenter);
    group.add(bondLeft);
    group.add(bondRight);
  }
  
  return group;
}

/**
 * Vytvoření hvězdného pozadí
 * Přidává atmosféru vesmíru do scény
 */
function createStars(): THREE.Points {
  const starsGeometry = new THREE.BufferGeometry();
  const starsCount = 3000;
  const positions = new Float32Array(starsCount * 3);
  
  for (let i = 0; i < starsCount * 3; i += 3) {
    // Náhodná pozice v kouli
    const radius = 50 + Math.random() * 50;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    
    positions[i] = radius * Math.sin(phi) * Math.cos(theta);
    positions[i + 1] = radius * Math.sin(phi) * Math.sin(theta);
    positions[i + 2] = radius * Math.cos(phi);
  }
  
  starsGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  
  const starsMaterial = new THREE.PointsMaterial({
    color: 0xffffff,
    size: 0.5,
    transparent: true,
    opacity: 0.8,
  });
  
  return new THREE.Points(starsGeometry, starsMaterial);
}

/**
 * Hlavní Three.js scéna komponenta
 * Vykresluje 3D molekulu s interaktivním ovládáním
 */
export default function ThreeScene({ molecule }: ThreeSceneProps) {
  // Reference na DOM kontejner a Three.js objekty
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const moleculeGroupRef = useRef<THREE.Group | null>(null);
  const animationFrameRef = useRef<number>(0);
  
  // Stav pro ovládání myší
  const isDragging = useRef(false);
  const previousMousePosition = useRef({ x: 0, y: 0 });
  const rotationSpeed = useRef({ x: 0.005, y: 0.005 }); // Automatická rotace

  /**
   * Aktualizace molekuly ve scéně
   * Odstraní starou molekulu a vytvoří novou
   */
  const updateMolecule = useCallback((mol: Molecule) => {
    if (!sceneRef.current || !moleculeGroupRef.current) return;
    
    // Odstranění staré molekuly
    while (moleculeGroupRef.current.children.length > 0) {
      const child = moleculeGroupRef.current.children[0];
      moleculeGroupRef.current.remove(child);
      if (child instanceof THREE.Mesh) {
        child.geometry.dispose();
        if (child.material instanceof THREE.Material) {
          child.material.dispose();
        }
      }
    }
    
    const atoms: Atom[] = mol?.atoms ?? [];
    const bonds: Bond[] = mol?.bonds ?? [];
    
    // Vytvoření atomů
    atoms.forEach((atom: Atom) => {
      if (atom) {
        const atomMesh = createAtomMesh(
          atom.element ?? 'C',
          [atom.x ?? 0, atom.y ?? 0, atom.z ?? 0]
        );
        moleculeGroupRef.current!.add(atomMesh);
      }
    });
    
    // Vytvoření vazeb
    bonds.forEach((bond: Bond) => {
      const fromAtom = atoms[bond?.atom1];
      const toAtom = atoms[bond?.atom2];
      if (fromAtom && toAtom) {
        const bondGroup = createBondMesh(fromAtom, toAtom, bond?.order ?? 1);
        moleculeGroupRef.current!.add(bondGroup);
      }
    });
  }, []);

  /**
   * Inicializace Three.js scény
   */
  useEffect(() => {
    if (!containerRef.current) return;
    
    const container = containerRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight;
    
    // Vytvoření scény
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    
    // Vytvoření kamery
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(8, 5, 8);
    camera.lookAt(0, 0, 0);
    cameraRef.current = camera;
    
    // Vytvoření rendereru
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;
    
    // Přidání hvězd
    const stars = createStars();
    scene.add(stars);
    
    // Přidání osvětlení
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    scene.add(ambientLight);
    
    const directionalLight1 = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight1.position.set(10, 10, 5);
    scene.add(directionalLight1);
    
    const directionalLight2 = new THREE.DirectionalLight(0xffffff, 0.3);
    directionalLight2.position.set(-10, -10, -5);
    scene.add(directionalLight2);
    
    const pointLight = new THREE.PointLight(0x8b5cf6, 0.5);
    pointLight.position.set(0, 5, 0);
    scene.add(pointLight);
    
    // Vytvoření skupiny pro molekulu
    const moleculeGroup = new THREE.Group();
    scene.add(moleculeGroup);
    moleculeGroupRef.current = moleculeGroup;
    
    // Animační smyčka
    const animate = () => {
      animationFrameRef.current = requestAnimationFrame(animate);
      
      // Automatická rotace molekuly
      if (moleculeGroupRef.current && !isDragging.current) {
        moleculeGroupRef.current.rotation.y += rotationSpeed.current.y;
      }
      
      // Pomalá rotace hvězd
      if (stars) {
        stars.rotation.y += 0.0001;
      }
      
      renderer.render(scene, camera);
    };
    animate();
    
    // Event handlery pro ovládání myší
    const handleMouseDown = (e: MouseEvent) => {
      isDragging.current = true;
      previousMousePosition.current = { x: e.clientX, y: e.clientY };
    };
    
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging.current || !moleculeGroupRef.current) return;
      
      const deltaX = e.clientX - previousMousePosition.current.x;
      const deltaY = e.clientY - previousMousePosition.current.y;
      
      moleculeGroupRef.current.rotation.y += deltaX * 0.01;
      moleculeGroupRef.current.rotation.x += deltaY * 0.01;
      
      previousMousePosition.current = { x: e.clientX, y: e.clientY };
    };
    
    const handleMouseUp = () => {
      isDragging.current = false;
    };
    
    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      if (!cameraRef.current) return;
      
      const zoomSpeed = 0.5;
      const direction = e.deltaY > 0 ? 1 : -1;
      const newZ = cameraRef.current.position.z + direction * zoomSpeed;
      
      // Omezení zoomu
      if (newZ > 3 && newZ < 30) {
        cameraRef.current.position.z = newZ;
        cameraRef.current.position.x = newZ;
        cameraRef.current.position.y = newZ * 0.6;
      }
    };
    
    // Reakce na změnu velikosti okna
    const handleResize = () => {
      if (!containerRef.current || !cameraRef.current || !rendererRef.current) return;
      
      const newWidth = containerRef.current.clientWidth;
      const newHeight = containerRef.current.clientHeight;
      
      cameraRef.current.aspect = newWidth / newHeight;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(newWidth, newHeight);
    };
    
    // Registrace event listenerů
    renderer.domElement.addEventListener('mousedown', handleMouseDown);
    renderer.domElement.addEventListener('mousemove', handleMouseMove);
    renderer.domElement.addEventListener('mouseup', handleMouseUp);
    renderer.domElement.addEventListener('mouseleave', handleMouseUp);
    renderer.domElement.addEventListener('wheel', handleWheel, { passive: false });
    window.addEventListener('resize', handleResize);
    
    // Cleanup funkce
    return () => {
      cancelAnimationFrame(animationFrameRef.current);
      
      renderer.domElement.removeEventListener('mousedown', handleMouseDown);
      renderer.domElement.removeEventListener('mousemove', handleMouseMove);
      renderer.domElement.removeEventListener('mouseup', handleMouseUp);
      renderer.domElement.removeEventListener('mouseleave', handleMouseUp);
      renderer.domElement.removeEventListener('wheel', handleWheel);
      window.removeEventListener('resize', handleResize);
      
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      
      renderer.dispose();
    };
  }, []);
  
  /**
   * Aktualizace molekuly při změně props
   */
  useEffect(() => {
    if (molecule) {
      updateMolecule(molecule);
    }
  }, [molecule, updateMolecule]);
  
  return (
    <div
      ref={containerRef}
      className="w-full h-full"
      style={{ touchAction: 'none' }}
    />
  );
}
