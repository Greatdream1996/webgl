export function initShader(gl, vsScource, fsScource) {
  // 创建webgl解析程序对象
  const program = gl.createProgram()
  // 加载顶点着色器
  const vertexShader = loadShader(gl, gl.VERTEX_SHADER, vsScource)
  // 加载片元着色器
  const fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fsScource)
  // 绑定到程序对象
  gl.attachShader(program, vertexShader)
  gl.attachShader(program, fragmentShader)
  // 链接上下文
  gl.linkProgram(program)
  // 启动程序对象
  gl.useProgram(program)
  // 挂载到上下文
  gl.program = program
  return program
}

function loadShader(gl, type, source) {
  // 根据着色器类型，建立着色器对象
  const shader = gl.createShader(type)

  gl.shaderSource(shader, source)
  // 编译着色器对象
  gl.compileShader(shader)
  return shader
}

// 获取webgl坐标
export function getPosByMouse({ clientX, clientY }, canvas) {
  const { left, top, width, height } = canvas.getBoundingClientRect()
  const [cssX, cssY] = [clientX - left, clientY - top]
  // 解决差异
  const [halfWidth, halfHeight] = [width / 2, height / 2]
  const [xBaseCenter, yBaseCenter] = [cssX - halfWidth, cssY - halfHeight]
  // 解决canvas Y轴差异
  const yBaseCenterTop = -yBaseCenter
  // 解决基底差异
  const [x, y] = [xBaseCenter / halfWidth, yBaseCenterTop / halfHeight]
  return { x, y }
}

export function glToCssPos({ x, y }, { width, height }) {
  const { halfWidth, halfHeight } = [width / 2, height / 2]
  return {
    x: x * halfWidth,
    y: -y * halfHeight
  }
}
