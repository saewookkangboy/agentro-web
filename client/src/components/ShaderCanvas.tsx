import { useEffect, useRef } from "react";

export default function ShaderCanvas() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = ref.current; if (!canvas) return;
    const gl = canvas.getContext("webgl"); if (!gl) return;
    const vertex = gl.createShader(gl.VERTEX_SHADER)!; gl.shaderSource(vertex, `attribute vec2 p; void main(){gl_Position=vec4(p,0.,1.);}`); gl.compileShader(vertex);
    const fragment = gl.createShader(gl.FRAGMENT_SHADER)!; gl.shaderSource(fragment, `precision mediump float; uniform vec2 r; uniform float t; void main(){ vec2 uv=(gl_FragCoord.xy-.5*r)/r.y; float d=length(uv); float a=atan(uv.y,uv.x); float wave=sin(d*18.-t*1.1+a*3.)*.5+.5; vec3 c=mix(vec3(.02,.10,.08),vec3(.17,.55,.42),smoothstep(.05,.75,wave)); c+=vec3(.15,.35,.25)*smoothstep(.8,.05,d); gl_FragColor=vec4(c,1.); }`); gl.compileShader(fragment);
    const program = gl.createProgram()!; gl.attachShader(program, vertex); gl.attachShader(program, fragment); gl.linkProgram(program); gl.useProgram(program);
    const buffer = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, buffer); gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1,1,-1,-1,1,-1,1,1,-1,1,1]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(program, "p"); gl.enableVertexAttribArray(loc); gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
    const resolution = gl.getUniformLocation(program, "r"); const time = gl.getUniformLocation(program, "t"); let raf = 0; const start = performance.now();
    const resize = () => { const dpr = Math.min(window.devicePixelRatio, 2); canvas.width = canvas.clientWidth*dpr; canvas.height = canvas.clientHeight*dpr; gl.viewport(0,0,canvas.width,canvas.height); };
    const render = (now: number) => { gl.uniform2f(resolution, canvas.width, canvas.height); gl.uniform1f(time, (now-start)/1000); gl.drawArrays(gl.TRIANGLES,0,6); raf=requestAnimationFrame(render); };
    resize(); window.addEventListener("resize", resize); raf=requestAnimationFrame(render);
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", resize); };
  }, []);
  return <canvas ref={ref} aria-hidden="true" className="shader-canvas" />;
}
