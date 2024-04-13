let timer: NodeJS.Timeout

let sec = 0
let active = false

function startTimer(callback?: () => void) {
  active = true

  timer = setInterval(() => {
    sec++
    callback?.()
  }, 1000)
}

function stopTimer() {
  clearInterval(timer)
  sec = 0
  active = false
}

function getTime() {
  return sec
}

function isTimerActive() {
  return active
}

export { getTime, isTimerActive, startTimer, stopTimer }
