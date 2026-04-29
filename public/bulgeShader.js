// bulgeShader.js

export async function initBulgeShaders(updateBtnSelector = null) {
  const targets = document.querySelectorAll('.bulge-target');
  if (!targets.length) return;

  targets.forEach(async (container, i) => {
    // Create a canvas for this target
    const canvas = document.createElement('canvas');
    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100vw';
    canvas.style.height = '100vh';
    canvas.style.pointerEvents = 'none';
    canvas.style.zIndex = '10';
    document.body.appendChild(canvas);

    const gl = canvas.getContext('webgl');

    function resize() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      gl.viewport(0, 0, canvas.width, canvas.height);
    }
    resize();
    window.addEventListener('resize', resize);

    const vertexSrc = `
      attribute vec2 a_pos;
      varying vec2 v_uv;
      void main() {
        v_uv = a_pos * 0.5 + 0.5;
        gl_Position = vec4(a_pos, 0, 1);
      }
    `;

    const fragmentSrc = `
      precision mediump float;
      uniform sampler2D u_texture;
      uniform vec2 u_scale;
      varying vec2 v_uv;
      void main() {
        vec2 uv = (v_uv - 0.5) / u_scale + 0.5;
        vec2 c = uv - 0.5;
        float d = length(c);
        vec2 dist = c * (1.0 + (d - 0.5) * 0.5) + 0.5;
        if (dist.x < 0.0 || dist.y < 0.0 || dist.x > 1.0 || dist.y > 1.0) discard;
        gl_FragColor = texture2D(u_texture, dist);
      }
    `;

    function compile(type, src) {
      const shader = gl.createShader(type);
      gl.shaderSource(shader, src);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS))
        console.error(gl.getShaderInfoLog(shader));
      return shader;
    }

    function createProgram(vsSrc, fsSrc) {
      const prog = gl.createProgram();
      gl.attachShader(prog, compile(gl.VERTEX_SHADER, vsSrc));
      gl.attachShader(prog, compile(gl.FRAGMENT_SHADER, fsSrc));
      gl.linkProgram(prog);
      if (!gl.getProgramParameter(prog, gl.LINK_STATUS))
        console.error(gl.getProgramInfoLog(prog));
      return prog;
    }

    const program = createProgram(vertexSrc, fragmentSrc);
    gl.useProgram(program);

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
      gl.STATIC_DRAW
    );

    const posLoc = gl.getAttribLocation(program, 'a_pos');
    gl.enableVertexAttribArray(posLoc);
    gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0);

    const texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

    const uScale = gl.getUniformLocation(program, 'u_scale');

    async function updateTexture() {
      const screenshot = await html2canvas(container, { backgroundColor: null });
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, screenshot);
      gl.uniform2f(uScale, screenshot.width / canvas.width, screenshot.height / canvas.height);
      render();
    }

    function render() {
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.drawArrays(gl.TRIANGLES, 0, 6);
    }

    updateTexture();

    if (updateBtnSelector) {
      const btn = document.querySelector(updateBtnSelector);
      if (btn) btn.onclick = updateTexture;
    }
  });
}
