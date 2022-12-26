import { initShader, getPosByMouse } from '@common/initShader'
import Poly from '@common/Poly'
import fragment from './glsl/fragment.glsl'
import vertex from './glsl/vertex.glsl'
// init canvas in webgl
const canvas = <HTMLCanvasElement>document.querySelector('#canvas')
canvas.width = window.innerWidth
canvas.height = window.innerHeight
const gl = canvas.getContext('webgl')

// 拿到顶点着色器和片元着色器文本
const vsScource = vertex
const fsScource = fragment

// 初始化着色器对象，实践glsl和js通信
const program = initShader(gl, vsScource, fsScource)

const u_FragColor = gl.getUniformLocation(program, 'u_FragColor')
gl.uniform4fv(u_FragColor, new Float32Array([1.0, 1.0, 0.0, 1.0]))

// 设置颜色
gl.clearColor(0, 0, 0, 1)
gl.clear(gl.COLOR_BUFFER_BIT)
const poly = new Poly({
  gl,
  vertices: [0.0, 0.2],
  types: ['POINTS', 'LINE_STRIP']
})

poly.draw()

canvas.addEventListener('mousedown', (event) => {
  const { x, y } = getPosByMouse(event, canvas)
  poly.addVertice(x, y)
  gl.clear(gl.COLOR_BUFFER_BIT)
  poly.draw()
})
