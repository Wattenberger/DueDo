import {createStore, applyMiddleware, combineReducers} from 'redux'
// import {combineReducers} from 'redux-immutablejs'
import {mapValues} from 'lodash'
import thunkMiddleware from 'redux-thunk'
import logger from 'redux-logger'
import promiseMiddleware from 'redux-promise'

import {default as app} from "reducers/appReducer"
import {default as modal} from "reducers/modalReducer"
import {default as panels} from "reducers/panelsReducer"
import {default as dayView} from "reducers/dayViewReducer"
import {default as photo} from "reducers/taskReducer"
import {default as tasks} from "reducers/taskReducer"
import {default as pomodoro} from "reducers/pomodoroReducer"
import {default as googleCalendar} from "reducers/googleCalendarReducer"
import {default as calendar} from "reducers/calendarReducer"

const functionsToJs = val => val && typeof val.toJS === "function"
  ? val.toJS()
  : val
const loggerMiddleware = logger({
  stateTransformer: state => mapValues(state, functionsToJs),
  predicate: (getState, action) => __DEV__,
  collapsed: true,
  duration: true,
  timestamp: false,
  diff: true,
})

const createStoreWithMiddleware = applyMiddleware(
  promiseMiddleware,
  thunkMiddleware,
  loggerMiddleware
)(createStore)

const rootReducer = combineReducers({
  app,
  modal,
  panels,
  dayView,
  photo,
  tasks,
  pomodoro,
  googleCalendar,
  calendar,
})

// create a Redux instance using the dispatcher function
export default function(initialState) {
  return createStoreWithMiddleware(rootReducer, initialState)
}
