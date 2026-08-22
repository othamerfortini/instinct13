"use client";

import { useEffect, useRef, useState } from "react";
import { usePrefersReducedMotion } from "@/lib/motion/use-prefers-reduced-motion";

export type ManifestationStage = 0 | 1 | 2 | 3 | 4 | 5;
type Point = [number, number, number];
type Projected = readonly [number, number, number];

// Twelve structural positions. They are deliberately asymmetric so the system
// feels discovered rather than like a pre-rendered icon.
const LEFT: Point[] = [
  [-0.78, -0.58, 0.05], [-0.84, -0.18, -0.22], [-0.79, 0.24, 0.12],
  [-0.62, 0.57, -0.16], [-0.35, 0.76, 0.10], [-0.22, 0.38, -0.28],
];
const RIGHT: Point[] = [
  [0.22, 0.38, 0.26], [0.36, 0.76, -0.08], [0.63, 0.57, 0.18],
  [0.80, 0.20, -0.20], [0.84, -0.24, 0.08], [0.72, -0.62, -0.18],
];

// The observer remains spatially outside the two poles.
const OBSERVER: Point = [0.02, 0.95, 1.85];

const DPR_LIMIT = 1.35;
const ease = (t: number) => t * t * (3 - 2 * t);
const clamp01 = (t: number) => Math.min(1, Math.max(0, t));
const lerp = (a: Point, b: Point, t: number): Point => [
  a[0] + (b[0] - a[0]) * t,
  a[1] + (b[1] - a[1]) * t,
  a[2] + (b[2] - a[2]) * t,
];

function project(p: Point, aspect: number, camera: Point, focal: number): Projected {
  const x = p[0] - camera[0];
  const y = p[1] - camera[1];
  const z = p[2] - camera[2];
  const depth = Math.max(0.45, -z);
  const scale = focal / depth;
  return [x * scale * aspect, y * scale, depth];
}

function FallbackField({ stage }: { stage: ManifestationStage }) {
  const nodes = [...LEFT, ...RIGHT, OBSERVER];
  return (
    <svg viewBox="-100 -80 200 160" className="h-full w-full" aria-hidden="true">
      {stage >= 2 && nodes.slice(0, 12).map((_, i) => {
        if (i === 0 || i === 6) return null;
        const a = nodes[i - 1];
        const b = nodes[i];
        return <line key={`l-${i}`} x1={a[0] * 55} y1={a[1] * 48} x2={b[0] * 55} y2={b[1] * 48} stroke="white" strokeOpacity=".16" strokeWidth=".7" />;
      })}
      {stage >= 4 && <line x1={LEFT[5][0] * 55} y1={LEFT[5][1] * 48} x2={RIGHT[0][0] * 55} y2={RIGHT[0][1] * 48} stroke="white" strokeOpacity=".18" strokeWidth=".7" />}
      {stage >= 3 && <>
        <line x1={OBSERVER[0] * 55} y1={OBSERVER[1] * 48} x2={LEFT[2][0] * 55} y2={LEFT[2][1] * 48} stroke="white" strokeOpacity=".11" />
        <line x1={OBSERVER[0] * 55} y1={OBSERVER[1] * 48} x2={RIGHT[3][0] * 55} y2={RIGHT[3][1] * 48} stroke="white" strokeOpacity=".11" />
      </>}
      {nodes.map((p, i) => {
        const visible = i < 6 ? stage >= 1 : i < 12 ? stage >= 2 : stage >= 3;
        if (!visible) return null;
        const observer = i === 12;
        return <circle key={i} cx={p[0] * 55} cy={p[1] * 48} r={observer ? 2.5 : 1.5} fill={observer && stage >= 5 ? "#c1121f" : "white"} fillOpacity={observer ? ".95" : ".72"} />;
      })}
    </svg>
  );
}

export function ManifestationField({ stage }: { stage: ManifestationStage }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reducedMotion = usePrefersReducedMotion();
  const [webglAvailable, setWebglAvailable] = useState<boolean | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext("webgl", {
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });
    if (!gl) {
      setWebglAvailable(false);
      return;
    }
    setWebglAvailable(true);

    const vs = gl.createShader(gl.VERTEX_SHADER);
    const fs = gl.createShader(gl.FRAGMENT_SHADER);
    if (!vs || !fs) return;

    gl.shaderSource(vs, `
      attribute vec3 position;
      attribute float pointSize;
      attribute float alpha;
      uniform vec4 tint;
      varying float vAlpha;
      void main(){
        gl_Position = vec4(position, 1.0);
        gl_PointSize = pointSize;
        vAlpha = alpha;
      }
    `);
    gl.compileShader(vs);

    gl.shaderSource(fs, `
      precision mediump float;
      uniform vec4 tint;
      varying float vAlpha;
      void main(){
        vec2 p = gl_PointCoord - vec2(.5);
        float d = dot(p,p);
        if(d > .25) discard;
        float glow = 1.0 - smoothstep(.0, .25, d);
        gl_FragColor = vec4(tint.rgb, tint.a * vAlpha * glow);
      }
    `);
    gl.compileShader(fs);

    const program = gl.createProgram();
    if (!program) return;
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return;

    const position = gl.getAttribLocation(program, "position");
    const pointSize = gl.getAttribLocation(program, "pointSize");
    const alpha = gl.getAttribLocation(program, "alpha");
    const tint = gl.getUniformLocation(program, "tint");
    const positionBuffer = gl.createBuffer();
    const sizeBuffer = gl.createBuffer();
    const alphaBuffer = gl.createBuffer();
    if (!positionBuffer || !sizeBuffer || !alphaBuffer || position < 0 || pointSize < 0 || alpha < 0 || !tint) return;

    let frame = 0;
    const started = performance.now();

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

    const drawPoints = (points: Projected[], sizes: number[], alphas: number[], red = false) => {
      gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(points.flatMap((p) => [p[0], p[1], 0])), gl.STREAM_DRAW);
      gl.enableVertexAttribArray(position);
      gl.vertexAttribPointer(position, 3, gl.FLOAT, false, 0, 0);

      gl.bindBuffer(gl.ARRAY_BUFFER, sizeBuffer);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(sizes), gl.STREAM_DRAW);
      gl.enableVertexAttribArray(pointSize);
      gl.vertexAttribPointer(pointSize, 1, gl.FLOAT, false, 0, 0);

      gl.bindBuffer(gl.ARRAY_BUFFER, alphaBuffer);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(alphas), gl.STREAM_DRAW);
      gl.enableVertexAttribArray(alpha);
      gl.vertexAttribPointer(alpha, 1, gl.FLOAT, false, 0, 0);

      gl.uniform4f(tint, red ? 0.76 : 0.94, red ? 0.06 : 0.94, red ? 0.10 : 0.94, 1);
      gl.drawArrays(gl.POINTS, 0, points.length);
    };

    const line = (a: Projected, b: Projected, opacity: number, red = false) => {
      gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([a[0], a[1], 0, b[0], b[1], 0]), gl.STREAM_DRAW);
      gl.enableVertexAttribArray(position);
      gl.vertexAttribPointer(position, 3, gl.FLOAT, false, 0, 0);

      gl.uniform4f(tint, red ? 0.76 : 0.90, red ? 0.06 : 0.90, red ? 0.10 : 0.90, opacity);
      gl.uniform1f(pointSize, 1);
      gl.uniform1f(alpha, 1);
      gl.drawArrays(gl.LINES, 0, 2);
    };

    const draw = (now: number) => {
      const elapsed = (now - started) * 0.001;
      const time = reducedMotion ? 0 : elapsed;
      const aspect = (canvas.clientWidth || 1) / (canvas.clientHeight || 1);

      // The field breathes continuously. Each pole has its own rhythm, so it never
      // looks like a single object scaling up and down as a UI animation.
      const emergence = ease(clamp01(stage));
      const opposition = ease(clamp01((stage - 1) / 2));
      const observerIn = ease(clamp01((stage - 2.5) / 1.5));
      const recognition = ease(clamp01(stage - 4));

      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.useProgram(program);

      // Very slow camera orbit creates real parallax between foreground and depth.
      const camera: Point = [
        reducedMotion ? 0 : Math.sin(time * 0.17) * 0.12 * (1 - recognition),
        reducedMotion ? 0 : Math.cos(time * 0.13) * 0.075 * (1 - recognition),
        3.15 - recognition * 0.38,
      ];
      const focal = 1.55;

      const structural: Point[] = [];
      [...LEFT, ...RIGHT].forEach((base, i) => {
        const left = i < 6;
        const pole = left ? -1 : 1;
        const localPhase = i * 0.73 + (left ? 0.35 : 1.8);
        const breath = reducedMotion ? 0 : Math.sin(time * 1.35 + localPhase) * 0.055;
        const verticalWave = reducedMotion ? 0 : Math.sin(time * 0.82 + localPhase * 1.4) * 0.035;
        const depthWave = reducedMotion ? 0 : Math.cos(time * 0.67 + localPhase) * 0.08;
        const poleBreath = 1 + breath + Math.sin(time * 0.58 + (left ? 0 : 1.7)) * 0.035;
        const driftX = Math.sin(time * 0.33 + localPhase) * 0.035 * opposition;
        const driftZ = Math.sin(time * 0.49 + localPhase) * 0.06 * opposition;

        let p: Point = [
          base[0] * poleBreath + driftX,
          base[1] * poleBreath + verticalWave,
          base[2] + depthWave + driftZ,
        ];

        // During recognition the geometry settles rather than snapping into a logo.
        if (recognition > 0) {
          const target: Point = left
            ? [-0.30 - 0.07 * Math.cos((i - 2.5) * 0.9), (i - 2.5) * 0.27, -0.02]
            : [0.30 + 0.07 * Math.cos((i - 7.5) * 0.9), (i - 7.5) * 0.27, -0.02];
          p = lerp(p, target, recognition * 0.72);
        }

        // Overall breathing adds a slow expansion/contraction to the complete field.
        const fieldPulse = 1 + (reducedMotion ? 0 : Math.sin(time * 0.48) * 0.045) * (0.5 + emergence);
        structural.push([p[0] * fieldPulse, p[1] * fieldPulse, p[2] * fieldPulse]);
      });

      const observer: Point = [
        OBSERVER[0] + (reducedMotion ? 0 : Math.sin(time * 0.31) * 0.035),
        OBSERVER[1] + (reducedMotion ? 0 : Math.cos(time * 0.27) * 0.035),
        OBSERVER[2] + (reducedMotion ? 0 : Math.sin(time * 0.22) * 0.10),
      ];

      const projected = structural.map((p) => project(p, aspect, camera, focal));
      const projectedObserver = project(observer, aspect, camera, focal);

      // Internal connections: each pole develops independently first.
      const internal = [[0,1],[1,2],[2,3],[3,4],[4,5],[6,7],[7,8],[8,9],[9,10],[10,11]] as const;
      internal.forEach(([a, b], i) => {
        if (!projected[a] || !projected[b]) return;
        const visibility = clamp01((stage - 1) * 1.6 - i * 0.08);
        if (visibility > 0) line(projected[a], projected[b], 0.045 + visibility * 0.13);
      });

      // A few cross-relations appear only after the opposition is established.
      if (stage >= 3) {
        const crossPairs = [[1,7],[2,8],[4,10]] as const;
        crossPairs.forEach(([a,b], i) => {
          if (projected[a] && projected[b]) line(projected[a], projected[b], 0.035 + opposition * (0.045 + i * 0.012));
        });
      }

      // The observer remains outside. It creates visibility of the relationship;
      // it never becomes a structural node of either pole.
      if (stage >= 3) {
        if (projected[2]) line(projectedObserver, projected[2], 0.045 + observerIn * 0.085);
        if (projected[9]) line(projectedObserver, projected[9], 0.045 + observerIn * 0.085);
      }

      if (stage >= 4 && projected[5] && projected[6]) {
        line(projected[5], projected[6], 0.055 + recognition * 0.13);
      }

      // A sparse ambient field gives the system a sense of surrounding space.
      // It is intentionally quiet and becomes more visible only after emergence.
      if (stage >= 1 && !reducedMotion) {
        const ambientCount = window.innerWidth < 700 ? 26 : 48;
        const ambient: Projected[] = [];
        const ambientSizes: number[] = [];
        const ambientAlpha: number[] = [];
        for (let i = 0; i < ambientCount; i += 1) {
          const a = i * 2.399 + 0.7;
          const radius = 1.15 + (i % 7) * 0.14;
          const p: Point = [
            Math.cos(a + time * 0.025) * radius,
            Math.sin(a * 1.37 + time * 0.02) * radius * 0.72,
            Math.sin(a * 0.83) * 0.85,
          ];
          const q = project(p, aspect, camera, focal);
          ambient.push(q);
          ambientSizes.push(Math.max(1.1, 2.2 / q[2]));
          ambientAlpha.push(0.025 + emergence * 0.045);
        }
        drawPoints(ambient, ambientSizes, ambientAlpha);
      }

      const sizes = projected.map((p, i) => {
        const observerNode = i === 12;
        const depthScale = Math.max(0.7, Math.min(1.8, 2.2 / p[2]));
        const pulse = reducedMotion ? 1 : 1 + Math.sin(time * 1.55 + i * 0.65) * 0.12;
        return (observerNode ? 7.0 : 3.2) * depthScale * pulse;
      });
      const alphas = projected.map((_, i) => i === 12 ? 0.94 : 0.58 + recognition * 0.16);
      drawPoints([...projected, projectedObserver], [...sizes, 8.0 + recognition * 2], [...alphas, 0.94], stage >= 5);

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
      gl.deleteShader(vs);
      gl.deleteShader(fs);
    };
  }, [stage, reducedMotion]);

  return (
    <div className="relative h-[min(76vh,46rem)] w-full max-w-6xl" aria-hidden="true">
      {webglAvailable !== false && <canvas ref={canvasRef} className="h-full w-full" />}
      {webglAvailable === false && <FallbackField stage={stage} />}
    </div>
  );
}
