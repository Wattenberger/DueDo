import airtableAPI from "api/airtableAPI"

/*
 * action types
 */

let REPLACE_TASKS = 'REPLACE_TASKS'
let REPLACE_HABITS = 'REPLACE_HABITS'
let REPLACE_TAGS = 'REPLACE_TAGS'
let REPLACE_CONTEXTS = 'REPLACE_CONTEXTS'

let CREATE_TASK = 'CREATE_TASK'

/*
 * action creators
 */

export async function clearTasks() {
  return { type: REPLACE_TASKS, tasks: [] }
}

export function getTasks() {
  return async (dispatch, getState) => {
    dispatch(clearTasks())
    let res = await(airtableAPI.fetchTasks())
    dispatch({ type: REPLACE_TASKS, tasks: res.records })
  }
}

export async function getHabits() {
  let res = await(airtableAPI.fetchHabits())
  return { type: REPLACE_HABITS, habits: res.records }
}

export async function getTags() {
  let res = await(airtableAPI.fetchTags())
  var tags = {}
  res.records.map(tag => {
    tags[tag.id] = tag.fields.Name
  })
  return { type: REPLACE_TAGS, tags }
}

export async function getContexts() {
  let res = await(airtableAPI.fetchContexts())
  var contexts = {}
  res.records.map(context => {
    contexts[context.id] = context.fields.Name
  })
  return { type: REPLACE_CONTEXTS, contexts }
}

export function createTask(fields) {
  return async (dispatch, getState) => {
    dispatch(getTasks())
    let res = await(airtableAPI.createTask(fields))
    dispatch({ type: CREATE_TASK, fields })
  }
}
