"use client";

import { useEffect, useRef, useState } from "react";
import { usePrefersReducedMotion } from "@/lib/motion/use-prefers-reduced-motion";

export type ManifestationStage = 0 | 1 | 2 | 3 | 4 | 5;
type V3 = [number, number, number];

type Particle = {
  base: V3;
  velocity: V3;
  side: -1 | 1;
  phase: number;
  size: number;
};

const ANCHORS: V3[] = [
  [-0.76,-0.60,0.05],[-0.84,-0.18,-0.18],[-0.78,0.25,0.10],[-0.62,0.57,-0.12],[-0.38,0.76,0.08],[-0.22,0.38,-0.24],
  [0.22,0.38,0.24],[0.38,0.76,-0.08],[0.62,0.57,0.14],[0.78,0.25,-0.16],[0.84,-0.18,0.06],[0.76,-0.60,-0.14],
];
const OBSERVER: V3 = [0.04,0.96,1.85];
const DPR_LIMIT = 1.4;
const clamp = (v:number,a=0,b=1) => Math.min(b,Math.max(a,v));
const ease = (v:number) => { const t=clamp(v); return t*t*(3-2*t); };
const lerp = (a:number,b:number,t:number) => a+(b-a)*t;

function project(p:V3, aspect:number, camera:V3, focal:number): [number,number,number] {
  const x=p[0]-camera[0], y=p[1]-camera[1], z=p[2]-camera[2];
  const depth=Math.max(.38,-z);
  const scale=focal/depth;
  return [x*scale/aspect,y*scale,depth];
}

function makeParticles(count:number): Particle[] {
  const particles:Particle[]=[];
  for(let i=0;i<count;i++){
    const side:i extends never ? never : -1|1 = i%2===0?-1:1;
    const u=(i+1)/(count+1);
    const theta=i*2.399963;
    const band=((i*17)%100)/100;
    const radius=.16+band*.66;
    const x=side*(.08+radius*(.44+.14*Math.sin(theta*.7)));
    const y=Math.cos(theta*.53)*(.18+radius*.52)+(u-.5)*.2;
    const z=Math.sin(theta*.71)*(.34+radius*.48);
    particles.push({base:[x,y,z],velocity:[0,0,0],side,phase:theta,size:.7+((i*13)%9)/12});
  }
  return particles;
}

export function ManifestationField({stage}:{stage:ManifestationStage}){
  const canvasRef=useRef<HTMLCanvasElement>(null);
  const reduced=usePrefersReducedMotion();
  const [available,setAvailable]=useState<boolean|null>(null);

  useEffect(()=>{
    const canvas=canvasRef.current;if(!canvas)return;
    const gl=canvas.getContext("webgl",{antialias:true,alpha:true,powerPreference:"high-performance"});
    if(!gl){setAvailable(false);return;} setAvailable(true);

    const vs=gl.createShader(gl.VERTEX_SHADER),fs=gl.createShader(gl.FRAGMENT_SHADER);if(!vs||!fs)return;
    gl.shaderSource(vs,`attribute vec3 position;attribute float pointSize;attribute float alpha;varying float vAlpha;void main(){gl_Position=vec4(position,1.0);gl_PointSize=pointSize;vAlpha=alpha;}`);gl.compileShader(vs);
    gl.shaderSource(fs,`precision mediump float;uniform vec3 tint;varying float vAlpha;void main(){vec2 p=gl_PointCoord-.5;float d=dot(p,p);if(d>.25)discard;float glow=1.-smoothstep(.02,.25,d);gl_FragColor=vec4(tint,glow*vAlpha);}`);gl.compileShader(fs);
    const program=gl.createProgram();if(!program)return;gl.attachShader(program,vs);gl.attachShader(program,fs);gl.linkProgram(program);if(!gl.getProgramParameter(program,gl.LINK_STATUS))return;
    const position=gl.getAttribLocation(program,"position"),pointSize=gl.getAttribLocation(program,"pointSize"),alpha=gl.getAttribLocation(program,"alpha"),tint=gl.getUniformLocation(program,"tint");
    const pb=gl.createBuffer(),sb=gl.createBuffer(),ab=gl.createBuffer();if(!pb||!sb||!ab||position<0||pointSize<0||alpha<0||!tint)return;

    const count=window.innerWidth<700?180:360;
    const particles=makeParticles(count);
    let frame=0;const start=performance.now();
    const resize=()=>{const r=canvas.getBoundingClientRect(),dpr=Math.min(window.devicePixelRatio||1,DPR_LIMIT);canvas.width=Math.max(1,Math.floor(r.width*dpr));canvas.height=Math.max(1,Math.floor(r.height*dpr));gl.viewport(0,0,canvas.width,canvas.height)};
    resize();const ro=new ResizeObserver(resize);ro.observe(canvas);

    const bind=(positions:Float32Array,sizes:Float32Array,alphas:Float32Array)=>{
      gl.bindBuffer(gl.ARRAY_BUFFER,pb);gl.bufferData(gl.ARRAY_BUFFER,positions,gl.DYNAMIC_DRAW);gl.enableVertexAttribArray(position);gl.vertexAttribPointer(position,3,gl.FLOAT,false,0,0);
      gl.bindBuffer(gl.ARRAY_BUFFER,sb);gl.bufferData(gl.ARRAY_BUFFER,sizes,gl.DYNAMIC_DRAW);gl.enableVertexAttribArray(pointSize);gl.vertexAttribPointer(pointSize,1,gl.FLOAT,false,0,0);
      gl.bindBuffer(gl.ARRAY_BUFFER,ab);gl.bufferData(gl.ARRAY_BUFFER,alphas,gl.DYNAMIC_DRAW);gl.enableVertexAttribArray(alpha);gl.vertexAttribPointer(alpha,1,gl.FLOAT,false,0,0);
    };
    const drawPoints=(pts:[number,number,number][],sizes:number[],alphas:number[],red=false)=>{bind(new Float32Array(pts.flatMap(p=>[p[0],p[1],0])),new Float32Array(sizes),new Float32Array(alphas));gl.uniform3f(tint,red?.76:.92,red?.05:.92,red?.08:.92);gl.drawArrays(gl.POINTS,0,pts.length)};
    const drawLine=(a:[number,number,number],b:[number,number,number],opacity:number,red=false)=>{bind(new Float32Array([a[0],a[1],0,b[0],b[1],0]),new Float32Array([1,1]),new Float32Array([1,1]));gl.uniform3f(tint,red?.76:.88,red?.05:.88,red?.08:.88);gl.drawArrays(gl.LINES,0,2);gl.uniform3f(tint,red?.76:.76,red?.05:.76,red?.08:.76)};

    const draw=(now:number)=>{
      const time=reduced?0:(now-start)*.001;
      const aspect=(canvas.clientWidth||1)/(canvas.clientHeight||1);
      const emergence=ease(stage/1.2), opposition=ease((stage-1)/2), observerIn=ease((stage-2.5)/1.5), recognition=ease(stage-4);
      gl.clearColor(0,0,0,0);gl.clear(gl.COLOR_BUFFER_BIT);gl.useProgram(program);

      // The camera breathes with the field instead of orbiting like a product render.
      const camera:V3=[reduced?0:Math.sin(time*.12)*.11*(1-recognition),reduced?0:Math.cos(time*.16)*.07*(1-recognition),3.35-recognition*.32];
      const focal=1.56;
      const anchors=ANCHORS.map((base,i)=>{
        const side=i<6?-1:1;
        const phase=i*.73+(side<0?.2:1.7);
        const breath=reduced?0:Math.sin(time*1.05+phase)*.065;
        const lift=reduced?0:Math.sin(time*.57+phase*1.3)*.045;
        const depth=reduced?0:Math.cos(time*.71+phase)*.09;
        const sway=reduced?0:Math.sin(time*.37+phase)*.045;
        let p:V3=[base[0]*(1+breath)+sway*side,base[1]*(1+breath)+lift,base[2]+depth];
        if(recognition>0){const target:V3=side<0?[-.30-(i-2.5)*.035,(i-2.5)*.27,-.02]:[.30+(i-8.5)*.035,(i-8.5)*.27,-.02];p=[lerp(p[0],target[0],recognition*.72),lerp(p[1],target[1],recognition*.72),lerp(p[2],target[2],recognition*.72)]}
        return p;
      });

      const projectedAnchors=anchors.map(p=>project(p,aspect,camera,focal));
      const projectedParticles:[number,number,number][]=[];
      const particleSizes:number[]=[];const particleAlphas:number[]=[];
      const fieldBreath=reduced?1:1+Math.sin(time*.62)*.055;
      for(let i=0;i<particles.length;i++){
        const q=particles[i];const side=q.side;
        const local=reduced?0:Math.sin(time*(.72+(i%5)*.035)+q.phase)*.035;
        const pulse=reduced?1:1+Math.sin(time*1.12+q.phase)*.07;
        const radial=(1+local)*fieldBreath*(.76+emergence*.34);
        const driftX=reduced?0:Math.sin(time*.29+q.phase*1.7)*.06*opposition;
        const driftY=reduced?0:Math.cos(time*.41+q.phase)*.07*opposition;
        const driftZ=reduced?0:Math.sin(time*.35+q.phase*.8)*.13*opposition;
        let p:V3=[q.base[0]*radial+driftX*side,q.base[1]*radial+driftY,q.base[2]*radial+driftZ];
        // The field gently migrates upward/downward instead of looping on a single plane.
        if(!reduced)p=[p[0],p[1]+Math.sin(time*.24+q.phase*.33)*.035,p[2]];
        if(recognition>0){const target:V3=[side*(.22+Math.abs(q.base[0])*.34),q.base[1]*.72,q.base[2]*.12];p=[lerp(p[0],target[0],recognition*.58),lerp(p[1],target[1],recognition*.58),lerp(p[2],target[2],recognition*.58)]}
        const pp=project(p,aspect,camera,focal);projectedParticles.push(pp);particleSizes.push(Math.max(.8,(2.0+q.size*1.7)/pp[2]*pulse));particleAlphas.push(.035+emergence*.10);
      }

      // Ambient matter makes the space feel inhabited, not like a diagram.
      if(stage>=1&&!reduced){
        const ambientCount=window.innerWidth<700?90:170;const pts:[number,number,number][]=[];const ss:number[]=[];const aa:number[]=[];
        for(let i=0;i<ambientCount;i++){
          const a=i*2.399963;const radius=1.05+((i*37)%100)/100*1.15;
          const p:V3=[Math.cos(a+time*.018)*radius,Math.sin(a*1.31+time*.015)*radius*.62,Math.sin(a*.77)*1.05];const pp=project(p,aspect,camera,focal);pts.push(pp);ss.push(Math.max(.45,1.25/pp[2]));aa.push(.018+emergence*.018);
        }
        drawPoints(pts,ss,aa);
      }

      const internal=[[0,1],[1,2],[2,3],[3,4],[4,5],[6,7],[7,8],[8,9],[9,10],[10,11]] as const;
      internal.forEach(([a,b],i)=>{if(stage>=2&&i/10<clamp((stage-1)*1.4))drawLine(projectedAnchors[a],projectedAnchors[b],.08+opposition*.08)});
      if(stage>=3){[[1,7],[2,8],[4,10]].forEach(([a,b],i)=>drawLine(projectedAnchors[a],projectedAnchors[b],.035+opposition*.025*(i+1)));}
      if(stage>=4)drawLine(projectedAnchors[5],projectedAnchors[6],.06+recognition*.10);

      const observer:V3=[OBSERVER[0]+(reduced?0:Math.sin(time*.22)*.045),OBSERVER[1]+(reduced?0:Math.cos(time*.19)*.04),OBSERVER[2]+(reduced?0:Math.sin(time*.17)*.12)];
      const po=project(observer,aspect,camera,focal);
      if(stage>=3){drawLine(po,projectedAnchors[2],.05+observerIn*.08);drawLine(po,projectedAnchors[9],.05+observerIn*.08);}

      drawPoints(projectedParticles,particleSizes,particleAlphas);
      const anchorSizes=projectedAnchors.map((p,i)=>Math.max(2.2,4.2/p[2])*(reduced?1:1+Math.sin(time*1.25+i*.65)*.10));
      drawPoints(projectedAnchors,anchorSizes,projectedAnchors.map(()=>.56+recognition*.18));
      drawPoints([po],[8+recognition*2],[.92],stage>=5);

      frame=requestAnimationFrame(draw);
    };
    frame=requestAnimationFrame(draw);
    return()=>{cancelAnimationFrame(frame);ro.disconnect();gl.deleteBuffer(pb);gl.deleteBuffer(sb);gl.deleteBuffer(ab);gl.deleteProgram(program);gl.deleteShader(vs);gl.deleteShader(fs)};
  },[stage,reduced]);

  if(available===false)return <FallbackField stage={stage}/>;
  return <div className="relative h-[min(82vh,52rem)] w-full max-w-[110rem]"><canvas ref={canvasRef} className="h-full w-full" aria-hidden="true"/><div className="sr-only">A living three-dimensional field gradually forms and reveals relationships before recognition.</div></div>;
}

function FallbackField({stage}:{stage:ManifestationStage}){
  const scale=stage>=4?1.04:stage>=2?1:stage>=1?.72:.18;
  return <div className="relative h-[min(82vh,52rem)] w-full max-w-[110rem] overflow-hidden" aria-hidden="true"><svg viewBox="-100 -80 200 160" className="h-full w-full" style={{transform:`scale(${scale})`,transition:"transform 2.2s ease-out"}}>{ANCHORS.map((p,i)=>{const visible=i<6?stage>=1:stage>=2;return visible?<circle key={i} cx={p[0]*62} cy={-p[1]*52} r="2.1" fill="white" fillOpacity=".72"/>:null})}{stage>=2&&[0,1,2,3,4,6,7,8,9,10].map(i=>{const j=i===4?5:i===10?11:i+1;const a=ANCHORS[i],b=ANCHORS[j];return <line key={`l-${i}`} x1={a[0]*62} y1={-a[1]*52} x2={b[0]*62} y2={-b[1]*52} stroke="white" strokeOpacity=".12"/>})}{stage>=3&&<><line x1={OBSERVER[0]*62} y1={-OBSERVER[1]*52} x2={ANCHORS[2][0]*62} y2={-ANCHORS[2][1]*52} stroke="white" strokeOpacity=".10"/><line x1={OBSERVER[0]*62} y1={-OBSERVER[1]*52} x2={ANCHORS[9][0]*62} y2={-ANCHORS[9][1]*52} stroke="white" strokeOpacity=".10"/></>}{stage>=3&&<circle cx={OBSERVER[0]*62} cy={-OBSERVER[1]*52} r="3.5" fill={stage>=5?"#c1121f":"white"} fillOpacity=".92"/>}</svg></div>;
}
