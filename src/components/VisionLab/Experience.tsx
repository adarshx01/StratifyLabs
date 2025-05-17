"use client";
import { Canvas } from '@react-three/fiber';
import { VRButton, XR, Controllers, Hands, useXR } from '@react-three/xr';
import { CameraControls, Environment, Float, Gltf, Html, Loader, useGLTF } from "@react-three/drei";
import { useAITeacher } from "@/hooks/useAITeacher";
import { Suspense, useEffect, useRef, useState } from "react";
import { degToRad } from "three/src/math/MathUtils";
import { BoardSettings } from "./BoardSettings";
import { MessagesList } from "./MessagesList";
import { Teacher } from "./Teacher";
import { TypingBox } from "./TypingBox";
import { AIAssistant } from "./AIAssistant";
import { Leva, button, useControls } from "leva";
import  SciFiCamera  from '@/components/TestCamera/page';
import { URDFModel } from "./URDFModel";
import { URDFControl, useURDFStore } from "./URDFControl";
import { DetectionConnector } from "./DetectionConnector";

const itemPlacement = {
  default: {
    classroom: {
      position: [0.2, -1.7, -2],
      scale: 0.02,
    },
    teacher: {
      position: [-1, -1.6, -3]
    },
    urdfModel: {
      position: [-1, -0.5, -3],
      rotation: [degToRad(-90), degToRad(0), degToRad(-75)], 
      scale: 1.5,
    },
    board: {
      position: [0.2, 0.382, -6.5],
    },
    aiAssistant: {
      position: [3, 0.7, -1],
      rotation: [0, -Math.PI / 2.5, 0],
    },
    scifiCamera: {
      position: [-7, 1, 0],
      rotation: [0, Math.PI / 2.2,0],
      scale: 3,
    }
  },
  alternative: {
    classroom: {
      position: [3, -1.7, -2.4],
      rotation: [0, degToRad(0), 0],
      scale: 1.3,
    },
    teacher: { position: [-0.4, -1.6, -3] },
    board: { position: [-6, 0.84, -2], rotation: [0, Math.PI / 2, 0] },
    aiAssistant: {
      position: [2, 0.7, -7],
      rotation: [0, -Math.PI / 4, 0],
    },
    scifiCamera: {
      position: [2, 0.3, -1.1],
      rotation: [0, -Math.PI / 4.23,0],
    },
    urdfModel: {
      position: [-0.4, -1.6, -3], // Exactly same as teacher position
      rotation: [0, degToRad(20), 0], // Same rotation as teacher
      scale: 1.5, // Match teacher scale
    }
  }
};

// VR-enabled Scene component
const VRScene = () => {
  const teacher = useAITeacher((state) => state.teacher);
  const classroom = useAITeacher((state) => state.classroom);
  const { isPresenting } = useXR();
  
  const urdfContent = useURDFStore((state) => state.urdfContent);
  const showModel = useURDFStore((state) => state.showModel);

  return (
    <Float speed={0.5} floatIntensity={0.2} rotationIntensity={0.1}>
      <Html
        transform
        {...itemPlacement[classroom].board}
        distanceFactor={1}
      >
        <MessagesList />
        <BoardSettings />
      </Html>
      <Html
        transform
        {...itemPlacement[classroom].aiAssistant}
        distanceFactor={1}
      >
        <AIAssistant />
      </Html>
      <Html
        transform
        {...itemPlacement[classroom].scifiCamera}
        distanceFactor={1}
      >
        <SciFiCamera />
      </Html>
      
      {/* Add the DetectionConnector */}
      <DetectionConnector />
      
      <Environment preset="sunset" />
      <ambientLight intensity={1} color="pink" />

      <Gltf
        src={`/models/scifi_room_${classroom}.glb`}
        {...itemPlacement[classroom].classroom}
      />
      
      {/* Conditionally render either the Teacher or the URDF model */}
      {showModel ? (
        <URDFModel 
          urdfContent={urdfContent} 
          {...itemPlacement[classroom].urdfModel} 
          scale={2.5}
        />
      ) : (
        <Teacher
          teacher={teacher}
          key={teacher}
          {...itemPlacement[classroom].teacher}
          scale={1.5}
          rotation-y={degToRad(20)}
        />
      )}
      
      {/* VR-specific components */}
      {isPresenting && (
        <>
          <Controllers rayMaterial={{ color: "blue" }} />
          <Hands />
          <mesh 
            rotation-x={-Math.PI / 2}
            position-y={-1.7}
            receiveShadow
          >
            <planeGeometry args={[100, 100]} />
            <meshStandardMaterial transparent opacity={0} />
          </mesh>
        </>
      )}
    </Float>
  );
};

// Camera management component
const CameraManager = () => {
  const controls = useRef();
  const loading = useAITeacher((state) => state.loading);
  const currentMessage = useAITeacher((state) => state.currentMessage);
  const { isPresenting } = useXR();

  useEffect(() => {
    if (!isPresenting) {
      if (loading) {
        controls.current?.setPosition(...CAMERA_POSITIONS.loading, true);
        controls.current?.zoomTo(CAMERA_ZOOMS.loading, true);
      } else if (currentMessage) {
        controls.current?.setPosition(...CAMERA_POSITIONS.speaking, true);
        controls.current?.zoomTo(CAMERA_ZOOMS.speaking, true);
      }
    }
  }, [loading, currentMessage, isPresenting]);

  useControls("Helper", {
    getCameraPosition: button(() => {
      const position = controls.current.getPosition();
      const zoom = controls.current.camera.zoom;
      console.log([...position], zoom);
    }),
  });

  if (isPresenting) return null;

  return (
    <CameraControls
      ref={controls}
      minZoom={1}
      maxZoom={3}
      polarRotateSpeed={-0.3}
      azimuthRotateSpeed={-0.3}
      mouseButtons={{
        left: 1,
        wheel: 16,
      }}
      touches={{
        one: 32,
        two: 512,
      }}
    />
  );
};

const CAMERA_POSITIONS = {
  default: [0, 6.123233995736766e-21, 0.0001],
  loading: [0.00002621880610890309, 0.00000515037441056466, 0.00009636414192870058],
  speaking: [0, -1.6481333940859815e-7, 0.00009999846226827279],
};

const CAMERA_ZOOMS = {
  default: 1,
  loading: 1.3,
  speaking: 2.1204819420055387,
};

// Main VR Experience component
export const VRExperience = () => {
  return (
    <>
      <VRButton className="fixed bottom-4 right-4 z-50" />
      <div className="z-10 md:justify-center fixed bottom-4 left-4 right-4 flex gap-3 flex-wrap justify-stretch">
        <TypingBox />
        <URDFControl />
      </div>
      <Leva hidden />
      <Loader />
      
      <Canvas
        camera={{
          position: [0, 0, 0.0001],
          fov: 75,
        }}
      >
        <XR>
          <Suspense>
            <VRScene />
            <CameraManager />
          </Suspense>
        </XR>
      </Canvas>
    </>
  );
};

useGLTF.preload("/models/classroom_default.glb");
useGLTF.preload("/models/classroom_alternative.glb");

export default VRExperience;