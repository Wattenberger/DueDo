import airtableAPI, {airtableDateFormat} from "api/airtableAPI"
import moment from "moment"
import _ from "lodash"
import {openModal, closeModal} from "actions/modalActions"

const taskTableFields = ["Title", "Description", "Tags", "When", "Contexts", "Project", "Poms", "Blocked", "Important", "Done", "Type", "Habit--Done", "Habit--DOW"]
export const dateFormat = {
  form: airtableDateFormat,
  airtable: airtableDateFormat
}

/*
 * action types
 */

let REPLACE_TASKS = 'REPLACE_TASKS'
let REPLACE_TAGS = 'REPLACE_TAGS'
let REPLACE_CONTEXTS = 'REPLACE_CONTEXTS'
let REPLACE_PROJECTS = 'REPLACE_PROJECTS'

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

export function getTasks(type) {
  return async (dispatch, getState) => {
    // dispatch(clearTasks())
    const getPastDoneTasks = getState().tasks.get('filters').get('Done')
    const extraParameters = !!getPastDoneTasks ? {} : {filterByFormula: "OR(LEN(Done) = 0, DATETIME_DIFF(Done, TODAY(), 'days') > -31)"}
    let res = await(airtableAPI.fetchTasks(extraParameters))
    dispatch({ type: REPLACE_TASKS, tasks: res.records })
  }
}

export function updateTasks(tasks) {
  return async (dispatch, getState) => {
    let today = moment()
    tasks.forEach(task => {
      let inPast = !!task.fields.When && moment(task.fields.When, airtableDateFormat).add(1, "day").isBefore(today)
      if (inPast && !task.fields.Done) dispatch(updateTask(task.id, {When: null}))
    })
  }
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

export async function getProjects() {
  let res = await(airtableAPI.fetchProjects())
  var projects = {}
  res.records.map(project => {
    projects[project.id] = project.fields.Name
  })
  return { type: REPLACE_PROJECTS, projects }
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

export function finishTask(task, dayContext) {
  return async (dispatch, getState) => {
    let day = (dayContext || moment()).format(dateFormat.airtable)

    if (task.fields.Type == "habit") {
      dispatch(updateTask(task.id, {"Habit--Done": `${task.fields["Habit--Done"] + ',' || ""}${day}`}))
    } else {
      dispatch(updateTask(task.id, {Done: day}))
      dispatch({ type: FINISH_TASK, taskId: task.id })
    }
  }
}

export function createNewOption(slug, name) {
  return async (dispatch, getState) => {
    let res = await(airtableAPI.createNewOption(slug, name))
    dispatch({ type: CREATE_NEW_OPTION, name: res.fields.Name, id: res.id, field: slug })
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

    const parseOption = async (slug, option, list) => (
      !option      ? null :
      list[option] ? option :
        (await dispatch(createNewOption(slug.toLowerCase(), option))).id
    )

    const parseOptions = async (slug, options, list) => {
      if (!options) return
      options = await Promise.all(options.map(async (option, i) => {
        return parseOption(slug, option, list)
      }))
      return options
    }

    let formFields = getState().tasks.get('form').toJS()
    let formId = getState().tasks.get('formId')
    let tags = getState().tasks.get('tags')
    let contexts = getState().tasks.get('contexts')
    let projects = getState().tasks.get('projects')
    formFields.Tags = await parseOptions("Tags", formFields.Tags, tags)
    formFields.Contexts = await parseOptions("Contexts", formFields.Contexts, contexts)
    formFields.Project = [await parseOption("Projects", formFields.Project, projects)]
    if (formFields.Type == "habit") {
      formFields["When"] = null
    } else {
      formFields["Interval--Times"] = null
      formFields["Interval--Number"] = null
      formFields["Interval--Unit"] = null
    }
    Object.keys(formFields).forEach(key => {
      if (!_.includes(taskTableFields, key)) delete formFields[key]
    })

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
  return async (dispatch, getState) => {
    if (_.isUndefined(newVal) ||
        _.isNull(newVal) ||
        (_.isObject(newVal) && _.isEmpty(newVal))
    ) {
      dispatch(removeFilter(field))
      return
    }
    dispatch({ type: CHANGE_FILTER, field, newVal })
  }
}

export function removeFilter(field) {
  return { type: REMOVE_FILTER, field }
}
