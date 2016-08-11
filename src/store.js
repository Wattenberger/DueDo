import {createStore, applyMiddleware, combineReducers} from 'redux'
// import {combineReducers} from 'redux-immutablejs'
import {mapValues} from 'lodash'
import thunkMiddleware from 'redux-thunk'
import logger from 'redux-logger'
import promiseMiddleware from 'redux-promise'

import {default as app} from "reducers/appReducer"
import {default as modal} from "reducers/modalReducer"
import {default as panels} from "reducers/panelsReducer"
import {default as photo} from "reducers/taskReducer"
import {default as tasks} from "reducers/taskReducer"
import {default as googleCalendar} from "reducers/googleCalendarReducer"

const loggerMiddleware = logger({
  stateTransformer: state => mapValues(state, val => val && typeof val.toJS === "function"
    ? val.toJS()
    : val
  ),
  predicate: (getState, action) => __DEV__
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
  photo,
  tasks,
  googleCalendar,
})

// create a Redux instance using the dispatcher function
export default function(initialState) {
  return createStoreWithMiddleware(rootReducer, initialState)
}
