import airtableAPI, {airtableDateFormat} from "api/airtableAPI"
import moment from "moment"
import _ from "lodash"
import {openModal, closeModal} from "actions/modalActions"

export const dateFormat = {
  form: airtableDateFormat,
  airtable: airtableDateFormat
}

/*
 * action types
 */

let REPLACE_TASKS = 'REPLACE_TASKS'
let REPLACE_HABITS = 'REPLACE_HABITS'
let REPLACE_TAGS = 'REPLACE_TAGS'
let REPLACE_CONTEXTS = 'REPLACE_CONTEXTS'

let CREATE_TASK = 'CREATE_TASK'
let DELETE_TASK = 'DELETE_TASK'
let FINISH_TASK = 'FINISH_TASK'
let UPDATE_TASK = 'UPDATE_TASK'

let REPLACE_FORM = 'REPLACE_FORM'
let RESET_FORM = 'RESET_FORM'
let CHANGE_FORM_FIELD = 'CHANGE_FORM_FIELD'
let SUBMIT_FORM = 'SUBMIT_FORM'

let CREATE_NEW_OPTION = 'CREATE_NEW_OPTION'

let CHANGE_FILTER = 'CHANGE_FILTER'
let REMOVE_FILTER = 'REMOVE_FILTER'

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
    let res = await(airtableAPI.createTask(fields))
    dispatch({ type: CREATE_TASK })
    dispatch(getTasks())
  }
}

export function updateTask(taskId, fields) {
  return async (dispatch, getState) => {
    let task = await(airtableAPI.updateTask(taskId, fields))
    dispatch(getTasks())
    dispatch({ type: UPDATE_TASK, taskId, fields })
  }
}

export function deleteTask(taskId) {
  return async (dispatch, getState) => {
    let res = await(airtableAPI.deleteTask(taskId))
    dispatch({ type: DELETE_TASK, taskId })
    dispatch(getTasks())
  }
}

export function finishTask(taskId) {
  return async (dispatch, getState) => {
    dispatch(updateTask(taskId, {Done: moment().format(dateFormat.airtable)}))
    dispatch({ type: FINISH_TASK, taskId })
  }
}

export function createNewOption(slug, name) {
  return async (dispatch, getState) => {
    let res = await(airtableAPI.createNewOption(slug, name))
    console.log(slug, name, res)
    dispatch({ type: CREATE_NEW_OPTION, name: res })
    return res
  }
}

export function addNewTask() {
  return async (dispatch, getState) => {
    dispatch(openModal("taskForm"))
    dispatch({ type: RESET_FORM })
  }
}

export function editTask(id, fields) {
  return async (dispatch, getState) => {
    dispatch({ type: REPLACE_FORM, id, fields })
    dispatch(openModal("taskForm"))
  }
}

export function changeFormField(field, newVal) {
  return { type: CHANGE_FORM_FIELD, field, newVal }
}

export function submitForm() {
  return async (dispatch, getState) => {

    const parseOptions = (slug, options, list) => {
      if (!options || _.isArray(options)) return
      return options.split(",").map(option => {
        return !list[option] ?
          dispatch(createNewOption(slug.toLowerCase(), option)).id :
          option
        })
    }

    let formFields = getState().tasks.get('form').toJS()
    let formId = getState().tasks.get('formId')
    let tags = getState().tasks.get('tags')
    let contexts = getState().tasks.get('contexts')
    formFields.Tags = parseOptions("Tags", formFields.Tags, tags)
    formFields.Contexts = parseOptions("Contexts", formFields.Contexts, contexts)
    if (formId) {
      dispatch(updateTask(formId, formFields))
    } else {
      dispatch(createTask(formFields))
    }
    dispatch(closeModal())

    dispatch({ type: SUBMIT_FORM })
  }
}

export function changeFilter(field, newVal) {
  return { type: CHANGE_FILTER, field, newVal }
}

export function removeFilter(field) {
  return { type: REMOVE_FILTER, field }
}
