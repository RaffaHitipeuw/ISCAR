"use client";

import { useEffect, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { useIntroStore } from "@/store/introStore";

function cubicBezier(p1x, p1y, p2x, p2y) {
  return (t) => {
    const cx = 3 * p1x, bx = 3 * (p2x - p1x) - cx, ax = 1 - cx - bx;
    const cy = 3 * p1y, by = 3 * (p2y - p1y) - cy, ay = 1 - cy - by;
    const sampleCurveX = (t) => ((ax * t + bx) * t + cx) * t;
    const sampleCurveDerivativeX = (t) => (3 * ax * t + 2 * bx) * t + cx;
    const sampleCurveY = (t) => ((ay * t + by) * t + cy) * t;
    let x = t;
    for (let i = 0; i < 5; i++) {
      const dx = sampleCurveX(x) - t;
      if (Math.abs(dx) < 1e-5) break;
      x -= dx / sampleCurveDerivativeX(x);
    }
    return sampleCurveY(x);
  };
}

export default function CameraController() {
  const { camera } = useThree();

  const {
    phase,
    setPhase,
    setCameraSettled,
    hoverZoom,
    setCameraKF3Mid,
  } = useIntroStore();

  const BASE_FOV = useRef(camera.fov);
  const kf1Pos = useRef(new THREE.Vector3(0, 1, 90));
  const kf2Pos = useRef(new THREE.Vector3(0, 1, 6));
  const kf3Pos = useRef(new THREE.Vector3(0, 0.5, 0.13));

  const kfDescPos = useRef(new THREE.Vector3(-0.40, 0.70, -1)); 
  const kfDescRot = useRef(new THREE.Euler(0.05, -0.45, 0));

  const kf1Rot = useRef(new THREE.Euler(-0.50, 0, 0));
  const kf2Rot = useRef(new THREE.Euler(0.10, 0, 0));
  const kf3Rot = useRef(new THREE.Euler(0.10, 0, 0));

  const kfGalleryPos = useRef(new THREE.Vector3(1.2, 0.8, -0.1));
  const kfGalleryRot = useRef(new THREE.Euler(0, -1.5, 0));

  const introTime = useRef(0);
  const exploreTime = useRef(0);
  const descMoveTime = useRef(0);
  const descMoveBackTime = useRef(0);
  const galleryTime = useRef(0);

  const introDone = useRef(false);
  const exploreDone = useRef(false);
  const descMoveDone = useRef(false);
  const descMoveBackDone = useRef(false);
  const kf3MidTriggered = useRef(false);
  const galleryDone = useRef(false);

  const INTRO_DURATION = 10.5;
  const EXPLORE_DURATION = 3.5;
  const DESC_MOVE_DURATION = 2.0;
  const GALLERY_DURATION = 4.0;

  const ZOOM_SPEED = 1.1;
  const ease = useRef(cubicBezier(0.45, 0.0, 0.55, 1.0));
  const baseRotation = useRef(new THREE.Euler());
  const cursor = useRef({ x: 0, y: 0 });
  const currentYaw = useRef(0);
  const currentPitch = useRef(0);
  const maxYaw = THREE.MathUtils.degToRad(4);
  const maxPitch = THREE.MathUtils.degToRad(2);
  const zoomProgress = useRef(0);

  useEffect(() => {
    camera.position.copy(kf1Pos.current);
    camera.rotation.order = "YXZ";
    camera.rotation.copy(kf1Rot.current);

    const onMouseMove = (e) => {
      cursor.current.x = (e.clientX / window.innerWidth - 0.5) * 2;
      cursor.current.y = (e.clientY / window.innerHeight - 0.5) * 2;
    };

    window.addEventListener("mousemove", onMouseMove);
    return () => window.removeEventListener("mousemove", onMouseMove);
  }, [camera]);

  useFrame((_, delta) => {
    if (!introDone.current) {
      introTime.current += delta;
      const t = Math.min(introTime.current / INTRO_DURATION, 1);
      const eased = ease.current(t);
    
      camera.position.lerpVectors(kf1Pos.current, kf2Pos.current, eased);
      camera.rotation.x = THREE.MathUtils.lerp(kf1Rot.current.x, kf2Rot.current.x, eased);
    
      if (t === 1) {
        introDone.current = true;
        baseRotation.current.copy(camera.rotation);
        BASE_FOV.current = camera.fov;
        setCameraSettled(true);
        setPhase("intro");
      }
      return;
    }
  
    if (phase === "exploreMove" && !exploreDone.current) {
      exploreTime.current += delta;
      const t = Math.min(exploreTime.current / EXPLORE_DURATION, 1);
      const eased = ease.current(t);
    
      if (t >= 0.5 && !kf3MidTriggered.current) {
        setCameraKF3Mid(true);
        kf3MidTriggered.current = true;
      }
    
      camera.position.lerpVectors(kf2Pos.current, kf3Pos.current, eased);
      baseRotation.current.x = THREE.MathUtils.lerp(
        kf2Rot.current.x,
        kf3Rot.current.x,
        eased
      );
    
      if (t === 1) {
        exploreDone.current = true;
        setPhase("kf3");
      }
    }
  
    if (phase === "descMove" && !descMoveDone.current) {
      descMoveTime.current += delta;
      const t = Math.min(descMoveTime.current / DESC_MOVE_DURATION, 1);
      const eased = ease.current(t);
    
      camera.position.lerpVectors(kf3Pos.current, kfDescPos.current, eased);
      baseRotation.current.x = THREE.MathUtils.lerp(
        kf3Rot.current.x,
        kfDescRot.current.x,
        eased
      );
      baseRotation.current.y = THREE.MathUtils.lerp(
        kf3Rot.current.y,
        kfDescRot.current.y,
        eased
      );
    
      if (t === 1) {
        descMoveDone.current = true;
        descMoveBackDone.current = false;
        descMoveBackTime.current = 0;
        setPhase("desc");
      }
    }
  
    if (phase === "descBack" && !descMoveBackDone.current) {
      descMoveBackTime.current += delta;
      const t = Math.min(descMoveBackTime.current / DESC_MOVE_DURATION, 1);
      const eased = ease.current(t);
    
      camera.position.lerpVectors(kfDescPos.current, kf3Pos.current, eased);
      baseRotation.current.x = THREE.MathUtils.lerp(
        kfDescRot.current.x,
        kf3Rot.current.x,
        eased
      );
      baseRotation.current.y = THREE.MathUtils.lerp(
        kfDescRot.current.y,
        kf3Rot.current.y,
        eased
      );
    
      if (t === 1) {
        descMoveBackDone.current = true;
        descMoveDone.current = false;
        descMoveTime.current = 0;
        setPhase("kf3");
      }
    }
  
    // 🔥 RESET GALLERY STATE AGAR BISA DIPANGGIL LAGI
    if (phase !== "galleryMove") {
      galleryDone.current = false;
      galleryTime.current = 0;
    }
  
    // 🔥 GALLERY MOVE
    if (phase === "galleryMove" && !galleryDone.current) {
      galleryTime.current += delta;
      const t = Math.min(galleryTime.current / GALLERY_DURATION, 1);
      const eased = ease.current(t);
    
      camera.position.lerpVectors(
        kf3Pos.current,
        kfGalleryPos.current,
        eased
      );
    
      baseRotation.current.x = THREE.MathUtils.lerp(
        kf3Rot.current.x,
        kfGalleryRot.current.x,
        eased
      );
    
      baseRotation.current.y = THREE.MathUtils.lerp(
        kf3Rot.current.y,
        kfGalleryRot.current.y,
        eased
      );
    
      if (t === 1) {
        galleryDone.current = true;
        setPhase("gallery");
      }
    }
  
    if (hoverZoom && phase === "intro") {
      zoomProgress.current = Math.min(
        zoomProgress.current + delta * ZOOM_SPEED,
        1
      );
    } else {
      zoomProgress.current = Math.max(
        zoomProgress.current - delta * ZOOM_SPEED,
        0
      );
    }
  
    const zoomEased = ease.current(zoomProgress.current);
    camera.fov = BASE_FOV.current - zoomEased * 5;
    camera.updateProjectionMatrix();
  
    const targetYaw = -cursor.current.x * maxYaw;
    const targetPitch = -cursor.current.y * maxPitch;
    const lerpFactor = 1.0 - Math.exp(-6 * delta);
  
    currentYaw.current = THREE.MathUtils.lerp(
      currentYaw.current,
      targetYaw,
      lerpFactor
    );
    currentPitch.current = THREE.MathUtils.lerp(
      currentPitch.current,
      targetPitch,
      lerpFactor
    );
  
    camera.rotation.y = baseRotation.current.y + currentYaw.current;
    camera.rotation.x = baseRotation.current.x + currentPitch.current;
  });

  return null;
}