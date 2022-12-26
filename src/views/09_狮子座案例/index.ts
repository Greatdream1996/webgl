import { initShader, getPosByMouse, glToCssPos } from '@common/initShader'
import Compose from '@common/Compose'
import Track from '@common/Track'
import Poly from '@common/Poly'
import Sky from '@common/Sky'
import fragment from './glsl/fragment.glsl'
import vertex from './glsl/vertex.glsl'
// init canvas in webgl
const canvas = <HTMLCanvasElement>document.querySelector('#canvas')
canvas.width = window.innerWidth
canvas.height = window.innerHeight
const gl = canvas.getContext('webgl')
gl.enable(gl.BLEND)
gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA)

// 拿到顶点着色器和片元着色器文本
const vsScource = vertex
const fsScource = fragment

// 初始化着色器对象，实践glsl和js通信
initShader(gl, vsScource, fsScource)

// const u_FragColor = gl.getUniformLocation(program, 'u_FragColor')
// gl.uniform4fv(u_FragColor, new Float32Array([1.0, 1.0, 0.0, 1.0]))

// 设置颜色
gl.clearColor(0, 0, 0, 1)
gl.clear(gl.COLOR_BUFFER_BIT)

const sky = new Sky(gl)
const compose = new Compose()
let poly: null | any = null
// 鼠标划上的点
let point: { x: number; y: number } = null

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
      addVertice(x, y)
    } else {
      createPoly(x, y)
    }
  }
  render()
})
canvas.addEventListener('mousemove', (event) => {
  const { x, y } = getPosByMouse(event, canvas)
  point = hoverPoint(x, y)
  canvas.style.cursor = point ? 'pointer' : 'default'
  if (poly) {
    const obj = poly.geoData[poly.geoData.length - 1]
    obj.x = x
    obj.y = y
  }
})
function createPoly(x: number, y: number) {
  let o1: any = point ? point : { x, y, pointSize: random(), alpha: 1 }
  let o2: any = { x, y, pointSize: random(), alpha: 1 }
  poly = new Poly({
    size: 4,
    attrName: 'a_Attr',
    geoData: [o1, o2],
    types: ['POINTS', 'LINE_STRIP']
  })
  sky.add(poly)
  createTrack(o1)
  createTrack(o2)
}
function popVertice() {
  poly.geoData.pop()
  compose.children.pop()
  poly = null
}
// 鼠标划上某一个点
function hoverPoint(mx: number, my: number) {
  for (let { geoData } of sky.children) {
    for (let obj of geoData) {
      if (poly && obj === poly.geoData[poly.geoData.length - 1]) {
        continue
      }
      const delta = {
        x: mx - obj.x,
        y: my - obj.y
      }
      const { x, y } = glToCssPos(delta, canvas)
      const dist = x * x + y * y
      if (dist < 100) {
        return obj
      }
    }
  }
  return false
}
function addVertice(x: number, y: number) {
  const { geoData } = poly
  if (point) {
    geoData[geoData.length - 1] = point
  }
  let obj = { x, y, pointSize: random(), alpha: 1 }
  geoData.push(obj)
  createTrack(obj)
}
function createTrack(obj: any) {
  const { pointSize } = obj
  const track = new Track(obj)
  track.start = new Date()
  track.timeLen = 2000
  track.loop = true
  track.keyMap = new Map([
    [
      'pointSize',
      [
        [500, pointSize],
        [1000, 0],
        [1500, pointSize]
      ]
    ],
    [
      'alpha',
      [
        [500, 1],
        [1000, 0],
        [1500, 1]
      ]
    ]
  ])
  compose.add(track)
}
function random() {
  return Math.random() * 8.0 + 3.0
}
function render() {
  gl.clear(gl.COLOR_BUFFER_BIT)
  sky.draw()
}
function ani() {
  compose.update(new Date())
  sky.updateVertices(['x', 'y', 'pointSize', 'alpha'])
  render()
  requestAnimationFrame(ani)
}
ani()
