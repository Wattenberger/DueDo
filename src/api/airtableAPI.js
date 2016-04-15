import fetch from "./utils/fetch"
import {AIRTABLE_API_KEY as API_KEY} from "config/config"

const API_ROOT = "https://api.airtable.com/v0/appH29Y5RCA1Jczh7"

const airtableAPI = {
  fetchTasks() {
    return fetch(`${API_ROOT}/tasks?api_key=${API_KEY}`)
  },
  fetchHabits() {
    return fetch(`${API_ROOT}/habits?api_key=${API_KEY}`)
  },
  fetchTags() {
    return fetch(`${API_ROOT}/tags?api_key=${API_KEY}`)
  },
  fetchContexts() {
    return fetch(`${API_ROOT}/contexts?api_key=${API_KEY}`)
  },
  createTask(fields) {
    return fetch(`${API_ROOT}/Tasks?api_key=${API_KEY}`, {
      method: "POST",
      body: JSON.stringify({fields})
    })
  },
}

export default airtableAPI
