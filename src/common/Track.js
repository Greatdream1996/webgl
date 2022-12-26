// 时间轨对象
export default class Track {
  constructor(target) {
    this.target = target
    this.parent = null
    this.start = new Date()
    this.timeLen = 5
    this.loop = false
    this.keyMap = new Map()
  }
  update(t) {
    const { keyMap, timeLen, target, loop } = this
    // 当前时间
    let time = t - this.start
    if (loop) {
      time = time % timeLen
    }
    for (const [key, fms] of keyMap.entries()) {
      const last = fms.length - 1
      if (time < fms[0][0]) {
        target[key] = fms[0][1]
      } else if (time > fms[last][0]) {
        target[key] = fms[last][1]
      } else {
        target[key] = getValBetweenFms(time, fms, last)
      }
    }
  }
}

function getValBetweenFms(time, fms, last) {
  for (let i = 0; i < last; i++) {
    const fm1 = fms[i]
    const fm2 = fms[i + 1]
    if (time >= fms[0] && time <= fm2[0]) {
      const delta = {
        x: fm2[0] - fm1[0],
        y: fm2[1] - fm1[1]
      }
      const k = delta.y / delta.x
      const b = fm1[1] - fm1[0] * k
      return k * time + b
    }
  }
}