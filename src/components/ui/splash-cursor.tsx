"use client";
import { useEffect, useRef } from "react";

// Add TypeScript interfaces
interface Material {
  vertexShader: WebGLShader;
  fragmentShaderSource: string;
  programs: Program[];
  activeProgram: WebGLProgram | null;
  uniforms: { [key: string]: WebGLUniformLocation };
  setKeywords(keywords: string[]): void;
  bind(): void;
}

interface Program {
  uniforms: { [key: string]: WebGLUniformLocation };
  program: WebGLProgram;
  bind(): void;
}

class MaterialImpl implements Material {
  vertexShader: WebGLShader;
  fragmentShaderSource: string;
  programs: Program[] = [];
  activeProgram: WebGLProgram | null = null;
  uniforms: { [key: string]: WebGLUniformLocation } = {};

  constructor(vertexShader: WebGLShader, fragmentShaderSource: string) {
    this.vertexShader = vertexShader;
    this.fragmentShaderSource = fragmentShaderSource;
  }

  setKeywords(keywords: string[]) {
    this.programs = [];
    keywords.forEach((keyword) => {
      const program = createProgram(this.vertexShader, compileShader(this.fragmentShaderSource, keyword));
      this.programs.push({
        program,
        uniforms: {},
        bind() {
          return;
        },
      });
    });
  }

  bind() {
    this.activeProgram = this.programs[0].program;
    return;
  }
}

class ProgramImpl implements Program {
  uniforms: { [key: string]: WebGLUniformLocation } = {};
  program: WebGLProgram;

  constructor(vertexShader: WebGLShader, fragmentShader: WebGLShader) {
    this.program = createProgram(vertexShader, fragmentShader);
    this.uniforms = {};
  }

  bind() {
    return;
  }
}

let gl: WebGL2RenderingContext | null = null;

function compileShader(shaderSource: string, keyword: string): WebGLShader {
  if (!gl) {
    throw new Error("WebGL context is not initialized.");
  }
  const fragmentShaderSource = keyword + shaderSource;
  const shader = gl.createShader(gl.FRAGMENT_SHADER);
  if (!shader) {
    throw new Error("Failed to create shader.");
  }
  gl.shaderSource(shader, fragmentShaderSource);
  gl.compileShader(shader);

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.log(gl.getShaderInfoLog(shader));
    throw new Error("Could not compile shader");
  }
  return shader;
}

function createMaterial(vertexShader: WebGLShader, fragmentShaderSource: string): Material {
  return new MaterialImpl(vertexShader, fragmentShaderSource);
}

function createProgram(vertexShader: WebGLShader, fragmentShader: WebGLShader): WebGLProgram {
  if (!gl) {
    throw new Error("WebGL context is not initialized.");
  }
  const program = gl.createProgram();
  if (!program) {
    throw new Error("Failed to create program.");
  }

  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);

  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.log(gl.getProgramInfoLog(program));
    throw new Error("Unable to initialize the shader program");
  }

  return program;
}

export function SplashCursor() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    gl = canvas.getContext("webgl2");
    if (!gl) {
      console.error("WebGL2 not supported");
      return;
    }

    let width = canvas.offsetWidth;
    let height = canvas.offsetHeight;
    canvas.width = width;
    canvas.height = height;
    gl.viewport(0, 0, width, height);

    const vs = `#version 300 es
      in vec4 a_position;
      void main() {
        gl_Position = a_position;
      }
    `;

    const fs = `#version 300 es
      precision highp float;
      out vec4 fragColor;
      uniform vec2 resolution;
      uniform vec2 mouse;
      float circle(vec2 uv, vec2 center, float radius) {
        float dist = length(uv - center);
        return smoothstep(radius, radius - 0.01, dist);
      }
      void main() {
        vec2 uv = gl_FragCoord.xy / resolution.xy;
        float c = circle(uv, mouse / resolution, 0.1);
        fragColor = vec4(c);
      }
    `;

    const vertexShader = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vertexShader, vs);
    gl.compileShader(vertexShader);

    if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
      console.error(gl.getShaderInfoLog(vertexShader));
    }

    const material = createMaterial(vertexShader, fs);
    material.setKeywords([""]);
    material.bind();

    const program = material.activeProgram;

    const positionAttributeLocation = gl.getAttribLocation(program, "a_position");
    const resolutionUniformLocation = gl.getUniformLocation(program, "resolution");
    const mouseUniformLocation = gl.getUniformLocation(program, "mouse");

    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

    const positions = [-1, -1, 1, -1, -1, 1, 1, 1];
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

    gl.vertexAttribPointer(positionAttributeLocation, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(positionAttributeLocation);

    gl.uniform2f(resolutionUniformLocation, width, height);

    const render = (time: number) => {
      gl.clearColor(0, 0, 0, 1);
      gl.clear(gl.COLOR_BUFFER_BIT);

      gl.uniform2f(mouseUniformLocation, mousePosition.x, height - mousePosition.y);

      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      requestAnimationFrame(render);
    };

    requestAnimationFrame(render);

    let mousePosition = { x: 0, y: 0 };

    const updateMousePosition = (event: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mousePosition = {
        x: event.clientX - rect.left,
        y: event.clientY - rect.top,
      };
    };

    window.addEventListener("mousemove", updateMousePosition);

    return () => {
      window.removeEventListener("mousemove", updateMousePosition);
      gl?.deleteProgram(program);
      gl?.deleteShader(vertexShader);
      gl?.deleteBuffer(positionBuffer);
      gl = null;
    };
  }, []);

  return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-50"></canvas>;
}
