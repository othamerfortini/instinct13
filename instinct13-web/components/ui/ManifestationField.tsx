"use client";

import { useEffect, useRef, useState } from "react";
import { usePrefersReducedMotion } from "@/lib/motion/use-prefers-reduced-motion";

export type ManifestationStage = 0 | 1 | 2 | 3 | 4 | 5;

type Point = [number, number, number];

const LEFT: Point[] = [
  [-0.70, -0.70, 0.10], [-0.70, -0.35, -0.10], [-0.70, 0, 0.05],
  [-0.70, 0.35, -0.05], [-0.70, 0.70, 0.12], [-0.45, 0.70, -0.12],
];
const RIGHT: Point[] = [
  [0.45, 0.70, 0.12], [0.70, 0.70, -0.12], [0.70, 0.35, 0.05],
  [0.45, 0, -0.05], [0.70, -0.35, 0.10], [0.70, -0.70, -0.08],
];
const OBSERVER: Point = [0, 0, 1.45];
const DPR_LIMIT = 1.35;
const ease = (t: number) => t * t * (3 - 2 * t);
const lerp = (a: Point, b: Point, t: number): Point => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t];

function project(p: Point, aspect: number, cameraZ: number, cameraX: number, cameraY: number) {
  const z = p[2] + cameraZ;
  const scale = 1.35 / Math.max(0.65, z);
  return [p[0] * scale * aspect * 1.55 + cameraX, p[1] * scale * 1.55 + cameraY] as const;
}

function FallbackField({ stage }: { stage: ManifestationStage }) {
  const nodes = [...LEFT, ...RIGHT, OBSERVER];
  return (
    <svg viewBox="-100 -70 200 140" className="h-full w-full" aria-hidden="true">
      {stage >= 2 && nodes.slice(0, 12).map((_, i) => {
        if (i === 0 || i === 6) return null;
        const previous = nodes[i - 1];
        const current = nodes[i];
        return <line key={`l-${i}`} x1={previous[0] * 55} y1={previous[1] * 45} x2={current[0] * 55} y2={current[1] * 45} stroke="white" strokeOpacity=".18" strokeWidth=".6" />;
      })}
      {stage >= 4 && <line x1={LEFT[5][0] * 55} y1={LEFT[5][1] * 45} x2={RIGHT[0][0] * 55} y2={RIGHT[0][1] * 45} stroke="white" strokeOpacity=".18" strokeWidth=".6" />}
      {stage >= 3 && <><line x1="0" y1="0" x2={LEFT[2][0] * 55} y2={LEFT[2][1] * 45} stroke="white" strokeOpacity=".12" /><line x1="0" y1="0" x2={RIGHT[3][0] * 55} y2={RIGHT[3][1] * 45} stroke="white" strokeOpacity=".12" /></>}
      {nodes.map((p, i) => {
        const visible = i < 6 ? stage >= 1 : i < 12 ? stage >= 2 : stage >= 3;
        if (!visible) return null;
        const observer = i === 12;
        return <circle key={i} cx={p[0] * 55} cy={p[1] * 45} r={observer ? 2.3 : 1.4} fill={observer && stage >= 5 ? "#c1121f" : "white"} fillOpacity={observer ? ".95" : ".75"} />;
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
    const gl = canvas.getContext("webgl", { antialias: true, alpha: true, powerPreference: "high-performance" });
    if (!gl) { setWebglAvailable(false); return; }
    setWebglAvailable(true);

    const vs = gl.createShader(gl.VERTEX_SHADER);
    const fs = gl.createShader(gl.FRAGMENT_SHADER);
    if (!vs || !fs) return;
    gl.shaderSource(vs, `attribute vec3 position; uniform float pointSize; void main(){gl_Position=vec4(position,1.0);gl_PointSize=pointSize;}`);
    gl.compileShader(vs);
    gl.shaderSource(fs, `precision mediump float; uniform vec4 color; void main(){vec2 p=gl_PointCoord-vec2(.5);if(dot(p,p)>.25)discard;gl_FragColor=color;}`);
    gl.compileShader(fs);
    const program = gl.createProgram();
    if (!program) return;
    gl.attachShader(program, vs); gl.attachShader(program, fs); gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return;
    const position = gl.getAttribLocation(program, "position");
    const pointSize = gl.getUniformLocation(program, "pointSize");
    const color = gl.getUniformLocation(program, "color");
    const buffer = gl.createBuffer();
    if (!buffer || position < 0 || !pointSize || !color) return;

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

    const draw = (now: number) => {
      const time = reducedMotion ? 0 : (now - started) * 0.00024;
      const aspect = (canvas.clientWidth || 1) / (canvas.clientHeight || 1);
      const observerIn = ease(Math.min(1, Math.max(0, (stage - 2.5) / 1.2)));
      const recognition = ease(Math.min(1, Math.max(0, stage - 4)));
      const cameraZ = 3.0 - recognition * 0.45;
      const cameraX = Math.sin(time * 0.65) * 0.018 * (1 - recognition);
      const cameraY = Math.cos(time * 0.52) * 0.012 * (1 - recognition);

      gl.clearColor(0, 0, 0, 0); gl.clear(gl.COLOR_BUFFER_BIT); gl.useProgram(program);
      const nodes: Array<{ p: Point; active: boolean; observer?: boolean }> = [];
      LEFT.forEach((p) => nodes.push({ p, active: stage >= 1 }));
      RIGHT.forEach((p) => nodes.push({ p, active: stage >= 2 }));
      nodes.push({ p: OBSERVER, active: stage >= 3, observer: true });

      const positions: Array<readonly [number, number]> = [];
      nodes.forEach((node, i) => {
        if (!node.active) return;
        let p = [...node.p] as Point;
        if (!node.observer && recognition > 0) {
          // The geometry itself resolves toward the identity. No HTML/SVG logo is overlaid.
          const target: Point = i < 6
            ? [-0.30 - 0.08 * Math.cos((i - 2.5) * 0.9), (i - 2.5) * 0.27, 0]
            : [0.30 + 0.08 * Math.cos((i - 7.5) * 0.9), (i - 7.5) * 0.27, 0];
          p = lerp(p, target, recognition * 0.9);
        }
        const breath = reducedMotion ? 0 : Math.sin(time * 2 + i * 0.65) * 0.014 * (1 - recognition * 0.6);
        p = [p[0], p[1] + breath, p[2]];
        positions.push(project(p, aspect, cameraZ, cameraX, cameraY));
      });

      const line = (a: readonly [number, number], b: readonly [number, number], alpha: number, red = false) => {
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([a[0], a[1], 0, b[0], b[1], 0]), gl.STREAM_DRAW);
        gl.enableVertexAttribArray(position); gl.vertexAttribPointer(position, 3, gl.FLOAT, false, 0, 0);
        gl.uniform4f(color, red ? 0.76 : 0.92, red ? 0.06 : 0.92, red ? 0.10 : 0.92, alpha);
        gl.uniform1f(pointSize, 1); gl.drawArrays(gl.LINES, 0, 2);
      };

      const internal = [[0,1],[1,2],[2,3],[3,4],[4,5],[6,7],[7,8],[8,9],[9,10],[10,11]] as const;
      internal.forEach(([a,b]) => { if (positions[a] && positions[b]) line(positions[a], positions[b], 0.11 + recognition * 0.13); });
      if (stage >= 4 && positions[5] && positions[6]) line(positions[5], positions[6], 0.10 + recognition * 0.16);
      if (stage >= 3 && positions[12]) {
        if (positions[2]) line(positions[12], positions[2], 0.07 + observerIn * 0.10);
        if (positions[9]) line(positions[12], positions[9], 0.07 + observerIn * 0.10);
      }

      positions.forEach((p, i) => {
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([p[0], p[1], 0]), gl.STREAM_DRAW);
        gl.enableVertexAttribArray(position); gl.vertexAttribPointer(position, 3, gl.FLOAT, false, 0, 0);
        const observer = i === 12;
        const event = observer && stage >= 5;
        gl.uniform4f(color, event ? 0.76 : 0.95, event ? 0.06 : 0.95, event ? 0.10 : 0.95, observer ? 0.95 : 0.72);
        gl.uniform1f(pointSize, observer ? 6.5 + recognition * 1.5 : 3.4);
        gl.drawArrays(gl.POINTS, 0, 1);
      });
      frame = requestAnimationFrame(draw);
    };

    frame = requestAnimationFrame(draw);
    return () => { cancelAnimationFrame(frame); resizeObserver.disconnect(); gl.deleteBuffer(buffer); gl.deleteProgram(program); gl.deleteShader(vs); gl.deleteShader(fs); };
  }, [stage, reducedMotion]);

  return (
    <div className="relative h-[min(76vh,46rem)] w-full max-w-6xl" aria-hidden="true">
      {webglAvailable !== false && <canvas ref={canvasRef} className="h-full w-full" />}
      {webglAvailable === false && <FallbackField stage={stage} />}
    </div>
  );
}
