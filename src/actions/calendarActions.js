import moment from "moment"
import {monthFormat} from "reducers/calendarReducer"

/*
 * action types
 */

let SET_MONTH = 'SET_MONTH'
let INCREMENT_MONTH = 'INCREMENT_MONTH'

/*
 * action creators
 */

 export function setMonth(month) {
   return { type: SET_MONTH, month }
 }

 export function incrementMonth(change) {
   return { type: INCREMENT_MONTH, change }
 }
