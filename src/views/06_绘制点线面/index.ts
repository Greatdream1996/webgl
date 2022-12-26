import { initShader, getPosByMouse } from '@common/initShader'
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

// 建立glsl顶点着色器与js变量连接
const a_Position = gl.getAttribLocation(program, 'a_Position')

// 声明多个顶点数据
const vertices = [0.0, 0.2]
// 新建缓冲对象
const vertexBuffer = gl.createBuffer()
// 绑定缓冲对象
gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer)
// 向缓冲对象写入定点数据
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW)

// 修改glsl映射的变量
gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0)
// 增加批处理
gl.enableVertexAttribArray(a_Position)
// 设置颜色
gl.clearColor(0, 0, 0, 1)

gl.clear(gl.COLOR_BUFFER_BIT)

// 绘制点
gl.drawArrays(gl.POINTS, 0, 1)
// 绘制面
// gl.drawArrays(gl.TRIANGLES, 0, 3)
// 绘制线
// gl.drawArrays(gl.LINE_LOOP, 0, 4)

// 画点
setTimeout(() => {
  vertices.push(-0.4, -0.2)
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW)
  gl.clear(gl.COLOR_BUFFER_BIT)
  // 绘制点
  gl.drawArrays(gl.POINTS, 0, 2)
}, 1000)
// 画线
setTimeout(() => {
  gl.clear(gl.COLOR_BUFFER_BIT)
  // 绘制点
  gl.drawArrays(gl.POINTS, 0, 2)
  gl.drawArrays(gl.LINES, 0, 2)
}, 2000)

// 顶点集合
const a_points: any[] = []

// render()

// 鼠标点击事件 获取点击当前canvas中webgl的位置，将canvas坐标转换成webgl坐标
// canvas.addEventListener('click', (event) => {
//   const { x, y } = getPosByMouse(event, canvas)
//   const size = Math.random() * 50 + 10
//   a_points.push({ x, y, size })
//   render()
// })
// 渲染函数
function render() {
  gl.clear(gl.COLOR_BUFFER_BIT)
  a_points.forEach(({ x, y, size }) => {
    // gl.vertexAttrib2f(a_Position, x, y)
    gl.drawArrays(gl.POINTS, 0, 3)
  })
}
