import React, { useEffect, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF } from '@react-three/drei';

const BodyModel = ({ highlightedMuscles }) => {
    const { scene } = useGLTF('/model3d/MuscleFinal.glb');
    const groupRef = useRef(scene);

    useEffect(() => {
        if (groupRef.current) {

            scene.children.forEach((child) => {
                if (child.isMesh) {
                    child.material = child.material.clone();
                    child.material.color.set("#ffffff");
                    child.material.transparent = false;
                    child.material.opacity = 1;
                }
            });

            let musclesToHighlight = [...highlightedMuscles];

            if (highlightedMuscles.includes('Back')) {
                musclesToHighlight = musclesToHighlight.concat(['Rhomboids', 'Wings', 'Biceps']);
            }

            musclesToHighlight.forEach((muscle)  => {
                const musclePart = groupRef.current.getObjectByName(muscle);
                if (musclePart && musclePart.isMesh) {
                    musclePart.material = musclePart.material.clone();
                    musclePart.material.color.set("#b00020");
                    musclePart.material.transparent = true;
                    musclePart.material.opacity = 0.9;
                }
            });
        } else {
            console.log('Group ref is not set');
        }
    }, [highlightedMuscles, scene]);

    useEffect(() => {
        scene.scale.set(360, 360, 360);
        scene.position.set(0, -1, 0);
    }, [scene]);

    return (
        <Canvas
            camera={{ position: [20, 15, 40] }}
        >
            <ambientLight intensity={0.5} />
            <directionalLight
                position={[10, 10, 10]}
                intensity={3}
                castShadow
            />
            <directionalLight
                position={[-10, 10, -10]}
                intensity={2}
                castShadow
            />
            <pointLight position={[5, 5, 5]} intensity={2} />
            <hemisphereLight
                skyColor={'blue'}
                groundColor={'#444444'}
                intensity={0.6}
                position={[0, 20, 0]}
            />
            <primitive object={scene} ref={groupRef} />
            <OrbitControls enableZoom={false} />
        </Canvas>
    );
};

export default BodyModel;