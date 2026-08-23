"use client";

import { useEffect, useRef, useState } from "react";
import { usePrefersReducedMotion } from "@/lib/motion/use-prefers-reduced-motion";

export type ManifestationStage = 0 | 1 | 2 | 3 | 4 | 5;
type V3 = [number, number, number];
type P2 = { x: number; y: number; z: number; size: number };

type Particle = {
  base: V3;
  side: -1 | 1;
  phase: number;
  size: number;
};

const ANCHORS: V3[] = [
  [-0.82, -0.56, 0.10],
  [-0.86, -0.16, -0.16],
  [-0.80, 0.28, 0.08],
  [-0.62, 0.62, -0.12],
  [-0.38, 0.78, 0.10],
  [-0.20, 0.38, -0.22],
  [0.20, 0.38, 0.22],
  [0.38, 0.78, -0.10],
  [0.62, 0.62, 0.12],
  [0.80, 0.28, -0.08],
  [0.86, -0.16, 0.16],
  [0.82, -0.56, -0.10],
];

// Deliberately external to the two structural groups.
const OBSERVER: V3 = [0.02, 1.28, 1.72];
const DPR_LIMIT = 1.5;
const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const ease = (v: number) => {
  const t = clamp(v);
  return t * t * (3 - 2 * t);
};
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

function rotate(p: V3, rx: number, ry: number, rz: number): V3 {
  let [x, y, z] = p;
  const cx = Math.cos(rx), sx = Math.sin(rx);
  const cy = Math.cos(ry), sy = Math.sin(ry);
  const cz = Math.cos(rz), sz = Math.sin(rz);

  let y1 = y * cx - z * sx;
  let z1 = y * sx + z * cx;
  y = y1;
  z = z1;

  let x1 = x * cy + z * sy;
  z1 = -x * sy + z * cy;
  x = x1;
  z = z1;

  x1 = x * cz - y * sz;
  y1 = x * sz + y * cz;
  return [x1, y1, z];
}

function project(
  p: V3,
  aspect: number,
  cameraZ: number,
  focal: number,
  near = 0.1,
  far = 20,
): P2 {
  const z = p[2] - cameraZ;
  const depth = Math.max(0.25, -z);
  const x = (p[0] * focal) / depth / aspect;
  const y = (p[1] * focal) / depth;
  const clipZ = ((far + near) / (near - far)) + (2 * far * near) / ((near - far) * z);
  return { x, y, z: clipZ, size: focal / depth };
}

function makeParticles(count: number): Particle[] {
  return Array.from({ length: count }, (_, i) => {
    const side: -1 | 1 = i % 2 === 0 ? -1 : 1;
    const theta = i * 2.399963;
    const band = ((i * 17) % 100) / 100;
    const radius = 0.18 + band * 0.72;
    return {
      base: [
        side * (0.10 + radius * (0.42 + 0.16 * Math.sin(theta * 0.7))),
        Math.cos(theta * 0.53) * (0.18 + radius * 0.55),
        Math.sin(theta * 0.71) * (0.30 + radius * 0.52),
      ],
      side,
      phase: theta,
      size: 0.65 + ((i * 13) % 9) / 12,
    };
  });
}

export function ManifestationField({ stage }: { stage: ManifestationStage }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reduced = usePrefersReducedMotion();
  const [available, setAvailable] = useState<boolean | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext("webgl", {
      antialias: true,
      alpha: true,
      depth: true,
      powerPreference: "high-performance",
    });

    if (!gl) {
      setAvailable(false);
      return;
    }
    setAvailable(true);

    const vertex = gl.createShader(gl.VERTEX_SHADER);
    const fragment = gl.createShader(gl.FRAGMENT_SHADER);
    if (!vertex || !fragment) return;

    gl.shaderSource(
      vertex,
      `attribute vec3 aPosition;
       attribute float aSize;
       attribute float aAlpha;
       varying float vAlpha;
       void main(){
         gl_Position=vec4(aPosition,1.0);
         gl_PointSize=aSize;
         vAlpha=aAlpha;
       }`,
    );
    gl.compileShader(vertex);

    gl.shaderSource(
      fragment,
      `precision mediump float;
       uniform vec3 uTint;
       varying float vAlpha;
       void main(){
         vec2 p=gl_PointCoord-0.5;
         float d=dot(p,p);
         if(d>0.25) discard;
         float glow=1.0-smoothstep(0.015,0.25,d);
         gl_FragColor=vec4(uTint,glow*vAlpha);
       }`,
    );
    gl.compileShader(fragment);

    const program = gl.createProgram();
    if (!program) return;
    gl.attachShader(program, vertex);
    gl.attachShader(program, fragment);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return;

    const position = gl.getAttribLocation(program, "aPosition");
    const size = gl.getAttribLocation(program, "aSize");
    const alpha = gl.getAttribLocation(program, "aAlpha");
    const tint = gl.getUniformLocation(program, "uTint");
    const positionBuffer = gl.createBuffer();
    const sizeBuffer = gl.createBuffer();
    const alphaBuffer = gl.createBuffer();

    if (
      position < 0 ||
      size < 0 ||
      alpha < 0 ||
      !tint ||
      !positionBuffer ||
      !sizeBuffer ||
      !alphaBuffer
    ) return;

    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LEQUAL);

    const particleCount = window.innerWidth < 700 ? 150 : 300;
    const particles = makeParticles(particleCount);
    let frame = 0;
    const start = performance.now();

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, DPR_LIMIT);
      canvas.width = Math.max(1, Math.floor(rect.width * dpr));
      canvas.height = Math.max(1, Math.floor(rect.height * dpr));
      gl.viewport(0, 0, canvas.width, canvas.height);
    };

    resize();
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(canvas);

    const bind = (positions: Float32Array, sizes: Float32Array, alphas: Float32Array) => {
      gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
      gl.bufferData(gl.ARRAY_BUFFER, positions, gl.DYNAMIC_DRAW);
      gl.enableVertexAttribArray(position);
      gl.vertexAttribPointer(position, 3, gl.FLOAT, false, 0, 0);

      gl.bindBuffer(gl.ARRAY_BUFFER, sizeBuffer);
      gl.bufferData(gl.ARRAY_BUFFER, sizes, gl.DYNAMIC_DRAW);
      gl.enableVertexAttribArray(size);
      gl.vertexAttribPointer(size, 1, gl.FLOAT, false, 0, 0);

      gl.bindBuffer(gl.ARRAY_BUFFER, alphaBuffer);
      gl.bufferData(gl.ARRAY_BUFFER, alphas, gl.DYNAMIC_DRAW);
      gl.enableVertexAttribArray(alpha);
      gl.vertexAttribPointer(alpha, 1, gl.FLOAT, false, 0, 0);
    };

    const drawPoints = (points: P2[], sizes: number[], alphas: number[], red = false) => {
      const positions = new Float32Array(points.flatMap((p) => [p.x, p.y, p.z]));
      bind(positions, new Float32Array(sizes), new Float32Array(alphas));
      gl.uniform3f(tint, red ? 0.78 : 0.93, red ? 0.05 : 0.93, red ? 0.08 : 0.93);
      gl.drawArrays(gl.POINTS, 0, points.length);
    };

    const drawLines = (pairs: Array<[P2, P2]>, opacity: number, red = false) => {
      if (!pairs.length) return;
      const positions: number[] = [];
      const alphas: number[] = [];
      for (const [a, b] of pairs) {
        positions.push(a.x, a.y, a.z, b.x, b.y, b.z);
        alphas.push(opacity, opacity);
      }
      bind(
        new Float32Array(positions),
        new Float32Array(new Array(pairs.length * 2).fill(1)),
        new Float32Array(alphas),
      );
      gl.uniform3f(tint, red ? 0.78 : 0.88, red ? 0.05 : 0.88, red ? 0.08 : 0.88);
      gl.drawArrays(gl.LINES, 0, pairs.length * 2);
    };

    const draw = (now: number) => {
      const time = reduced ? 0 : (now - start) * 0.001;
      const aspect = (canvas.clientWidth || 1) / (canvas.clientHeight || 1);
      const emergence = ease(stage / 1.25);
      const opposition = ease((stage - 1) / 2.2);
      const observerIn = ease((stage - 2.5) / 1.3);
      const recognition = ease((stage - 4) / 1.3);

      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
      gl.useProgram(program);

      const cameraZ = 3.65 - recognition * 0.38;
      const rx = reduced ? 0 : Math.sin(time * 0.11) * 0.07 * (1 - recognition);
      const ry = reduced ? 0 : Math.cos(time * 0.13) * 0.12 * (1 - recognition);
      const rz = reduced ? 0 : Math.sin(time * 0.07) * 0.025;
      const transform = (p: V3) => rotate(p, rx, ry, rz);
      const projectPoint = (p: V3) => project(transform(p), aspect, cameraZ, 1.58);

      const anchors = ANCHORS.map((base, i) => {
        const side = i < 6 ? -1 : 1;
        const phase = i * 0.73 + (side < 0 ? 0.2 : 1.7);
        const breath = reduced ? 0 : Math.sin(time * 0.95 + phase) * 0.055;
        const lift = reduced ? 0 : Math.sin(time * 0.51 + phase * 1.3) * 0.05;
        const depth = reduced ? 0 : Math.cos(time * 0.67 + phase) * 0.11;
        const sway = reduced ? 0 : Math.sin(time * 0.34 + phase) * 0.045;
        let p: V3 = [
          base[0] * (1 + breath) + sway * side,
          base[1] * (1 + breath) + lift,
          base[2] + depth,
        ];

        if (recognition > 0) {
          // The final geometry resolves into a balanced, recognizable identity field
          // without displaying or explaining its internal construction.
          const t = i / 5;
          const target: V3 = side < 0
            ? [-0.42 + t * 0.20, -0.56 + t * 1.05, 0]
            : [0.26 + Math.sin(t * Math.PI) * 0.30, 0.50 - t * 1.02, 0];
          p = [
            lerp(p[0], target[0], recognition * 0.82),
            lerp(p[1], target[1], recognition * 0.82),
            lerp(p[2], target[2], recognition * 0.82),
          ];
        }
        return p;
      });

      const projectedAnchors = anchors.map(projectPoint);
      const projectedParticles: P2[] = [];
      const particleSizes: number[] = [];
      const particleAlphas: number[] = [];
      const fieldBreath = reduced ? 1 : 1 + Math.sin(time * 0.58) * 0.06;

      for (let i = 0; i < particles.length; i++) {
        const q = particles[i];
        const local = reduced ? 0 : Math.sin(time * (0.70 + (i % 5) * 0.035) + q.phase) * 0.035;
        const pulse = reduced ? 1 : 1 + Math.sin(time * 1.08 + q.phase) * 0.08;
        const radial = (1 + local) * fieldBreath * (0.72 + emergence * 0.38);
        const driftX = reduced ? 0 : Math.sin(time * 0.27 + q.phase * 1.7) * 0.075 * opposition;
        const driftY = reduced ? 0 : Math.cos(time * 0.39 + q.phase) * 0.08 * opposition;
        const driftZ = reduced ? 0 : Math.sin(time * 0.33 + q.phase * 0.8) * 0.16 * opposition;
        let p: V3 = [
          q.base[0] * radial + driftX * q.side,
          q.base[1] * radial + driftY,
          q.base[2] * radial + driftZ,
        ];

        if (!reduced) p = [p[0], p[1] + Math.sin(time * 0.22 + q.phase * 0.33) * 0.04, p[2]];

        if (recognition > 0) {
          const target: V3 = [q.side * (0.22 + Math.abs(q.base[0]) * 0.34), q.base[1] * 0.68, q.base[2] * 0.10];
          p = [
            lerp(p[0], target[0], recognition * 0.48),
            lerp(p[1], target[1], recognition * 0.48),
            lerp(p[2], target[2], recognition * 0.48),
          ];
        }

        const projected = projectPoint(p);
        projectedParticles.push(projected);
        particleSizes.push(Math.max(0.65, (1.8 + q.size * 1.8) * projected.size * pulse));
        particleAlphas.push(0.018 + emergence * 0.105);
      }

      if (stage >= 1 && !reduced) {
        const ambientCount = window.innerWidth < 700 ? 70 : 130;
        const ambient: P2[] = [];
        const sizes: number[] = [];
        const alphas: number[] = [];
        for (let i = 0; i < ambientCount; i++) {
          const a = i * 2.399963;
          const radius = 1.05 + (((i * 37) % 100) / 100) * 1.2;
          const p: V3 = [
            Math.cos(a + time * 0.018) * radius,
            Math.sin(a * 1.31 + time * 0.015) * radius * 0.62,
            Math.sin(a * 0.77) * 1.05,
          ];
          const projected = projectPoint(p);
          ambient.push(projected);
          sizes.push(Math.max(0.4, 0.95 * projected.size));
          alphas.push(0.012 + emergence * 0.018);
        }
        drawPoints(ambient, sizes, alphas);
      }

      const structuralPairs: Array<[number, number]> = [
        [0, 1], [1, 2], [2, 3], [3, 4], [4, 5],
        [6, 7], [7, 8], [8, 9], [9, 10], [10, 11],
      ];
      if (stage >= 2) {
        const visiblePairs = structuralPairs.filter((_, i) => i / structuralPairs.length < clamp((stage - 1) * 1.25));
        drawLines(visiblePairs.map(([a, b]) => [projectedAnchors[a], projectedAnchors[b]]), 0.07 + opposition * 0.08);
      }

      if (stage >= 3) {
        drawLines(
          [[1, 7], [2, 8], [4, 10]].map(([a, b]) => [projectedAnchors[a], projectedAnchors[b]]),
          0.035 + opposition * 0.025,
        );
      }

      const observer: V3 = [
        OBSERVER[0] + (reduced ? 0 : Math.sin(time * 0.19) * 0.045),
        OBSERVER[1] + (reduced ? 0 : Math.cos(time * 0.17) * 0.045),
        OBSERVER[2] + (reduced ? 0 : Math.sin(time * 0.15) * 0.12),
      ];
      const projectedObserver = projectPoint(observer);

      if (stage >= 3) {
        drawLines(
          [
            [projectedObserver, projectedAnchors[2]],
            [projectedObserver, projectedAnchors[9]],
          ],
          0.04 + observerIn * 0.07,
        );
      }

      drawPoints(projectedParticles, particleSizes, particleAlphas);
      drawPoints(
        projectedAnchors,
        projectedAnchors.map((p, i) => Math.max(2.2, 4.1 * p.size) * (reduced ? 1 : 1 + Math.sin(time * 1.2 + i * 0.65) * 0.1)),
        projectedAnchors.map(() => 0.52 + recognition * 0.18),
      );
      drawPoints(
        [projectedObserver],
        [Math.max(4.5, 7.2 * projectedObserver.size)],
        [0.92],
        stage >= 5,
      );

      frame = requestAnimationFrame(draw);
    };

    frame = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(frame);
      resizeObserver.disconnect();
      gl.deleteBuffer(positionBuffer);
      gl.deleteBuffer(sizeBuffer);
      gl.deleteBuffer(alphaBuffer);
      gl.deleteProgram(program);
      gl.deleteShader(vertex);
      gl.deleteShader(fragment);
    };
  }, [stage, reduced]);

  if (available === false) return <FallbackField stage={stage} />;

  return (
    <div className="relative h-[min(82vh,52rem)] w-full max-w-[110rem]">
      <canvas ref={canvasRef} className="h-full w-full" aria-hidden="true" />
      <div className="sr-only">
        A living three-dimensional field gradually forms, develops opposing structures, establishes an external point of observation, and resolves into recognition.
      </div>
    </div>
  );
}

function FallbackField({ stage }: { stage: ManifestationStage }) {
  const scale = stage >= 4 ? 1.04 : stage >= 2 ? 1 : stage >= 1 ? 0.72 : 0.18;

  return (
    <div
      className="relative h-[min(82vh,52rem)] w-full max-w-[110rem] overflow-hidden"
      aria-hidden="true"
    >
      <svg
        viewBox="-100 -80 200 160"
        className="h-full w-full"
        style={{ transform: `scale(${scale})`, transition: "transform 2.2s ease-out" }}
      >
        {ANCHORS.map((p, i) => {
          const visible = i < 6 ? stage >= 1 : stage >= 2;
          return visible ? (
            <circle key={i} cx={p[0] * 62} cy={-p[1] * 52} r="2.1" fill="white" fillOpacity=".72" />
          ) : null;
        })}
        {stage >= 2 && structuralPairsFallback().map(([a, b], i) => {
          const pa = ANCHORS[a];
          const pb = ANCHORS[b];
          return (
            <line
              key={`l-${i}`}
              x1={pa[0] * 62}
              y1={-pa[1] * 52}
              x2={pb[0] * 62}
              y2={-pb[1] * 52}
              stroke="white"
              strokeOpacity=".12"
            />
          );
        })}
        {stage >= 3 && (
          <>
            <line x1={OBSERVER[0] * 62} y1={-OBSERVER[1] * 52} x2={ANCHORS[2][0] * 62} y2={-ANCHORS[2][1] * 52} stroke="white" strokeOpacity=".10" />
            <line x1={OBSERVER[0] * 62} y1={-OBSERVER[1] * 52} x2={ANCHORS[9][0] * 62} y2={-ANCHORS[9][1] * 52} stroke="white" strokeOpacity=".10" />
          </>
        )}
        {stage >= 3 && (
          <circle
            cx={OBSERVER[0] * 62}
            cy={-OBSERVER[1] * 52}
            r="3.5"
            fill={stage >= 5 ? "#c1121f" : "white"}
            fillOpacity=".92"
          />
        )}
      </svg>
    </div>
  );
}

function structuralPairsFallback(): Array<[number, number]> {
  return [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [6, 7], [7, 8], [8, 9], [9, 10], [10, 11]];
}
