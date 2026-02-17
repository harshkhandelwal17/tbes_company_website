'use client';

import { Suspense, useState, useEffect, Component, ReactNode } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stage, useGLTF, Html, useProgress } from '@react-three/drei';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader';
import { useLoader } from '@react-three/fiber';

class ErrorBoundary extends Component<{ children: ReactNode }, { hasError: boolean }> {
    constructor(props: { children: ReactNode }) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(_: Error) {
        return { hasError: true };
    }

    componentDidCatch(error: Error, errorInfo: any) {
        console.error("3D Viewer Error:", error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="flex items-center justify-center h-full bg-gray-900 text-white text-sm p-4 text-center">
                    <div>
                        <svg className="w-10 h-10 mx-auto mb-2 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                        <p>Failed to load 3D model.</p>
                        <p className="text-xs text-gray-400 mt-1">Check file URL or CORS settings.</p>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

function Loader() {
    const { progress } = useProgress();
    return <Html center className="text-white">{progress.toFixed(1)} % loaded</Html>;
}

function Model({ url, type }: { url: string; type: string }) {
    // Handle different file types
    if (type === 'gltf' || type === 'glb') {
        const { scene } = useGLTF(url);
        return <primitive object={scene} />;
    }

    if (type === 'fbx') {
        // Use FBXLoader explicitly
        const fbx = useLoader(FBXLoader, url);
        return <primitive object={fbx} />;
    }

    if (type === 'obj') {
        const obj = useLoader(OBJLoader, url);
        return <primitive object={obj} />;
    }

    return null;
}

interface ThreeDViewerProps {
    modelUrl: string;
    modelType?: string;
    className?: string;
}

export default function ThreeDViewer({ modelUrl, modelType, className = "h-[400px] w-full" }: ThreeDViewerProps) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    // Determine type if not provided
    const type = modelType || modelUrl.split('.').pop()?.toLowerCase() || 'glb';

    if (!mounted) return null;

    return (
        <div className={`${className} bg-gray-900 rounded-lg overflow-hidden relative`}>
            <ErrorBoundary>
                <Canvas shadows dpr={[1, 2]} camera={{ fov: 50 }}>
                    <Suspense fallback={<Loader />}>
                        <Stage environment="city" intensity={0.6}>
                            <Model url={modelUrl} type={type} />
                        </Stage>
                        <OrbitControls autoRotate />
                    </Suspense>
                </Canvas>
            </ErrorBoundary>
            <div className="absolute bottom-4 right-4 bg-black/50 text-white px-2 py-1 rounded text-xs backdrop-blur-sm">
                {type.toUpperCase()} Model
            </div>
        </div>
    );
}
