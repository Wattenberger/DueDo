/*
 * action types
 */

let CHANGE_PANEL = 'CHANGE_PANEL'

/*
 * action creators
 */

export function changePanel(side, panel) {
  return { type: CHANGE_PANEL, side, panel }
}
