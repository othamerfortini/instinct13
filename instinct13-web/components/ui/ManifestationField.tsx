"use client";

import { useEffect, useRef, useState } from "react";
import { usePrefersReducedMotion } from "@/lib/motion/use-prefers-reduced-motion";

export type ManifestationStage = 0 | 1 | 2 | 3 | 4 | 5;

const LEFT = [
  [-0.7, -0.7, 0.1], [-0.7, -0.35, -0.1], [-0.7, 0, 0.05],
  [-0.7, 0.35, -0.05], [-0.7, 0.7, 0.12], [-0.45, 0.7, -0.12],
] as const;
const RIGHT = [
  [0.45, 0.7, 0.12], [0.7, 0.7, -0.12], [0.7, 0.35, 0.05],
  [0.45, 0, -0.05], [0.7, -0.35, 0.1], [0.7, -0.7, -0.08],
] as const;
const OBSERVER = [0, 0, 1.45] as const;
const DPR_LIMIT = 1.5;

function project(point: readonly [number, number, number], aspect: number) {
  const z = point[2] + 2.6;
  const perspective = 1.25 / z;
  return [point[0] * perspective * aspect * 1.7, point[1] * perspective * 1.7] as const;
}

function FallbackField({ stage }: { stage: ManifestationStage }) {
  const nodes = [...LEFT, ...RIGHT, OBSERVER];
  return (
    <svg viewBox="-100 -70 200 140" className="h-full w-full" aria-hidden="true">
      {stage >= 2 && nodes.slice(0, 12).map((_, i) => {
        const group = i < 6 ? 0 : 1;
        const visible = group === 0 ? stage >= 1 : stage >= 2;
        if (!visible || i === 0) return null;
        const prev = nodes[i - 1];
        const cur = nodes[i];
        if (i === 6) return null;
        return <line key={`l-${i}`} x1={prev[0] * 55} y1={prev[1] * 45} x2={cur[0] * 55} y2={cur[1] * 45} stroke="white" strokeOpacity=".2" strokeWidth=".6" />;
      })}
      {stage >= 3 && <line x1="0" y1="0" x2="0" y2="-52" stroke="white" strokeOpacity=".18" strokeWidth=".6" />}
      {nodes.map((p, i) => {
        const visible = i < 6 ? stage >= 1 : i < 12 ? stage >= 2 : stage >= 3;
        if (!visible) return null;
        return <circle key={i} cx={p[0] * 55} cy={p[1] * 45} r={i === 12 ? 2.2 : 1.4} fill={i === 12 && stage >= 5 ? "#c1121f" : "white"} fillOpacity={i === 12 ? ".95" : ".75"} />;
      })}
      {stage >= 5 && <text x="0" y="7" textAnchor="middle" fill="white" fontSize="28" fontWeight="300" letterSpacing="-2">13</text>}
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
    const gl = canvas.getContext("webgl", { antialias: true, alpha: true });
    if (!gl) {
      setWebglAvailable(false);
      return;
    }
    setWebglAvailable(true);

    const vertexShader = gl.createShader(gl.VERTEX_SHADER);
    const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
    if (!vertexShader || !fragmentShader) return;
    gl.shaderSource(vertexShader, `attribute vec3 position; uniform float pointSize; void main(){gl_Position=vec4(position,1.0); gl_PointSize=pointSize;}`);
    gl.compileShader(vertexShader);
    gl.shaderSource(fragmentShader, `precision mediump float; uniform vec4 color; void main(){vec2 p=gl_PointCoord-vec2(.5); if(dot(p,p)>.25) discard; gl_FragColor=color;}`);
    gl.compileShader(fragmentShader);

    const program = gl.createProgram();
    if (!program) return;
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return;

    const position = gl.getAttribLocation(program, "position");
    const pointSize = gl.getUniformLocation(program, "pointSize");
    const color = gl.getUniformLocation(program, "color");
    const buffer = gl.createBuffer();
    if (!buffer || position < 0 || !pointSize || !color) return;

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

    const draw = (now: number) => {
      const elapsed = reducedMotion ? 0 : (now - start) * 0.00035;
      const aspect = (canvas.clientWidth || 1) / (canvas.clientHeight || 1);
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.useProgram(program);

      const nodes: Array<{ p: readonly [number, number, number]; active: boolean; observer?: boolean }> = [];
      LEFT.forEach((p) => nodes.push({ p, active: stage >= 1 }));
      RIGHT.forEach((p) => nodes.push({ p, active: stage >= 2 }));
      nodes.push({ p: OBSERVER, active: stage >= 3, observer: true });

      const positions: Array<readonly [number, number]> = [];
      nodes.forEach((node, i) => {
        if (!node.active) return;
        let p = node.p;
        if (stage >= 5 && !node.observer) {
          const target = i < 6
            ? [-0.38, (i - 2.5) * 0.27, 0]
            : [0.25 + 0.22 * Math.cos((i - 6) * 1.15), (i - 8.5) * 0.27, 0];
          p = [p[0] + (target[0] - p[0]) * 0.82, p[1] + (target[1] - p[1]) * 0.82, p[2] * 0.18];
        }
        const breathe = reducedMotion ? 0 : Math.sin(elapsed * 2.1 + i * 0.7) * 0.025;
        const rotated: [number, number, number] = [
          p[0] * Math.cos(elapsed * 0.5) - p[2] * Math.sin(elapsed * 0.5),
          p[1] + breathe,
          p[0] * Math.sin(elapsed * 0.5) + p[2] * Math.cos(elapsed * 0.5),
        ];
        positions.push(project(rotated, aspect));
      });

      const drawLine = (a: readonly [number, number], b: readonly [number, number], alpha: number) => {
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([a[0], a[1], 0, b[0], b[1], 0]), gl.STREAM_DRAW);
        gl.enableVertexAttribArray(position);
        gl.vertexAttribPointer(position, 3, gl.FLOAT, false, 0, 0);
        gl.uniform4f(color, 0.92, 0.92, 0.92, alpha);
        gl.uniform1f(pointSize, 1);
        gl.drawArrays(gl.LINES, 0, 2);
      };

      const pairs = stage >= 4
        ? [[0,1],[1,2],[2,3],[3,4],[4,5],[6,7],[7,8],[8,9],[9,10],[10,11],[5,6]]
        : [[0,1],[1,2],[2,3],[3,4],[4,5],[6,7],[7,8],[8,9],[9,10],[10,11]];
      pairs.forEach(([a,b]) => positions[a] && positions[b] && drawLine(positions[a], positions[b], stage >= 5 ? 0.42 : 0.2));
      if (stage >= 3 && positions[12]) {
        [stage >= 4 ? 5 : 2, stage >= 4 ? 6 : 9].forEach((target) => positions[target] && drawLine(positions[12], positions[target], stage >= 5 ? 0.28 : 0.12));
      }

      positions.forEach((p, i) => {
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([p[0], p[1], 0]), gl.STREAM_DRAW);
        gl.enableVertexAttribArray(position);
        gl.vertexAttribPointer(position, 3, gl.FLOAT, false, 0, 0);
        const observer = i === 12;
        const red = stage >= 5 && observer;
        gl.uniform4f(color, red ? 0.76 : 0.96, red ? 0.07 : 0.96, red ? 0.12 : 0.96, observer ? 0.95 : 0.78);
        gl.uniform1f(pointSize, observer ? 7 : 4);
        gl.drawArrays(gl.POINTS, 0, 1);
      });
      frame = requestAnimationFrame(draw);
    };

    frame = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(frame);
      resizeObserver.disconnect();
      gl.deleteBuffer(buffer);
      gl.deleteProgram(program);
      gl.deleteShader(vertexShader);
      gl.deleteShader(fragmentShader);
    };
  }, [stage, reducedMotion]);

  return (
    <div className="relative h-[min(68vh,40rem)] w-full max-w-5xl" aria-hidden="true">
      {webglAvailable !== false && <canvas ref={canvasRef} className="h-full w-full" />}
      {webglAvailable === false && <FallbackField stage={stage} />}
      {stage >= 5 && webglAvailable !== false && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <span className="text-[clamp(5rem,18vw,12rem)] font-light tracking-[-0.08em] text-white/90">13</span>
        </div>
      )}
    </div>
  );
}
