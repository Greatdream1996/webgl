import { initShader, getPosByMouse } from '@common/initShader'
import Poly from '@common/Poly'
import Sky from '@common/Sky'
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

const sky = new Sky(gl)
let poly: null | Poly = null

// 取消鼠标右键默认事件
canvas.oncontextmenu = function () {
  return false
}
// poly.draw()

canvas.addEventListener('mousedown', (event) => {
  if (event.button === 2) {
    popVertice()
  } else {
    const { x, y } = getPosByMouse(event, canvas)
    if (poly) {
      poly.addVertice(x, y)
    } else {
      createPoly(x, y)
    }
  }
  render()
})
canvas.addEventListener('mousemove', (event) => {
  if (poly) {
    const { x, y } = getPosByMouse(event, canvas)
    poly.setVertice(poly.count - 1, x, y)
    render()
  }
})
function createPoly(x: number, y: number) {
  poly = new Poly({
    vertices: [x, y, x, y],
    types: ['POINTS', 'LINE_STRIP']
  })
  sky.add(poly)
}
function popVertice() {
  poly && poly.popVertice()
  poly = null
}
function render() {
  gl.clear(gl.COLOR_BUFFER_BIT)
  sky.draw()
}
