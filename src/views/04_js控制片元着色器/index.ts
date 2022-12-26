import { initShader } from '@common/initShader'
import fragment from './glsl/fragment.glsl'
import vertex from './glsl/vertex.glsl'
// init canvas in webgl
const canvas = document.querySelector('#canvas') as HTMLElementExpansion
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

// 建立glsl顶点着色器与js变量连接
const a_Position = gl.getAttribLocation(gl.program, 'a_Position')
const a_PointSize = gl.getAttribLocation(gl.program, 'a_PointSize')
// 建立glsl片元着色器与js变量链接
const u_FragColor = gl.getUniformLocation(gl.program, 'u_FragColor')

// 设置颜色
gl.clearColor(0, 0, 0, 1)

// 顶点集合
const a_points: any[] = []

render()

// 鼠标点击事件 获取点击当前canvas中webgl的位置，将canvas坐标转换成webgl坐标
canvas.addEventListener('click', ({ clientX, clientY }) => {
  const { left, top, width, height } = canvas.getBoundingClientRect()
  const [cssX, cssY] = [clientX - left, clientY - top]
  // 解决差异
  const [halfWidth, halfHeight] = [width / 2, height / 2]
  const [xBaseCenter, yBaseCenter] = [cssX - halfWidth, cssY - halfHeight]
  // 解决canvas Y轴差异
  const yBaseCenterTop = -yBaseCenter
  // 解决基底差异
  const [x, y] = [xBaseCenter / halfWidth, yBaseCenterTop / halfHeight]
  const size = Math.random() * 50 + 10
  a_points.push({ x, y, size, color: { r: Math.random(), g: Math.random(), b: Math.random(), a: 1.0 } })
  render()
})
// 渲染函数
function render() {
  gl.clear(gl.COLOR_BUFFER_BIT)
  a_points.forEach(({ x, y, size, color: { r, g, b, a } }) => {
    gl.vertexAttrib2f(a_Position, x, y)
    gl.vertexAttrib1f(a_PointSize, size)
    const arr = new Float32Array([r, g, b, a])
    gl.uniform4fv(u_FragColor, arr)
    gl.drawArrays(gl.POINTS, 0, 1)
  })
}
