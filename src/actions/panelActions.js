/*
 * action types
 */

let CHANGE_PANEL = 'CHANGE_PANEL'
let CHANGE_DAY = 'CHANGE_DAY'

/*
 * action creators
 */

export function changePanel(side, panel) {
  return { type: CHANGE_PANEL, side, panel }
}

export function changeDay(day) {
  return { type: CHANGE_DAY, day }
}
