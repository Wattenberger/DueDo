import moment from "moment"

/*
 * action types
 */

let SET_DAY = 'SET_DAY'
let INCREMENT_DAY = 'INCREMENT_DAY'
let SET_WEEK = 'SET_WEEK'
let INCREMENT_WEEK = 'INCREMENT_WEEK'
let SET_MONTH = 'SET_MONTH'
let INCREMENT_MONTH = 'INCREMENT_MONTH'

/*
 * action creators
 */

 export const setDay         = day    => ({ type: SET_DAY,         day })
 export const incrementDay   = change => ({ type: INCREMENT_DAY,   change })
 export const setWeek        = week   => ({ type: SET_WEEK,        week })
 export const incrementWeek  = change => ({ type: INCREMENT_WEEK,  change })
 export const setMonth       = month  => ({ type: SET_MONTH,       month })
 export const incrementMonth = change => ({ type: INCREMENT_MONTH, change })
