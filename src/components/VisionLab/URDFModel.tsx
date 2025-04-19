"use client";

import React, { useRef, useState, useEffect } from "react";
import * as THREE from "three";
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import URDFLoader from "urdf-loader";
import { Box3, Vector3 } from "three";
import { Html } from "@react-three/drei";

// Extend THREE to include GLTFLoader
THREE.GLTFLoader = GLTFLoader;

export function URDFModel({ urdfContent = null, position = [0, 0, 0], rotation = [0, 0, 0], scale = 1, ...props }) {
  const modelRef = useRef();
  const [model, setModel] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!urdfContent) return;
    
    setLoading(true);
    setError(null);
    
    try {
      // Create URDF loader directly with THREE
      const loader = new URDFLoader(THREE);
      
      // Configure the loader
      loader.packages = {
        // Map package URLs as needed
        "package://": "/urdf_models/",
      };
      
      // Try to parse the URDF content
      try {
        const result = loader.parse(urdfContent);
        
        // Center the model based on its bounding box
        const box = new Box3().setFromObject(result);
        const center = box.getCenter(new Vector3());
        const size = box.getSize(new Vector3());
        
        // Position the model at the specified position, accounting for its center
        result.position.x = position[0] - center.x;
        result.position.y = position[1] - center.y + size.y / 2;
        result.position.z = position[2] - center.z;
        
        // Apply rotation
        result.rotation.set(rotation[0], rotation[1], rotation[2]);
        
        // Apply scale
        result.scale.multiplyScalar(scale);
        
        setModel(result);
        setLoading(false);
      } catch (parseError) {
        console.error("Error parsing URDF content:", parseError);
        setError("Failed to parse URDF model");
        setLoading(false);
      }
    } catch (err) {
      console.error("Error setting up URDF loader:", err);
      setError("Error initializing URDF loader");
      setLoading(false);
    }
  }, [urdfContent, position, rotation, scale]);

  if (loading) {
    return (
      <group position={position} rotation={rotation}>
        <mesh>
          <boxGeometry args={[0.5, 1, 0.5]} />
          <meshStandardMaterial color="yellow" wireframe />
        </mesh>
        <Html center position={[0, 1.5, 0]}>
          <div className="bg-black bg-opacity-50 text-white px-3 py-1 rounded-lg whitespace-nowrap">
            Loading URDF model...
          </div>
        </Html>
      </group>
    );
  }

  if (error) {
    return (
      <group position={position} rotation={rotation}>
        <mesh>
          <boxGeometry args={[0.5, 1, 0.5]} />
          <meshStandardMaterial color="red" />
        </mesh>
        <Html center position={[0, 1.5, 0]}>
          <div className="bg-black bg-opacity-50 text-white px-3 py-1 rounded-lg whitespace-nowrap">
            Error: {error}
          </div>
        </Html>
      </group>
    );
  }

  if (!model) {
    return null;
  }

  return <primitive ref={modelRef} object={model} {...props} />;
}