/*
import React, { useRef, useEffect, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Grid } from '@react-three/drei';
import { useNavigate } from 'react-router-dom';
import * as THREE from 'three';
import '../components/Styles/Intropage.css'; 
import '../index.css';

// 3D Spinning Logo
function SpinningLogo() {
  const groupRef = useRef(null);
  useFrame((state, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.5;
    }
  });

  return (
    <group ref={groupRef}>
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="white" />
      </mesh>
      <mesh position={[0.5, 0.5, 0.5]}>
        <boxGeometry args={[0.5, 0.5, 0.5]} />
        <meshStandardMaterial color="white" />
      </mesh>
      <mesh position={[-0.5, -0.5, -0.5]}>
        <boxGeometry args={[0.5, 0.5, 0.5]} />
        <meshStandardMaterial color="white" />
      </mesh>
    </group>
  );
}

// Floating Boxes (Dynamic movement)
function AnimatedBox({ initialPosition }) {
  const meshRef = useRef(null);
  const [targetPosition, setTargetPosition] = useState(new THREE.Vector3(...initialPosition));
  const currentPosition = useRef(new THREE.Vector3(...initialPosition));

  const getAdjacentIntersection = (current) => {
    const directions = [[3, 0], [-3, 0], [0, 3], [0, -3]];
    const randomDirection = directions[Math.floor(Math.random() * directions.length)];
    return new THREE.Vector3(current.x + randomDirection[0], 0.5, current.z + randomDirection[1]);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      const newPosition = getAdjacentIntersection(currentPosition.current);
      newPosition.x = Math.max(-30, Math.min(30, newPosition.x));
      newPosition.z = Math.max(-30, Math.min(30, newPosition.z));
      setTargetPosition(newPosition);
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  useFrame(() => {
    if (meshRef.current) {
      currentPosition.current.lerp(targetPosition, 0.1);
      meshRef.current.position.copy(currentPosition.current);
    }
  });

  return (
    <mesh ref={meshRef} position={initialPosition}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="#82cded" opacity={0.9} transparent />
      <lineSegments>
        <edgesGeometry attach="geometry" args={[new THREE.BoxGeometry(1, 1, 1)]} />
        <lineBasicMaterial attach="material" color="white" linewidth={2} />
      </lineSegments>
    </mesh>
  );
}

// Main Scene with Wide Spread Cubes
function Scene() {
  const initialPositions = [
    [-25, 0.5, -25], [25, 0.5, 25], [-20, 0.5, 15], [20, 0.5, -15], [10, 0.5, -25],
    [-10, 0.5, 25], [-30, 0.5, -10], [30, 0.5, 10], [-15, 0.5, 20], [15, 0.5, -20],
    [-5, 0.5, 5], [5, 0.5, -5], [-22, 0.5, -22], [22, 0.5, 22], [-18, 0.5, 18], [18, 0.5, -18],
    [-12, 0.5, -12], [12, 0.5, 12], [-8, 0.5, 8], [8, 0.5, -8], [0, 0.5, 0]
  ];

  return (
    <>
      <OrbitControls />
      <ambientLight intensity={0.7} />
      <pointLight position={[10, 10, 10]} />
      <Grid 
        infiniteGrid 
        cellSize={1} 
        sectionSize={3} 
        cellThickness={0.4}  
        sectionThickness={0.8}
        sectionColor="white"  
      />
      {initialPositions.map((position, index) => (
        <AnimatedBox key={index} initialPosition={position} />
      ))}
    </>
  );
}

// Intro Page
const Intropage = () => {
  const navigate = useNavigate();

  return (
    <div className="intro-container">
      <Canvas shadows camera={{ position: [40, 40, 40], fov: 50 }} className="canvas-bg">
        <Scene />
      </Canvas>

      <div className="overlay"></div>

      <nav className="intropage-navbar">
        <div className="logo">Next Enti?</div>
        <button className="animated-button" onClick={() => navigate('/Login')}>Log In</button>
      </nav>

      <main className="main-content">
    <h1 className="center-title">
    Personalized career guidance, enhanced by <span className="highlight-text"> AI </span>
    </h1>
    <p className="intro-text">
    Your career journey starts here! 
    <br />
    We simplify career planning with AI-driven insights tailored to your interests, creating a personalized roadmap to help you pursue a career that truly excites you.
    </p>
    <button className="animated-get-button" onClick={() => navigate('/Signup')}>
        Get Started ➝
    </button>
</main>

    </div>
  );
};


export default Intropage;

*/

import React, { useRef, useEffect, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Grid } from '@react-three/drei';
import { useNavigate } from 'react-router-dom';
import * as THREE from 'three';
import '../components/Styles/Intropage.css'; 
import '../index.css';

// 3D Spinning Logo
function SpinningLogo() {
  const groupRef = useRef(null);
  useFrame((state, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.5;
    }
  });

  return (
    <group ref={groupRef}>
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="white" />
      </mesh>
      <mesh position={[0.5, 0.5, 0.5]}>
        <boxGeometry args={[0.5, 0.5, 0.5]} />
        <meshStandardMaterial color="white" />
      </mesh>
      <mesh position={[-0.5, -0.5, -0.5]}>
        <boxGeometry args={[0.5, 0.5, 0.5]} />
        <meshStandardMaterial color="white" />
      </mesh>
    </group>
  );
}

// Floating Boxes (Dynamic movement)
function AnimatedBox({ initialPosition }) {
  const meshRef = useRef(null);
  const [targetPosition, setTargetPosition] = useState(new THREE.Vector3(...initialPosition));
  const currentPosition = useRef(new THREE.Vector3(...initialPosition));

  const getAdjacentIntersection = (current) => {
    const directions = [[3, 0], [-3, 0], [0, 3], [0, -3]];
    const randomDirection = directions[Math.floor(Math.random() * directions.length)];
    return new THREE.Vector3(current.x + randomDirection[0], 0.5, current.z + randomDirection[1]);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      const newPosition = getAdjacentIntersection(currentPosition.current);
      newPosition.x = Math.max(-30, Math.min(30, newPosition.x));
      newPosition.z = Math.max(-30, Math.min(30, newPosition.z));
      setTargetPosition(newPosition);
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  useFrame(() => {
    if (meshRef.current) {
      currentPosition.current.lerp(targetPosition, 0.1);
      meshRef.current.position.copy(currentPosition.current);
    }
  });

  return (
    <mesh ref={meshRef} position={initialPosition}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="#82cded" opacity={0.9} transparent />
      <lineSegments>
        <edgesGeometry attach="geometry" args={[new THREE.BoxGeometry(1, 1, 1)]} />
        <lineBasicMaterial attach="material" color="white" linewidth={2} />
      </lineSegments>
    </mesh>
  );
}

// Main Scene with Floating Cubes
function Scene() {
  const initialPositions = [
    [-25, 0.5, -25], [25, 0.5, 25], [-20, 0.5, 15], [20, 0.5, -15], [10, 0.5, -25],
    [-10, 0.5, 25], [-30, 0.5, -10], [30, 0.5, 10], [-15, 0.5, 20], [15, 0.5, -20],
    [-5, 0.5, 5], [5, 0.5, -5], [-22, 0.5, -22], [22, 0.5, 22], [-18, 0.5, 18], [18, 0.5, -18],
    [-12, 0.5, -12], [12, 0.5, 12], [-8, 0.5, 8], [8, 0.5, -8], [0, 0.5, 0]
  ];

  return (
    <>
      <OrbitControls />
      <ambientLight intensity={0.7} />
      <pointLight position={[10, 10, 10]} />
      <Grid 
        infiniteGrid 
        cellSize={1} 
        sectionSize={3} 
        cellThickness={0.4}
        sectionThickness={0.8}
        sectionColor="white"  
      />
      {initialPositions.map((position, index) => (
        <AnimatedBox key={index} initialPosition={position} />
      ))}
    </>
  );
}

// Intro Page
const Intropage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Hide common navbar when Intropage is loaded
    const commonNavbar = document.getElementById("common-navbar");
    if (commonNavbar) {
      commonNavbar.style.display = "none";
    }

    return () => {
      // Show common navbar again when leaving Intropage
      if (commonNavbar) {
        commonNavbar.style.display = "flex";
      }
    };
  }, []);

  return (
    <div className="intro-container">
      <Canvas shadows camera={{ position: [40, 40, 40], fov: 50 }} className="canvas-bg">
        <Scene />
      </Canvas>

      <div className="overlay"></div>

      {/* Navbar for Intropage */}
      <nav id="intropage-navbar" className="navbar">
        <div className="logo">Next Enti?</div>
        <button className="animated-button" onClick={() => navigate('/Login')}>Log In</button>
      </nav>

      <main className="main-content">
        <h1 className="center-title">
          Personalized career guidance, enhanced by <span className="highlight-text"> AI </span>
        </h1>
        <p className="intro-text">
          Your career journey starts here! 
          <br />
          We simplify career planning with AI-driven insights tailored to your interests, creating a personalized roadmap to help you pursue a career that truly excites you.
        </p>
        <button className="animated-get-button" onClick={() => navigate('/Signup')}>
          Get Started ➝
        </button>
      </main>
    </div>
  );
};

export default Intropage;