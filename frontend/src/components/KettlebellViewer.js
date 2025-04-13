import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF } from '@react-three/drei';

const KettlebellModel = () => {

    const { scene } = useGLTF('/model3d/kettlebell.glb');
    return <primitive object={scene} scale={30} />;
};




const KettlebellViewer = () => {
    return (
        <Canvas  camera={{ position: [1, 10, 10] }} style={{ height: '300px', width: '30%' }}>
            <ambientLight intensity={0.5} />
            <pointLight position={[10, 10, 10]} />
            <Suspense fallback={null}>
                <KettlebellModel />
            </Suspense>
            <OrbitControls />
        </Canvas>
    );
};

export default KettlebellViewer;