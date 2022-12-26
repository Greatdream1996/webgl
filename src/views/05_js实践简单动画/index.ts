import { initShader, getPosByMouse } from '@common/initShader'
import Compose from '@common/Compose'
import Track from '@common/Track'
import test from '@common/test'
import fragment from './glsl/fragment.glsl'
import vertex from './glsl/vertex.glsl' // init canvas in webgl
const canvas = document.querySelector('#canvas') as HTMLElementExpansion
canvas.width = window.innerWidth
canvas.height = window.innerHeight
const gl = canvas.getContext('webgl')
gl.enable(gl.BLEND)
gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA)
console.log(test)

// 拿到顶点着色器和片元着色器文本
const vsScource = vertex
const fsScource = fragment

// 初始化着色器对象，实践glsl和js通信
initShader(gl, vsScource, fsScource)

// 建立glsl顶点着色器与js变量连接
const a_Position = gl.getAttribLocation(gl.program, 'a_Position')
const a_PointSize = gl.getAttribLocation(gl.program, 'a_PointSize')
// 建立glsl片元着色器与js变量链接
const u_FragColor = gl.getUniformLocation(gl.program, 'u_FragColor')

// 设置颜色
gl.clearColor(0, 0, 0, 1)

const compose = new Compose()
const stars: any[] = []
render()
// 鼠标点击事件 获取点击当前canvas中webgl的位置，将canvas坐标转换成webgl坐标
canvas.addEventListener('click', (event) => {
  const { x, y } = getPosByMouse(event, canvas)

  const a = 1
  const s = Math.random() * 50 + 2
  const obj = { x, y, s, a, color: { r: Math.random(), g: Math.random(), b: Math.random(), a: 1.0 } }
  stars.push(obj)

  const track = new Track(obj)
  track.start = new Date()
  track.keyMap = new Map([
    [
      'a',
      [
        [500, a],
        [1000, 0],
        [1500, a]
      ]
    ]
  ])
  track.timeLen = 2000
  track.loop = true
  compose.add(track)
})
function ani() {
  compose.update(new Date())
  render()
  requestAnimationFrame(ani)
}
ani()
// 渲染函数
function render() {
  gl.clear(gl.COLOR_BUFFER_BIT)
  stars.forEach(({ x, y, s, a, color: { r, g, b } }) => {
    gl.vertexAttrib2f(a_Position, x, y)
    gl.vertexAttrib1f(a_PointSize, s)
    const arr = new Float32Array([r, g, b, a])
    gl.uniform4fv(u_FragColor, arr)
    gl.drawArrays(gl.POINTS, 0, 1)
  })
}
