/*
 * action types
 */

let START_POMODORO = 'START_POMODORO'
let CLEAR_POMODORO = 'CLEAR_POMODORO'

/*
 * action creators
 */

export async function startPomodoro(taskId) {
  return { type: START_POMODORO, id: taskId }
}

export async function clearPomodoro() {
  return { type: CLEAR_POMODORO }
}
