'use client';

import { Suspense, useState, useEffect, Component, ReactNode } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { OrbitControls, Stage, useGLTF, Html, useProgress, Grid } from '@react-three/drei';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader';
import { useLoader } from '@react-three/fiber';
import * as THREE from 'three';
import gsap from 'gsap';
import { Box, Play, Pause, LayoutGrid, RotateCw } from 'lucide-react'; // RotateCw added

// --- Error Boundary ---
class ErrorBoundary extends Component<{ children: ReactNode }, { hasError: boolean }> {
    constructor(props: { children: ReactNode }) {
        super(props);
        this.state = { hasError: false };
    }
    static getDerivedStateFromError(_: Error) { return { hasError: true }; }
    componentDidCatch(error: Error, errorInfo: any) { console.error("3D Viewer Error:", error, errorInfo); }
    render() {
        if (this.state.hasError) {
            return (
                <div className="flex flex-col items-center justify-center h-full bg-[#0a0f1a] text-zinc-400 p-6 text-center border border-white/5 rounded-xl">
                    <Box size={40} className="mb-4 text-red-500 opacity-50" />
                    <p className="text-sm font-bold text-white mb-1">Model Loading Failed</p>
                    <p className="text-xs">The 3D asset might be corrupted or CORS policy is blocking it.</p>
                </div>
            );
        }
        return this.props.children;
    }
}

// --- Pro Loader UI ---
function Loader() {
    const { progress } = useProgress();
    return (
        <Html center>
            <div className="flex flex-col items-center justify-center w-48 p-4 bg-black/80 backdrop-blur-md rounded-xl border border-white/10 shadow-2xl">
                <div className="w-8 h-8 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin mb-3"></div>
                <div className="text-xs font-mono text-blue-400 mb-2">LOADING ASSET</div>
                <div className="w-full bg-zinc-800 rounded-full h-1.5 overflow-hidden">
                    <div className="bg-blue-500 h-1.5 transition-all duration-300" style={{ width: `${progress}%` }}></div>
                </div>
                <div className="text-[10px] text-zinc-500 mt-1">{progress.toFixed(0)}%</div>
            </div>
        </Html>
    );
}

// --- Model Loader & Wireframe Logic ---
function Model({ url, type, wireframe, rotationOffset }: { url: string; type: string; wireframe: boolean, rotationOffset: [number, number, number] }) {
    let object: THREE.Object3D | null = null;

    if (type === 'gltf' || type === 'glb') {
        const { scene } = useGLTF(url);
        object = scene;
    } else if (type === 'fbx') {
        object = useLoader(FBXLoader, url);
    } else if (type === 'obj') {
        object = useLoader(OBJLoader, url);
    }

    // Apply wireframe recursively to all meshes
    useEffect(() => {
        if (object) {
            object.traverse((child) => {
                if (child instanceof THREE.Mesh) {
                    if (child.material) {
                        if (!child.userData.originalMaterial) {
                            child.userData.originalMaterial = child.material.clone();
                        }
                        
                        if (wireframe) {
                            child.material = new THREE.MeshBasicMaterial({ 
                                color: 0x3b82f6, 
                                wireframe: true,
                                transparent: true,
                                opacity: 0.8
                            });
                        } else {
                            child.material = child.userData.originalMaterial;
                        }
                    }
                }
            });
        }
    }, [object, wireframe]);

    // Group ke andar rotation apply kiya hai taaki model ground par seedha khada ho
    return object ? (
        <group rotation={rotationOffset}>
            <primitive object={object} />
        </group>
    ) : null;
}

// --- Camera Controller for View Buttons ---
function CameraController({ targetPosition }: { targetPosition: [number, number, number] | null }) {
    const { camera, controls } = useThree();
    
    useEffect(() => {
        if (targetPosition && controls) {
            gsap.to(camera.position, {
                x: targetPosition[0],
                y: targetPosition[1],
                z: targetPosition[2],
                duration: 1.5,
                ease: "power3.inOut",
                onUpdate: () => {
                    // @ts-ignore
                    controls.update(); 
                }
            });
        }
    }, [targetPosition, camera, controls]);

    return null;
}

// --- MAIN VIEWER COMPONENT ---
interface ThreeDViewerProps {
    modelUrl: string;
    modelType?: string;
    className?: string;
}

export default function ThreeDViewer({ modelUrl, modelType, className = "h-[500px] w-full" }: ThreeDViewerProps) {
    const [mounted, setMounted] = useState(false);
    
    // UI States
    const [autoRotate, setAutoRotate] = useState(true);
    const [wireframe, setWireframe] = useState(false);
    const [cameraTarget, setCameraTarget] = useState<[number, number, number] | null>(null);
    
    // Axis Fix State (0 degrees, -90 degrees, 90 degrees, 180 degrees)
    // FIX: Set initial state to 1 (which applies the -90 degree rotation commonly needed for BIM/Revit exports)
    const [axisRotationIndex, setAxisRotationIndex] = useState(1); 
    const rotations: [number, number, number][] = [
        [0, 0, 0],                            // Default
        [-Math.PI / 2, 0, 0],                 // Fix Z-up to Y-up (Most common for Revit/BIM)
        [Math.PI / 2, 0, 0],                  // Reverse flip
        [Math.PI, 0, 0]                       // Upside down
    ];

    useEffect(() => {
        setMounted(true);
    }, []);

    const urlType = modelUrl.split('?')[0].split('.').pop()?.toLowerCase();
    const knownTypes = ['glb', 'gltf', 'fbx', 'obj'];
    const type = (urlType && knownTypes.includes(urlType)) ? urlType : (modelType?.toLowerCase() || 'glb');

    if (!mounted) return null;

    const views = [
        { label: 'Iso', pos: [5, 5, 5] as [number, number, number] },
        { label: 'Top', pos: [0, 10, 0] as [number, number, number] },
        { label: 'Front', pos: [0, 0, 10] as [number, number, number] },
        { label: 'Right', pos: [10, 0, 0] as [number, number, number] },
    ];

    return (
        <div className={`${className} bg-gradient-to-b from-[#4b6c8b] to-[#9eaeb9] rounded-2xl overflow-hidden relative border border-white/10 shadow-2xl group flex flex-col`}>
            
            {/* --- TOP TOOLBAR --- */}
            <div className="absolute top-4 left-4 right-4 z-10 flex justify-between items-start pointer-events-none">
                
                <div className="bg-black/60 backdrop-blur-md border border-white/10 px-3 py-1.5 rounded-lg flex items-center gap-2 pointer-events-auto">
                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                    <span className="text-[10px] font-mono text-zinc-300 uppercase tracking-wider">
                        {type} Format
                    </span>
                </div>

                <div className="flex bg-black/60 backdrop-blur-md border border-white/10 rounded-lg overflow-hidden p-1 pointer-events-auto">
                    {views.map((view) => (
                        <button
                            key={view.label}
                            onClick={() => {
                                setAutoRotate(false);
                                setCameraTarget(view.pos);
                            }}
                            className="px-3 py-1.5 text-[10px] font-bold text-zinc-400 hover:text-white hover:bg-white/10 rounded transition-colors uppercase tracking-widest"
                        >
                            {view.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* --- CANVAS AREA --- */}
            <div className="flex-1 w-full relative cursor-move">
                <ErrorBoundary>
                   <Canvas 
                        shadows 
                        dpr={[1, 2]} 
                        camera={{ fov: 45, position: [5, 5, 5] }}
                        gl={{ 
                            alpha: true,
                            antialias: true,
                            toneMapping: THREE.ACESFilmicToneMapping, // Better color reproduction
                            toneMappingExposure: 1.2, // Increase overall brightness slightly
                        }}
                    >
                        <ambientLight intensity={0.8} />
                        <directionalLight 
                            position={[10, 10, 5]} 
                            intensity={1.5} 
                            castShadow 
                            shadow-mapSize={[1024, 1024]} 
                        />
                        <Suspense fallback={<Loader />}>
                            {/* Stage auto-centers the model */}
                            <Stage 
                                environment="studio" 
                                intensity={0.8} 
                                preset="rembrandt"
                                adjustCamera={1.2}
                                
                            >
                                <Model 
                                    url={modelUrl} 
                                    type={type} 
                                    wireframe={wireframe} 
                                    rotationOffset={rotations[axisRotationIndex]} 
                                />
                            </Stage>
                            
                            <Grid 
                                renderOrder={-1} 
                                position={[0, -0.01, 0]} 
                                infiniteGrid 
                                fadeDistance={30} 
                                fadeStrength={5} 
                                cellColor="#ffffff" 
                                sectionColor="#3b82f6" 
                                cellThickness={0.5}
                                sectionThickness={1}
                            />

                            <OrbitControls 
                                makeDefault
                                autoRotate={autoRotate}
                                autoRotateSpeed={1.5}
                                enableDamping
                                dampingFactor={0.05}
                                minDistance={2}
                                maxDistance={50}
                                maxPolarAngle={Math.PI / 2 + 0.1} // Camera wont go below ground
                            />
                            <CameraController targetPosition={cameraTarget} />
                        </Suspense>
                    </Canvas>
                </ErrorBoundary>
            </div>

            {/* --- BOTTOM TOOLBAR --- */}
            <div className="absolute bottom-4 left-4 right-4 z-10 flex justify-between items-end pointer-events-none">
                
                <div className="text-[10px] text-zinc-500 font-mono tracking-widest bg-black/40 px-2 py-1 rounded">
                    LOD 300/400 VIEWER
                </div>

                {/* Interaction Tools */}
                <div className="flex gap-2 pointer-events-auto">
                    {/* NEW: Rotate Axis Button */}
                    <button 
                        onClick={() => setAxisRotationIndex((prev) => (prev + 1) % rotations.length)}
                        className="w-10 h-10 rounded-xl flex items-center justify-center border bg-black/60 text-zinc-400 border-white/10 hover:bg-white/10 hover:text-white backdrop-blur-md transition-all"
                        title="Fix Model Orientation (Rotate 90°)"
                    >
                        <RotateCw size={16} />
                    </button>

                    <button 
                        onClick={() => setWireframe(!wireframe)}
                        className={`w-10 h-10 rounded-xl flex items-center justify-center border transition-all ${wireframe ? 'bg-blue-600 text-white border-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.5)]' : 'bg-black/60 text-zinc-400 border-white/10 hover:bg-white/10 hover:text-white backdrop-blur-md'}`}
                        title="Toggle Wireframe"
                    >
                        <LayoutGrid size={16} />
                    </button>
                    <button 
                        onClick={() => setAutoRotate(!autoRotate)}
                        className={`w-10 h-10 rounded-xl flex items-center justify-center border backdrop-blur-md transition-all ${autoRotate ? 'bg-blue-600/20 text-blue-400 border-blue-500/50' : 'bg-black/60 text-zinc-400 border-white/10 hover:bg-white/10 hover:text-white'}`}
                        title={autoRotate ? "Pause Rotation" : "Play Rotation"}
                    >
                        {autoRotate ? <Pause size={16} /> : <Play size={16} />}
                    </button>
                </div>

            </div>

        </div>
    );
}