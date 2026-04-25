"use client";

import { useRef, useEffect, useMemo, useCallback } from "react";
import { useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import { DRACOLoader } from "three-stdlib";
import * as THREE from "three";
import { useIntroStore } from "../../store/introStore";

function cubicBezier(p1x, p1y, p2x, p2y) {
  return (t) => {
    const cx = 3 * p1x;
    const bx = 3 * (p2x - p1x) - cx;
    const ax = 1 - cx - bx;

    const cy = 3 * p1y;
    const by = 3 * (p2y - p1y) - cy;
    const ay = 1 - cy - by;

    const sampleX = (t) => ((ax * t + bx) * t + cx) * t;
    const sampleDX = (t) => (3 * ax * t + 2 * bx) * t + cx;
    const sampleY = (t) => ((ay * t + by) * t + cy) * t;

    let x = t;
    for (let i = 0; i < 5; i++) {
      const dx = sampleX(x) - t;
      if (Math.abs(dx) < 1e-5) break;
      x -= dx / sampleDX(x);
    }

    return sampleY(x);
  };
}

export default function Map() {
  const cameraKF3Mid = useIntroStore((s) => s.cameraKF3Mid);
  const divisiIndex = useIntroStore((s) => s.divisiIndex);

  const { scene } = useGLTF(
    "/models/ISCARIA_15-v1.glb",
    true,
    true,
    (loader) => {
      const draco = new DRACOLoader();
      draco.setDecoderPath("https://www.gstatic.com/draco/v1/decoders/");
      loader.setDRACOLoader(draco);
    }
  );

  const logo = useRef(null);
  const divisionPad = useRef(null);
  const logoShaderRef = useRef(null);
  const osisMaterialsRef = useRef([]);

  const rotatedInitial = useRef(false);
  const rotateActive = useRef(false);
  const rotateProgress = useRef(0);
  const rotateDone = useRef(false);

  const lastDivisi = useRef(divisiIndex);
  const rotateDivisiActive = useRef(false);
  const rotateDivisiProgress = useRef(0);
  const rotatePhase = useRef(0);
  const pendingUpdate = useRef(false);

  const elapsed = useRef(0);
  const ease = useRef(cubicBezier(0.42, 0, 0.58, 1));
  const logoIsAttached = useRef(false);

  const LOGO_DURATION = 10;
  const LOGO_SMOOTH = 7;
  const ROLL_INTENSITY = 1.5;
  const ROTATE_SPEED = 1;
  const ROTATE_DIVISI_SPEED = 1.8;

  const DIVISION_COLORS = [
    "ECA415",
    "15A8EC",
    "96EC15",
    "EC6715",
    "A352FF",
    "EC1515",
    "15ECAB",
  ];

  const DIVISION_GROUPS = [
    ["Ri_dasi", "Ri_mimbar", "Riaas_logo"],
    ["A_helm", "A_tameng", "Amn_logo"],
    ["I_peci", "I_sajdahnsutrah", "Ibadah_logo"],
    ["L_bookbig", "L_booksmall", "L_bubble1", "L_bubble2", "L_spidol", "Lughah_logo"],
    ["Ry_bolanpingpongs", "Ry_rackets", "Riyadhah_logo"],
    ["S_p3knthings", "S_pil", "Shihhah_logo"],
    ["N_alatnember", "N_lap", "Nazhafah_logo"],
  ];

  const curve = useMemo(() => {
    if (!scene) return null;
    const pts = [];
    const add = (name, offset) => {
      const o = scene.getObjectByName(name);
      if (!o) return;
      const p = new THREE.Vector3();
      o.getWorldPosition(p);
      p.add(offset);
      pts.push(p);
    };

    add("L_LogoRotationIntro", new THREE.Vector3(5, -5, 80));
    add("L_LogoAlmToBase", new THREE.Vector3(-5, -3, 60));
    add("L_LogoAlmToBase", new THREE.Vector3(-5, -1, 40));
    add("L_LogoAlmToBase", new THREE.Vector3(7, -2, 20));
    add("L_LogoAlmToBase", new THREE.Vector3(6, -1, 15));
    add("L_LogoToBase", new THREE.Vector3(0, 7, 1));
    add("L_LogoToBase", new THREE.Vector3(0, 0, 1));

    return new THREE.CatmullRomCurve3(pts, false, "catmullrom", 0.45);
  }, [scene]);

  const updateDivisionContent = useCallback(() => {
    if (!scene) return;

    scene.traverse((o) => {
      const prefixes = ["Ri_", "A_", "I_", "L_", "N_", "Ry_", "S_"];
      const isDivisionItem =
        prefixes.some((p) => o.name.startsWith(p)) || o.name.endsWith("_logo");
      if (isDivisionItem) {
        o.visible = DIVISION_GROUPS[divisiIndex].includes(o.name);
      }
    });

    const newColor = new THREE.Color(`#${DIVISION_COLORS[divisiIndex]}`);
    osisMaterialsRef.current.forEach((mat) => {
      mat.color.copy(newColor);
    });
  }, [scene, divisiIndex]);

  useEffect(() => {
    if (!scene) return;

    logo.current = scene.getObjectByName("ISC_MainUsefulLogo");
    if (logo.current) {
      scene.attach(logo.current);
      logo.current.scale.set(1, 1, 1);
      logo.current.frustumCulled = false;
    }

    divisionPad.current = scene.getObjectByName("ISC_DivisionPadWholeItem");

    if (divisionPad.current && !rotatedInitial.current) {
      divisionPad.current.rotation.y = Math.PI;
      divisionPad.current.updateMatrixWorld(true);
      rotatedInitial.current = true;
    }

    osisMaterialsRef.current = [];

    scene.traverse((o) => {
      const prefixes = ["Ri_", "A_", "I_", "L_", "N_", "Ry_", "S_"];
      const isDivisionItem =
        prefixes.some((p) => o.name.startsWith(p)) || o.name.endsWith("_logo");

      if (isDivisionItem) {
        o.visible = DIVISION_GROUPS[divisiIndex].includes(o.name);
      }

      if (!o.isMesh) return;

      if (o.name === "ISC_MainUsefulLogo") {
        o.material.metalness = 1.0;
        o.material.roughness = 0.02;
        o.material.emissive = new THREE.Color("#FFCB15");
        o.material.emissiveIntensity = 2.0;
        o.material.onBeforeCompile = (shader) => {
          shader.uniforms.uTime = { value: 0 };
          shader.fragmentShader = `
            uniform float uTime;
            ${shader.fragmentShader}
          `.replace(
            `#include <dithering_fragment>`,
            `#include <dithering_fragment>
            float p = 0.8 + 0.2 * sin(uTime * 2.5);
            gl_FragColor.rgb *= p;`
          );
          logoShaderRef.current = shader;
        };
      }

      if (o.material) {
        const materials = Array.isArray(o.material) ? o.material : [o.material];
        let materialChanged = false;

        const updatedMaterials = materials.map((mat) => {
          if (mat.name && mat.name.includes("OSISColorChanges")) {
            const cloned = mat.clone();
            cloned.side = THREE.DoubleSide;

            const pureColor = new THREE.Color(`#${DIVISION_COLORS[divisiIndex]}`);
            cloned.color.copy(pureColor);

            cloned.emissive.set(0x000000);
            cloned.emissiveIntensity = 0;
            cloned.metalness = 0;
            cloned.roughness = 0.8;

            osisMaterialsRef.current.push(cloned);
            materialChanged = true;
            return cloned;
          }
          return mat;
        });

        if (materialChanged) {
          o.material = Array.isArray(o.material)
            ? updatedMaterials
            : updatedMaterials[0];
        }
      }
    });

    const lampNames = [
      "L_LampHighlightDivision",
      "L_LampGadingLDivision",
      "L_LampGadingRDivision",
    ];
    lampNames.forEach((name) => {
      const dummy = scene.getObjectByName(name);
      if (!dummy) return;
      const position = new THREE.Vector3();
      dummy.getWorldPosition(position);
      const pointLight = new THREE.PointLight(0xffcc66, 1, 50, 1);
      pointLight.position.copy(position);
      scene.add(pointLight);
      dummy.visible = false;
    });
  }, [scene]);

  useEffect(() => {
    if (!cameraKF3Mid || !divisionPad.current || rotateDone.current) return;
    rotateActive.current = true;
    rotateProgress.current = 0;
  }, [cameraKF3Mid]);

  useEffect(() => {
    if (!rotateDone.current || divisiIndex === lastDivisi.current) return;

    pendingUpdate.current = true;
    lastDivisi.current = divisiIndex;
    rotateDivisiActive.current = true;
    rotateDivisiProgress.current = 0;
    rotatePhase.current = 1;
  }, [divisiIndex, rotateDone]);

  useFrame((state, delta) => {
    if (logoShaderRef.current) {
      logoShaderRef.current.uniforms.uTime.value = state.clock.getElapsedTime();
    }

    if (logo.current && curve && !logoIsAttached.current) {
      elapsed.current += delta;
      const t = Math.min(elapsed.current / LOGO_DURATION, 1);
      const et = ease.current(t);
      const pos = curve.getPointAt(et);
      const tangent = curve.getTangentAt(et).normalize();
      const lookQuat = new THREE.Quaternion().setFromUnitVectors(
        new THREE.Vector3(0, 0, 1),
        tangent
      );
      const roll = Math.sin(et * Math.PI * 2.5) * ROLL_INTENSITY * (1 - et);
      lookQuat.multiply(
        new THREE.Quaternion().setFromAxisAngle(tangent, roll)
      );

      const lerp = 1 - Math.exp(-LOGO_SMOOTH * delta);
      logo.current.position.lerp(pos, lerp);
      logo.current.quaternion.slerp(lookQuat, lerp);

      if (t >= 1 && divisionPad.current) {
        divisionPad.current.attach(logo.current);
        logoIsAttached.current = true;
      }
    }

    if (rotateActive.current && divisionPad.current) {
      rotateProgress.current += delta * ROTATE_SPEED;
      const t = Math.min(rotateProgress.current, 1);
      const et = ease.current(t);
      divisionPad.current.rotation.y = Math.PI * (1 - et);
      if (t >= 1) {
        rotateActive.current = false;
        rotateDone.current = true;
        divisionPad.current.rotation.y = 0;
      }
    }

    if (rotateDivisiActive.current && divisionPad.current) {
      rotateDivisiProgress.current += delta * ROTATE_DIVISI_SPEED;
      const t = Math.min(rotateDivisiProgress.current, 1);
      const et = ease.current(t);

      if (rotatePhase.current === 1) {
        divisionPad.current.rotation.y = Math.PI * et;

        if (t >= 0.5 && pendingUpdate.current) {
          updateDivisionContent();
          pendingUpdate.current = false;
        }

        if (t >= 1) {
          rotatePhase.current = 2;
          rotateDivisiProgress.current = 0;
        }
      } else {
        divisionPad.current.rotation.y = THREE.MathUtils.lerp(
          Math.PI,
          Math.PI * 2,
          et
        );
        if (t >= 1) {
          rotateDivisiActive.current = false;
          divisionPad.current.rotation.y = 0;
        }
      }
    }
  });

  return <primitive object={scene} dispose={null} />;
}