import fragment from './glsl/fragment.glsl'
import vertex from './glsl/vertex.glsl'

import { initShader } from '@common/initShader'
// init canvas in webgl
const canvas = document.querySelector('#canvas') as HTMLElementExpansion
canvas.width = window.innerWidth
canvas.height = window.innerHeight
const gl = canvas.getContext('webgl')

// 拿到顶点着色器和片元着色器文本
const vsScource = vertex
const fsScource = fragment

// 初始化着色器对象，实践glsl和js通信
initShader(gl, vsScource, fsScource)

// 建立glsl顶点着色器与js变量连接
const a_Position = gl.getAttribLocation(gl.program, 'a_Position')
// 更改glsl顶点位置
gl.vertexAttrib3f(a_Position, 0.0, 0.5, 0.0)
// 设置颜色
gl.clearColor(0, 0, 0, 1)
// 刷底色
gl.clear(gl.COLOR_BUFFER_BIT)
// 绘制
gl.drawArrays(gl.POINTS, 0, 1)

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

  // 开始绘制
  gl.vertexAttrib2f(a_Position, x, y)
  gl.clear(gl.COLOR_BUFFER_BIT)
  gl.drawArrays(gl.POINTS, 0, 1)
})
