import React, { useEffect, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import { gsap } from 'gsap';

const Model = ({ scale, position, onRotationComplete, screenContent, showVideo }) => {
    const { scene } = useGLTF('/model3d/iphone16c.glb');
    const ref = useRef();
    const [isRotated, setIsRotated] = useState(false);
    const videoRef = useRef(document.createElement('video'));
    const [material, setMaterial] = useState(null);
    const videoMaterialRef = useRef(null);

    useEffect(() => {
        const screen = scene.getObjectByName('ggfeMlfPuTmgzCb_001001');
        if (screen) {
            if (showVideo) {
                videoRef.current.src = screenContent;
                videoRef.current.crossOrigin = "anonymous";
                videoRef.current.loop = true;
                videoRef.current.muted = true;
                videoRef.current.autoplay = true;
                videoRef.current.playsInline = true;

                videoRef.current.onloadeddata = () => {
                    videoRef.current.play();
                };

                const videoTexture = new THREE.VideoTexture(videoRef.current);
                videoTexture.flipY = false;
                videoTexture.colorSpace = THREE.SRGBColorSpace;
                videoTexture.offset.set(-0.05, -0.01);
                videoTexture.repeat.set(1.1, 1.01);

                videoMaterialRef.current = new THREE.MeshBasicMaterial({
                    map: videoTexture,
                    toneMapped: false,
                    transparent: true,
                    opacity: 0, // Startowo wideo jest niewidoczne
                });

                // Wideo zaczyna być lekko widoczne przed zanikiem zdjęcia
                gsap.to(videoMaterialRef.current, { opacity: 1, duration: 1.5 });

                setTimeout(() => {
                    gsap.to(material, {
                        opacity: 0,
                        duration: 0.1,
                        onComplete: () => {
                            screen.material = videoMaterialRef.current;
                        },
                    });
                }, 0);
            } else {
                const imageTexture = new THREE.TextureLoader().load('/screenshot.webp');
                imageTexture.flipY = false;
                imageTexture.offset.set(-0.05, -0.01);
                imageTexture.repeat.set(1.1, 1.01);
                imageTexture.colorSpace = THREE.SRGBColorSpace;

                const newMaterial = new THREE.MeshBasicMaterial({
                    map: imageTexture,
                    toneMapped: false,
                    transparent: true,
                    opacity: 0,
                });

                screen.material = newMaterial;
                setMaterial(newMaterial);

                gsap.to(newMaterial, { opacity: 1, duration: 1.5 });
            }
        } else {
            console.error('Screen not found!');
        }
    }, [scene, screenContent, showVideo]);



    useFrame(() => {
        if (ref.current) {
            ref.current.scale.set(scale, scale, scale);
            ref.current.position.set(position.x, position.y, position.z);

            if (!isRotated && ref.current.rotation.y < Math.PI) {
                ref.current.rotation.y += 0.05;
            } else if (!isRotated) {
                setIsRotated(true);
                onRotationComplete();
            }
        }
    });

    return <primitive object={scene} ref={ref} />;
};

export default function IphoneModel({ activeScreen , language }) {
    const [scale, setScale] = useState(1.2);
    const [position, setPosition] = useState({ x: 2, y: 15, z: 0 });
    const [showVideo, setShowVideo] = useState(false);
    const [fov, setFov] = useState(50);

    useEffect(() => {
        const updateFov = () => {
            if (window.innerWidth < 800) {
                setFov(65);
            } else {
                setFov(50);
            }
        };

        updateFov();
        window.addEventListener('resize', updateFov);

        return () => {
            window.removeEventListener('resize', updateFov);
        };
    }, []);


    const getScreenContent = () => {

        switch (activeScreen) {

            case 1:
                return '/prev1' + language + '.mov';
            case 1.2 :
                return '/prev1' + language + '.mov';
            case 2:
                return '/prev2' + language + '.mov';
            default:
                return '/prev1' + language + '.mov';
        }
    };

    useEffect(() => {
        const handleScroll = () => {
            const scrollY = window.scrollY;

            if (scrollY > 100) {
                setShowVideo(true);
            }

            if (scrollY < 100) {
                setShowVideo(false);
            }


            if (scrollY < 800) {
                setScale(Math.min(1.2 + scrollY * 0.006, 3));
                setPosition({
                    x: Math.min(2 + (scrollY / 300) * 4, 5.5),
                    y: Math.max(15 - (scrollY / 300) * 20, 1.5),
                    z: 0
                });
            }


        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <Canvas camera={{ position: [0, 2, 60], fov: fov }} style={{ height: '100vh', width: '100%' }}>
            <ambientLight color={new THREE.Color('rgb(198,190,175)')} intensity={1} />
            <directionalLight position={[5, 5, 5]} intensity={3} />
            <Model scale={scale} position={position} onRotationComplete={() => {}} screenContent={getScreenContent()} showVideo={showVideo} />
        </Canvas>
    );
}
