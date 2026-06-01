"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import * as THREE from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";

const navItems = [
  { href: "/projects", label: "Work" },
  { href: "/contact", label: "Lab" },
  { href: "/about", label: "About" }
];

const sphereItems = [
  { label: "AI AGENT", radius: 1.95, accent: true },
  { label: "HARNESS ENGINEERING", radius: 2.32 },
  { label: "PROMPT-RAG", radius: 1.18 },
  { label: "CODEX", radius: 0.84 },
  { label: "AIGC \u98ce\u683c\u63a7\u5236", radius: 1.72 },
  { label: "FIGMA", radius: 1.06 },
  { label: "CLAUDE CODE", radius: 1.34 },
  { label: "\u89d2\u8272\u4e00\u81f4\u6027", radius: 0.94 },
  { label: "MIDJOURNEY", radius: 1.58 },
  { label: "\u6a21\u578b\u6548\u679c\u9a8c\u6536", radius: 2.08 },
  { label: "GIT", radius: 0.78 },
  { label: "\u89c6\u89c9\u9700\u6c42\u62c6\u89e3", radius: 1.46 },
  { label: "SEEDANCE", radius: 1.04 },
  { label: "RHINO", radius: 0.88 },
  { label: "KEYSHOT", radius: 1.22 }
];

export default function Home() {
  const stageRef = useRef(null);

  useEffect(() => {
    const stage = stageRef.current;

    if (!stage) {
      return undefined;
    }

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 100);
    camera.position.set(0, 0, 24);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: "high-performance"
    });
    renderer.setClearColor(0x000000, 0);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.08;
    stage.appendChild(renderer.domElement);

    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    const environment = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
    scene.environment = environment;

    const ambient = new THREE.HemisphereLight(0xf3f1e9, 0x3a4540, 2.3);
    scene.add(ambient);

    const key = new THREE.DirectionalLight(0xffffff, 2.4);
    key.position.set(-5, 7, 10);
    scene.add(key);

    const rim = new THREE.DirectionalLight(0xd4f546, 0.62);
    rim.position.set(6, 4, 8);
    scene.add(rim);

    const floor = new THREE.Mesh(
      new THREE.PlaneGeometry(40, 0.28),
      new THREE.MeshBasicMaterial({ color: 0xd8d6cc, transparent: true, opacity: 0.08 })
    );
    floor.rotation.x = 0;
    scene.add(floor);

    const glassMaterial = new THREE.MeshPhysicalMaterial({
      color: 0xf3f1e9,
      metalness: 0,
      roughness: 0.02,
      transmission: 0.94,
      thickness: 2.4,
      transparent: true,
      opacity: 0.18,
      ior: 1.5,
      clearcoat: 1,
      clearcoatRoughness: 0.02,
      specularIntensity: 1,
      attenuationColor: 0xf3f1e9,
      attenuationDistance: 4.8
    });

    const accentMaterial = new THREE.MeshPhysicalMaterial({
      color: 0xd4f546,
      metalness: 0,
      roughness: 0.03,
      transmission: 0.72,
      thickness: 1.6,
      transparent: true,
      opacity: 0.36,
      ior: 1.42,
      clearcoat: 1,
      clearcoatRoughness: 0.04,
      attenuationColor: 0xd4f546,
      attenuationDistance: 3.2
    });

    const geometry = new THREE.SphereGeometry(1, 48, 32);
    const rimMaterial = new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      uniforms: {
        inkColor: { value: new THREE.Color(0xf3f1e9) },
        acidColor: { value: new THREE.Color(0xd4f546) },
        accentMix: { value: 0 }
      },
      vertexShader: `
        varying vec3 vNormal;
        varying vec3 vViewPosition;

        void main() {
          vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
          vNormal = normalize(normalMatrix * normal);
          vViewPosition = -mvPosition.xyz;
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: `
        uniform vec3 inkColor;
        uniform vec3 acidColor;
        uniform float accentMix;
        varying vec3 vNormal;
        varying vec3 vViewPosition;

        void main() {
          vec3 viewDir = normalize(vViewPosition);
          float fresnel = pow(1.0 - abs(dot(normalize(vNormal), viewDir)), 2.2);
          vec3 color = mix(inkColor, acidColor, accentMix);
          gl_FragColor = vec4(color, fresnel * 0.34);
        }
      `
    });
    const highlightGeometry = new THREE.SphereGeometry(0.18, 24, 16);
    const highlightMaterial = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.44
    });

    function getLabelLines(label) {
      if (label === "HARNESS ENGINEERING") {
        return ["HARNESS", "ENGINEERING"];
      }

      if (label === "CLAUDE CODE") {
        return ["CLAUDE", "CODE"];
      }

      if (label === "AIGC \u98ce\u683c\u63a7\u5236") {
        return ["AIGC", "\u98ce\u683c\u63a7\u5236"];
      }

      if (label.includes(" ")) {
        return label.split(" ");
      }

      return [label];
    }

    function createLabelSprite(label, accent, radius) {
      const canvas = document.createElement("canvas");
      const context = canvas.getContext("2d");
      const size = 512;
      const lines = getLabelLines(label);
      const maxTextWidth = size * 0.62;
      const maxTextHeight = size * 0.42;
      let fontSize = Math.round(54 + radius * 8);

      canvas.width = size;
      canvas.height = size;
      context.textAlign = "center";
      context.textBaseline = "middle";
      context.fillStyle = "#14201C";

      while (fontSize > 24) {
        context.font = `${fontSize}px "JetBrains Mono", "Microsoft YaHei", Consolas, "Courier New", monospace`;
        const widest = Math.max(...lines.map((line) => context.measureText(line).width));
        const totalHeight = lines.length * fontSize * 1.16;

        if (widest <= maxTextWidth && totalHeight <= maxTextHeight) {
          break;
        }

        fontSize -= 2;
      }

      context.font = `${fontSize}px "JetBrains Mono", "Microsoft YaHei", Consolas, "Courier New", monospace`;
      const lineHeight = fontSize * 1.16;
      const startY = size / 2 - ((lines.length - 1) * lineHeight) / 2;
      lines.forEach((line, index) => {
        context.fillText(line, size / 2, startY + index * lineHeight);
      });

      const texture = new THREE.CanvasTexture(canvas);
      texture.colorSpace = THREE.SRGBColorSpace;
      const material = new THREE.SpriteMaterial({
        map: texture,
        transparent: true,
        opacity: 0.92,
        depthTest: false
      });
      const sprite = new THREE.Sprite(material);
      sprite.userData.texture = texture;
      sprite.userData.material = material;
      sprite.userData.scale = radius * 1.68;
      return sprite;
    }

    let width = 0;
    let height = 0;
    let worldWidth = 16;
    let worldHeight = 9;
    let floorY = -3;
    let pointerWorld = null;
    let draggedBody = null;
    let dragOffset = null;
    let dragLast = null;
    let dragLastTime = 0;
    let seeded = false;
    let frameId;
    let lastTime = performance.now();
    const gravity = 8;
    const airDamping = 0.9;
    const groundBounce = 0.3;
    const groundFriction = 0.9;
    const releaseVelocityScale = 0.14;
    const dragSpring = 34;
    const dragDamping = 9;

    const bodies = sphereItems.map((item, index) => {
      const mesh = new THREE.Mesh(geometry, accentMaterial);
      mesh.scale.setScalar(item.radius);
      scene.add(mesh);

      const rim = new THREE.Mesh(geometry, rimMaterial.clone());
      rim.material.uniforms.accentMix.value = 1;
      rim.scale.setScalar(item.radius * 1.018);
      scene.add(rim);

      const highlight = new THREE.Mesh(highlightGeometry, highlightMaterial);
      scene.add(highlight);

      const label = createLabelSprite(item.label, item.accent, item.radius);
      scene.add(label);

      return {
        ...item,
        mesh,
        rim,
        highlight,
        label,
        position: new THREE.Vector3(),
        velocity: new THREE.Vector3(),
        angle: 0,
        angularVelocity: 0,
        floorOffset: [0.1, 0.42, 0.0, 0.7, 0.26][index % 5],
        floatPhase: index * 0.74,
        settled: false
      };
    });

    function setSceneSize() {
      const rect = stage.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      renderer.setSize(width, height, false);

      worldHeight = 12.8;
      worldWidth = worldHeight * (width / height);
      camera.left = worldWidth / -2;
      camera.right = worldWidth / 2;
      camera.top = worldHeight / 2;
      camera.bottom = worldHeight / -2;
      camera.updateProjectionMatrix();

      floorY = camera.bottom + 1.28;
      floor.position.set(0, floorY - 0.08, -0.18);
      floor.scale.set(worldWidth / 40, 1, 1);

      if (!seeded) {
        seedBodies();
        seeded = true;
        return;
      }

      bodies.forEach((body) => {
        body.position.x = Math.min(camera.right - body.radius, Math.max(camera.left + body.radius, body.position.x));
        body.position.y = Math.min(camera.top - body.radius, Math.max(floorY + body.radius + body.floorOffset, body.position.y));
      });
    }

    function seedBodies() {
      const columns = width < 760 ? 3 : 4;
      const top = camera.top - 1.0;
      const span = worldWidth * 0.82;
      bodies.forEach((body, index) => {
        const column = index % columns;
        const row = Math.floor(index / columns);
        const x = -span / 2 + (span / Math.max(columns - 1, 1)) * column + (row % 2 ? 0.46 : -0.22);
        const y = top + row * 1.35 + index * 0.02;
        const z = (index % 5) * 0.04;
        body.position.set(x, y, z);
        body.velocity.set(0, 0, 0);
        body.angularVelocity = 0;
        body.settled = false;
      });
    }

    function toWorld(event) {
      const rect = renderer.domElement.getBoundingClientRect();
      const x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -(((event.clientY - rect.top) / rect.height) * 2 - 1);
      return new THREE.Vector3(x * (worldWidth / 2), y * (worldHeight / 2), 0);
    }

    function pickBody(origin) {
      let candidate = null;
      let candidateDistance = Infinity;

      bodies.forEach((body) => {
        const distance = Math.hypot(body.position.x - origin.x, body.position.y - origin.y);

        if (distance < body.radius * 1.16 && distance < candidateDistance) {
          candidate = body;
          candidateDistance = distance;
        }
      });

      return candidate;
    }

    function disturb(origin, strength) {
      bodies.forEach((body) => {
        const delta = body.position.clone().sub(origin);
        const distance = Math.max(delta.length(), 0.001);
        const range = 3.2;

        if (distance > range) {
          return;
        }

        const impulse = (1 - distance / range) * strength;
        delta.normalize();
        body.velocity.x += delta.x * impulse;
        body.velocity.y += Math.max(0.16, delta.y) * impulse + impulse * 0.18;
        body.velocity.z += (body.position.z >= 0 ? 1 : -1) * impulse * 0.1;
        body.settled = false;
      });
    }

    function resolveWalls(body) {
      const left = camera.left + body.radius;
      const right = camera.right - body.radius;
      const ceiling = camera.top - body.radius;
      const ground = floorY + body.radius + body.floorOffset;

      if (body.position.x < left) {
        body.position.x = left;
        body.velocity.x *= -0.34;
        body.angularVelocity += body.velocity.x / Math.max(body.radius, 0.001) * 0.08;
      }

      if (body.position.x > right) {
        body.position.x = right;
        body.velocity.x *= -0.34;
        body.angularVelocity += body.velocity.x / Math.max(body.radius, 0.001) * 0.08;
      }

      if (body.position.y > ceiling) {
        body.position.y = ceiling;
        body.velocity.y *= -0.28;
      }

      if (body.position.y < ground) {
        body.position.y = ground;
        body.velocity.y *= -groundBounce;
        body.velocity.x *= groundFriction;
        body.angularVelocity += body.velocity.x / Math.max(body.radius, 0.001) * 0.06;

        if (Math.abs(body.velocity.y) < 0.018 && Math.abs(body.velocity.x) < 0.018) {
          body.velocity.y = 0;
          body.velocity.x *= 0.992;
          body.settled = true;
        }
      }
    }

    function resolveCollision(a, b) {
      const delta = b.position.clone().sub(a.position);
      delta.z = 0;
      const distance = Math.max(delta.length(), 0.001);
      const minDistance = a.radius + b.radius + 0.04;

      if (distance >= minDistance) {
        return;
      }

      const normal = delta.divideScalar(distance);
      const overlap = minDistance - distance;
      const aDragged = a === draggedBody;
      const bDragged = b === draggedBody;

      if (aDragged && !bDragged) {
        b.position.addScaledVector(normal, overlap);
      } else if (bDragged && !aDragged) {
        a.position.addScaledVector(normal, -overlap);
      } else {
        a.position.addScaledVector(normal, -overlap * 0.5);
        b.position.addScaledVector(normal, overlap * 0.5);
      }

      const relativeVelocity = b.velocity.clone().sub(a.velocity);
      const speed = relativeVelocity.dot(normal);

      if (speed > 0) {
        return;
      }

      const impulse = -(0.86 * speed) / 2;
      if (aDragged && !bDragged) {
        b.velocity.addScaledVector(normal, Math.max(impulse, 0.12));
      } else if (bDragged && !aDragged) {
        a.velocity.addScaledVector(normal, -Math.max(impulse, 0.12));
      } else {
        a.velocity.addScaledVector(normal, -impulse);
        b.velocity.addScaledVector(normal, impulse);
      }

      const tangent = new THREE.Vector3(-normal.y, normal.x, 0);
      const tangentSpeed = relativeVelocity.dot(tangent);
      if (!aDragged) {
        a.angularVelocity += (-tangentSpeed * 0.12 - impulse * normal.x * 0.08) / Math.max(a.radius, 0.001);
      }

      if (!bDragged) {
        b.angularVelocity += (tangentSpeed * 0.12 + impulse * normal.x * 0.08) / Math.max(b.radius, 0.001);
      }

      a.settled = false;
      b.settled = false;
    }

    function animate(time) {
      const dt = Math.min((time - lastTime) / 1000, 0.032);
      lastTime = time;

      bodies.forEach((body) => {
        if (body === draggedBody && pointerWorld && dragOffset) {
          const anchor = pointerWorld.clone().add(dragOffset);
          anchor.x = Math.min(camera.right - body.radius, Math.max(camera.left + body.radius, anchor.x));
          anchor.y = Math.min(camera.top - body.radius, Math.max(floorY + body.radius, anchor.y));
          const springForce = anchor.sub(body.position).multiplyScalar(dragSpring);
          const dampingForce = body.velocity.clone().multiplyScalar(-dragDamping);
          body.velocity.addScaledVector(springForce.add(dampingForce), dt);
        } else {
          body.velocity.y -= gravity * dt;
        }

        body.velocity.multiplyScalar(Math.pow(airDamping, dt));
        body.angularVelocity *= 0.93;

        if (pointerWorld) {
          const delta = body.position.clone().sub(pointerWorld);
          delta.z = 0;
          const distance = Math.max(delta.length(), 0.001);

          if (distance < 1.7 + body.radius) {
            delta.normalize();
          body.velocity.addScaledVector(delta, (1.7 + body.radius - distance) * 0.9 * dt);
          body.velocity.y += 0.42 * dt;
          body.settled = false;
          }
        }

        body.position.addScaledVector(body.velocity, dt);
        body.angle += body.angularVelocity * dt;
        resolveWalls(body);
      });

      for (let i = 0; i < bodies.length; i += 1) {
        for (let j = i + 1; j < bodies.length; j += 1) {
          resolveCollision(bodies[i], bodies[j]);
        }
      }

      bodies.forEach((body, index) => {
        body.mesh.position.copy(body.position);
        body.mesh.scale.setScalar(body.radius);
        body.rim.position.copy(body.position);
        body.rim.scale.setScalar(body.radius * 1.018);
        body.highlight.position.copy(body.position).add(new THREE.Vector3(-body.radius * 0.28, body.radius * 0.32, body.radius * 0.72));
        body.label.position.copy(body.position).add(new THREE.Vector3(0, 0, body.radius * 1.08));
        body.label.scale.setScalar(body.label.userData.scale);
        body.label.material.rotation = -body.angle;
        body.mesh.rotation.x = 0;
        body.mesh.rotation.y = body.angle;
        body.rim.rotation.copy(body.mesh.rotation);
      });

      renderer.render(scene, camera);
      frameId = window.requestAnimationFrame(animate);
    }

    function handlePointerMove(event) {
      pointerWorld = toWorld(event);

      if (draggedBody) {
        const now = performance.now();
        const dt = Math.max((now - dragLastTime) / 1000, 0.016);
        const dragPoint = pointerWorld.clone();
        const dx = dragPoint.x - dragLast.x;
        draggedBody.angularVelocity += (dx / Math.max(draggedBody.radius, 0.001)) * 0.055;
        draggedBody.settled = false;
        dragLast = dragPoint;
        dragLastTime = now;
        return;
      }

      disturb(pointerWorld, 0.034);
    }

    function handlePointerLeave() {
      pointerWorld = null;
    }

    function handlePointerDown(event) {
      const origin = toWorld(event);
      const picked = pickBody(origin);

      if (picked) {
        draggedBody = picked;
        dragOffset = picked.position.clone().sub(origin);
        dragLast = origin.clone();
        dragLastTime = performance.now();
        picked.angularVelocity = 0;
        renderer.domElement.setPointerCapture(event.pointerId);
        return;
      }

      disturb(origin, 5.2);
    }

    function handlePointerUp(event) {
      if (!draggedBody) {
        return;
      }

      draggedBody.velocity.multiplyScalar(releaseVelocityScale);
      draggedBody.angularVelocity = draggedBody.velocity.x / Math.max(draggedBody.radius, 0.001);
      draggedBody.settled = false;
      draggedBody = null;
      dragOffset = null;
      dragLast = null;

      if (renderer.domElement.hasPointerCapture(event.pointerId)) {
        renderer.domElement.releasePointerCapture(event.pointerId);
      }
    }

    setSceneSize();
    lastTime = performance.now();
    frameId = window.requestAnimationFrame(animate);

    window.addEventListener("resize", setSceneSize);
    renderer.domElement.addEventListener("pointermove", handlePointerMove);
    renderer.domElement.addEventListener("pointerleave", handlePointerLeave);
    renderer.domElement.addEventListener("pointerdown", handlePointerDown);
    renderer.domElement.addEventListener("pointerup", handlePointerUp);
    renderer.domElement.addEventListener("pointercancel", handlePointerUp);

    return () => {
      window.cancelAnimationFrame(frameId);
      window.removeEventListener("resize", setSceneSize);
      renderer.domElement.removeEventListener("pointermove", handlePointerMove);
      renderer.domElement.removeEventListener("pointerleave", handlePointerLeave);
      renderer.domElement.removeEventListener("pointerdown", handlePointerDown);
      renderer.domElement.removeEventListener("pointerup", handlePointerUp);
      renderer.domElement.removeEventListener("pointercancel", handlePointerUp);
      geometry.dispose();
      highlightGeometry.dispose();
      glassMaterial.dispose();
      accentMaterial.dispose();
      rimMaterial.dispose();
      highlightMaterial.dispose();
      bodies.forEach((body) => {
        body.rim.material.dispose();
        body.label.userData.texture.dispose();
        body.label.userData.material.dispose();
      });
      environment.dispose();
      pmremGenerator.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, []);

  return (
    <main className="home-shell">
      <nav className="home-nav">
        <Link href="/" className="home-mark">
          HYH
        </Link>
        <div className="home-nav-links">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} className="nav-link">
              {item.label}
            </Link>
          ))}
        </div>
      </nav>

      <section className="three-hero" aria-label="homepage hero">
        <h1 className="hero-name">Helix</h1>
        <div ref={stageRef} className="three-stage" aria-label="interactive skill spheres">
        </div>
      </section>
    </main>
  );
}
