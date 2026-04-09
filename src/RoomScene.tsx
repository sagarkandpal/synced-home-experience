/**
 * RoomScene.tsx
 * ─────────────────────────────────────────────────────────────────────────────
 * Hand-coded isometric room that mirrors the reference image perfectly,
 * using @react-three/fiber primitives. No external .glb needed!
 */

import { Suspense, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Environment, ContactShadows, Text } from "@react-three/drei";
import * as THREE from "three";
import { useSmartHome } from "@/context/SmartHomeContext";

// ─── Procedural Isometric Room ───────────────────────────────────────────────

function CodedRoom() {
  const { relays } = useSmartHome();
  const psOn = relays[1]?.status === "on"; // Relay 2 maps to PlayStation / TV

  return (
    <group>
      {/* Floor - Dark Blue carpet */}
      <mesh position={[0, -0.1, 0]} receiveShadow>
        <boxGeometry args={[7, 0.2, 7]} />
        <meshStandardMaterial color="#0f192b" roughness={0.9} />
      </mesh>
      
      {/* Left Wall (Poster side) */}
      <mesh position={[0, 1.8, -3.6]} receiveShadow>
        <boxGeometry args={[7, 4.0, 0.2]} />
        <meshStandardMaterial color="#2d3342" roughness={0.9} />
      </mesh>

      {/* Right Wall (TV side) */}
      <mesh position={[-3.6, 1.8, 0]} receiveShadow>
        <boxGeometry args={[0.2, 4.0, 7]} />
        <meshStandardMaterial color="#2d3342" roughness={0.9} />
      </mesh>

      {/* Wall trim/coving */}
      <mesh position={[-3.5, 3.8, 0]}>
         <boxGeometry args={[0.4, 0.1, 7]} />
         <meshStandardMaterial color="#1a1e2d" />
      </mesh>
      <mesh position={[0, 3.8, -3.5]}>
         <boxGeometry args={[7, 0.1, 0.4]} />
         <meshStandardMaterial color="#1a1e2d" />
      </mesh>

      {/* Poster on Left Wall */}
      <mesh position={[-0.5, 1.8, -3.45]} castShadow>
        <boxGeometry args={[1.5, 2.2, 0.1]} />
        <meshStandardMaterial color="#ff7b54" emissive="#cc4a14" emissiveIntensity={0.2} />
      </mesh>

      {/* TV Stand on Right Wall */}
      <mesh position={[-3.2, 0.25, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.6, 0.5, 3.5]} />
        <meshStandardMaterial color="#35281e" roughness={0.6} />
      </mesh>

      {/* Coffee Table */}
      <mesh position={[-1.2, 0.2, 0.2]} castShadow receiveShadow>
        <boxGeometry args={[1.2, 0.4, 1.8]} />
        <meshStandardMaterial color="#222" roughness={0.3} metalness={0.4} />
      </mesh>
      
      {/* Coffee Table Items - Mug */}
      <mesh position={[-1.2, 0.45, 0.5]} castShadow>
        <cylinderGeometry args={[0.06, 0.06, 0.12, 12]} />
        <meshStandardMaterial color="#fff" />
      </mesh>
      {/* Coffee Table Items - Phone */}
      <mesh position={[-1.0, 0.42, -0.1]} castShadow rotation={[0, 0.3, 0]}>
        <boxGeometry args={[0.1, 0.02, 0.2]} />
        <meshStandardMaterial color="#111" />
      </mesh>

      {/* Sofa Base */}
      <mesh position={[1.0, 0.3, 0.5]} castShadow receiveShadow>
        <boxGeometry args={[1.2, 0.6, 3.2]} />
        <meshStandardMaterial color="#191c26" roughness={0.9} />
      </mesh>
      {/* Sofa Backrest */}
      <mesh position={[1.4, 0.8, 0.5]} castShadow receiveShadow>
        <boxGeometry args={[0.4, 1.0, 3.2]} />
        <meshStandardMaterial color="#191c26" roughness={0.9} />
      </mesh>
      {/* Sofa Armrests */}
      <mesh position={[1.0, 0.6, 2.0]} castShadow receiveShadow>
        <boxGeometry args={[1.2, 0.4, 0.3]} />
        <meshStandardMaterial color="#191c26" roughness={0.9} />
      </mesh>
      <mesh position={[1.0, 0.6, -1.0]} castShadow receiveShadow>
        <boxGeometry args={[1.2, 0.4, 0.3]} />
        <meshStandardMaterial color="#191c26" roughness={0.9} />
      </mesh>

      {/* Floor Lamp at corner */}
      <mesh position={[0.5, 0.05, -2.8]} castShadow>
        <cylinderGeometry args={[0.2, 0.2, 0.1, 16]} />
        <meshStandardMaterial color="#555" />
      </mesh>
      <mesh position={[0.5, 1.0, -2.8]} castShadow>
        <cylinderGeometry args={[0.03, 0.03, 2.0, 8]} />
        <meshStandardMaterial color="#333" />
      </mesh>
      {/* Arch part of the lamp */}
      <mesh position={[0.0, 2.2, -2.8]} rotation={[0, 0, 1.2]} castShadow>
        <cylinderGeometry args={[0.02, 0.02, 1.5, 8]} />
        <meshStandardMaterial color="#333" />
      </mesh>
      {/* Lampshade */}
      <mesh position={[-0.7, 1.9, -2.8]} rotation={[0, 0, 0.5]} castShadow>
         <coneGeometry args={[0.25, 0.3, 16]} />
         <meshStandardMaterial color="#222" metalness={0.8} />
      </mesh>

      {/* Plant Base */}
      <mesh position={[-3.0, 0.2, 2.6]} castShadow>
        <cylinderGeometry args={[0.25, 0.2, 0.5, 12]} />
        <meshStandardMaterial color="#2a1f18" />
      </mesh>
      {/* Plant Leaves */}
      <mesh position={[-3.0, 0.8, 2.6]} castShadow>
        <icosahedronGeometry args={[0.4, 0]} />
        <meshStandardMaterial color="#305938" />
      </mesh>

      {/* Soundbar */}
      <mesh position={[-3.4, 0.55, 0]} castShadow>
        <boxGeometry args={[0.1, 0.1, 2.0]} />
        <meshStandardMaterial color="#111" />
      </mesh>

      {/* Digital Clock */}
      <mesh position={[-3.1, 0.6, -1.2]} rotation={[0, Math.PI/2, 0]} castShadow>
        <boxGeometry args={[0.4, 0.2, 0.1]} />
        <meshStandardMaterial color="#000" emissive="#fff" emissiveIntensity={0.5} />
      </mesh>
      
      {/* Guitar representation */}
      <group position={[-3.2, 0.8, -2.0]} rotation={[0, Math.PI/4, 0.2]}>
        <mesh castShadow>
           <boxGeometry args={[0.1, 0.8, 0.4]} />
           <meshStandardMaterial color="#aa3333" metalness={0.2} roughness={0.4} />
        </mesh>
        <mesh position={[0, 0.7, 0]} castShadow>
           <boxGeometry args={[0.04, 0.8, 0.08]} />
           <meshStandardMaterial color="#3d2a1a" />
        </mesh>
      </group>

      {/* Wall Sconce Lights (Physical bodies) */}
      <mesh position={[-3.48, 2.8, -1.5]}>
         <boxGeometry args={[0.04, 0.3, 0.15]} />
         <meshStandardMaterial color="#ffeeaa" emissive="#ffeeaa" emissiveIntensity={2} />
      </mesh>
      <mesh position={[0, 2.8, -3.48]}>
         <boxGeometry args={[0.15, 0.3, 0.04]} />
         <meshStandardMaterial color="#ffeeaa" emissive="#ffeeaa" emissiveIntensity={2} />
      </mesh>

      {/* PlayStation Neon logo layout */}
      <group position={[-3.2, 0.65, 0.8]} rotation={[0, Math.PI/2, 0]}>
        <mesh position={[0, -0.05, 0]}>
           <boxGeometry args={[0.8, 0.05, 0.1]} />
           <meshStandardMaterial color="#111" />
        </mesh>
        <mesh position={[-0.3, 0.1, 0]} rotation={[Math.PI/2, 0, 0]}>
          <cylinderGeometry args={[0.04, 0.04, 0.02, 3]} />
          <meshStandardMaterial color="#00ff99" emissive="#00ff99" emissiveIntensity={psOn ? 3 : 0} />
        </mesh>
        <mesh position={[-0.1, 0.1, 0]} rotation={[0, 0, 0]}>
          <torusGeometry args={[0.03, 0.015, 8, 16]} />
          <meshStandardMaterial color="#ff3366" emissive="#ff3366" emissiveIntensity={psOn ? 3 : 0} />
        </mesh>
        <group position={[0.1, 0.1, 0]}>
          <mesh rotation={[0, 0, Math.PI/4]}>
             <boxGeometry args={[0.08, 0.015, 0.02]} />
             <meshStandardMaterial color="#3366ff" emissive="#3366ff" emissiveIntensity={psOn ? 3 : 0} />
          </mesh>
          <mesh rotation={[0, 0, -Math.PI/4]}>
             <boxGeometry args={[0.08, 0.015, 0.02]} />
             <meshStandardMaterial color="#3366ff" emissive="#3366ff" emissiveIntensity={psOn ? 3 : 0} />
          </mesh>
        </group>
        <mesh position={[0.3, 0.1, 0]}>
          <boxGeometry args={[0.06, 0.06, 0.02]} />
          <meshStandardMaterial color="#ff00ff" emissive="#ff00ff" emissiveIntensity={psOn ? 3 : 0} />
        </mesh>
      </group>
    </group>
  );
}

// ─── Dynamic Lights ───────────────────────────────────────────────────────────

function SceneLights() {
  const { relays, pirState } = useSmartHome();
  const lampRef = useRef<THREE.PointLight>(null);

  // Map the 4 standard relays to major light channels in the scene
  const ceilingOn = relays[0]?.status === "on";
  const tvOn = relays[1]?.status === "on";
  const psOn = tvOn; // Tie PS neon to TV relay power
  const acOn = relays[2]?.status === "on";
  const lampOn = relays[3]?.status === "on";
  const speakerOn = pirState; // Maps PIR sensor state to speaker pulse

  const ceilingIntensity = ceilingOn ? 6 : 0;
  const lampIntensity = lampOn ? 5 : 0;
  const tvIntensity = tvOn ? 6.0 : 0;

  // Animate lamp flicker on turn-on
  useFrame(({ clock }) => {
    if (lampRef.current) {
      const flicker = lampOn ? 1 + Math.sin(clock.getElapsedTime() * 18) * 0.04 : 1;
      lampRef.current.intensity = lampIntensity * flicker;
    }
  });

  return (
    <>
      <ambientLight intensity={0.2} color="#1a1a2e" />

      {/* Ceiling Sconces (Relay 1) */}
      <pointLight position={[-3.4, 2.8, -1.5]} intensity={ceilingIntensity / 2} color="#ffe8a0" distance={15} decay={1.2} castShadow />
      <pointLight position={[0, 2.8, -3.4]} intensity={ceilingIntensity / 2} color="#ffe8a0" distance={15} decay={1.2} castShadow />

      {/* Floor lamp — warm orange (Relay 4) */}
      <pointLight ref={lampRef} position={[-0.7, 1.8, -2.8]} intensity={lampIntensity} color="#ffb347" distance={10} decay={1.5} />

      {/* TV screen glow (Relay 2) */}
      <pointLight position={[-3.4, 1.4, 0]} intensity={tvIntensity} color="#4fc3f7" distance={8} decay={1.5} />

      {/* AC cool tint (Relay 3) */}
      {acOn && (
        <pointLight position={[-2.8, 2.8, 1.0]} intensity={3.5} color="#80deea" distance={8} decay={1.5} />
      )}

      {/* Speaker RGB pulse (Near Soundbar via PIR) */}
      {speakerOn && (
        <pointLight position={[-3.2, 0.6, 0]} intensity={4.0} color="#ce93d8" distance={6} decay={1.5} />
      )}

      {/* PlayStation glow (Relay 2) */}
      {psOn && (
        <pointLight position={[-3.1, 0.8, 0.8]} intensity={3.0} color="#80cbc4" distance={6} decay={1.5} />
      )}

      {/* Rim light from back — static */}
      <directionalLight position={[-4, 5, 4]} intensity={0.5} color="#b0c4de" />
    </>
  );
}

// ─── TV Screen Plane ──────────────────────────────────────────────────────────

function TVScreen() {
  const { relays } = useSmartHome();
  const tvOn = relays[1]?.status === "on"; // Link to Relay 2
  const screenRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (!screenRef.current) return;
    const mat = screenRef.current.material as THREE.MeshStandardMaterial;
    if (tvOn) {
      // TV static noise shimmer
      mat.emissiveIntensity = 2.0 + Math.sin(clock.getElapsedTime() * 40) * 0.15;
    } else {
      mat.emissiveIntensity = 0;
    }
  });

  return (
    <group position={[-3.4, 1.7, 0]} rotation={[0, Math.PI / 2, 0]}>
      <mesh castShadow>
        <boxGeometry args={[3.2, 1.8, 0.05]} />
        <meshStandardMaterial color="#111" />
      </mesh>
      <mesh ref={screenRef} position={[0, 0, 0.03]}>
        <planeGeometry args={[3.1, 1.7]} />
        <meshStandardMaterial
          color={tvOn ? "#4fc3f7" : "#050810"}
          emissive={tvOn ? "#1a2b36" : "#000000"}
          emissiveIntensity={tvOn ? 2.0 : 0}
          roughness={0.1}
          metalness={0.5}
        />
      </mesh>
      {tvOn && (
        <Text 
          position={[0, 0, 0.04]} 
          fontSize={0.25} 
          color="#ffffff" 
          font="https://fonts.gstatic.com/s/roboto/v30/KFOmCnqEu92Fr1Me5WZLCzYlKw.ttf"
        >
          NO SIGNAL
        </Text>
      )}
    </group>
  );
}

// ─── Canvas Wrapper ───────────────────────────────────────────────────────────

interface RoomSceneProps {
  modelUrl?: string; // Optional now since it's fully procedurally generated
}

export function RoomScene({ modelUrl }: RoomSceneProps) {
  return (
    <Canvas
      shadows
      dpr={[1, 2]}
      camera={{ position: [8, 6.5, 8], fov: 40, near: 0.1, far: 100 }}
      style={{ background: "transparent" }}
    >
      <Suspense fallback={null}>
        <SceneLights />

        <CodedRoom />
        <TVScreen />

        <ContactShadows position={[0, -0.11, 0]} opacity={0.6} scale={12} blur={2.5} far={4} color="#000022" />

        <Environment preset="night" />

        <OrbitControls
           enablePan={false}
           minPolarAngle={Math.PI / 6}
           maxPolarAngle={Math.PI / 2.2}
           minAzimuthAngle={Math.PI / 6}
           maxAzimuthAngle={Math.PI / 2.5}
           minDistance={6}
           maxDistance={15}
           makeDefault
        />
      </Suspense>
    </Canvas>
  );
}
