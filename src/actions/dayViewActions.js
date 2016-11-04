/*
 * action types
 */

let CHANGE_DAY = 'CHANGE_DAY'

/*
 * action creators
 */

export function changeDay(day) {
  return { type: CHANGE_DAY, day }
}
