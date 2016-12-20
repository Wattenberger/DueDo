import moment from "moment"

/*
 * action types
 */

let SET_WEEK = 'SET_WEEK'
let INCREMENT_WEEK = 'INCREMENT_WEEK'
let SET_MONTH = 'SET_MONTH'
let INCREMENT_MONTH = 'INCREMENT_MONTH'

/*
 * action creators
 */

 export function setWeek(week) {
   return { type: SET_WEEK, week }
 }

 export function incrementWeek(change) {
   return { type: INCREMENT_WEEK, change }
 }

 export function setMonth(month) {
   return { type: SET_MONTH, month }
 }

 export function incrementMonth(change) {
   return { type: INCREMENT_MONTH, change }
 }
