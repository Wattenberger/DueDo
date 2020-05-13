import fetch from "./utils/fetch"
import {AIRTABLE_API_KEY as API_KEY} from "config/config"

const API_ROOT = "https://api.airtable.com/v0/appH29Y5RCA1Jczh7"
export const airtableDateFormat = "YYYY-MM-DD"
const params = {
  api_key: API_KEY
}
const expandParams = params => Object.keys(params).map(key => key + "=" + encodeURIComponent(params[key])).join("&")

const searchNextPage = (res, url, params, tasks=[], tries=0) => {
  tasks = _.concat(tasks, res.records)
  tries++;
  console.log(res, tries)
  if (res.offset && tries < 5) {
    params = _.clone(params)
    params.offset = res.offset
    return fetch(`${API_ROOT}/tasks?${expandParams(params)}`)
      .then(res => searchNextPage(res, url, params, tasks, tries))
  } else {
    res.records = tasks
    return res
  }
}

const airtableAPI = {
  fetchTasks(extraParameters={}) {
    const url = `${API_ROOT}/tasks?${expandParams(_.assign({}, params, extraParameters))}`
    return fetch(url)
      .then(res => searchNextPage(res, url, params))
  },
  fetchHabits() {
    return fetch(`${API_ROOT}/habits?${expandParams(params)}`)
  },
  fetchTags() {
    return fetch(`${API_ROOT}/tags?${expandParams(params)}`)
  },
  fetchContexts() {
    return fetch(`${API_ROOT}/contexts?${expandParams(params)}`)
  },
  fetchProjects() {
    return fetch(`${API_ROOT}/projects?${expandParams(params)}`)
  },
  createTask(fields) {
    return fetch(`${API_ROOT}/Tasks?${expandParams(params)}`, {
      method: "POST",
      body: JSON.stringify({fields})
    })
  },
  updateTask(taskId, fields) {
    return fetch(`${API_ROOT}/Tasks/${taskId}?${expandParams(params)}`, {
      method: "PATCH",
      body: JSON.stringify({fields})
    })
  },
  deleteTask(taskId) {
    return fetch(`${API_ROOT}/Tasks/${taskId}?${expandParams(params)}`, {
      method: "DELETE"
    })
  },
  createNewOption(slug, name) {
    return fetch(`${API_ROOT}/${slug}?${expandParams(params)}`, {
      method: "POST",
      body: JSON.stringify({fields: {Name: name}})
    })
  },
}

export default airtableAPI
