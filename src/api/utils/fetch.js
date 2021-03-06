import "isomorphic-fetch"
import {merge} from "lodash"

const defaultOptions = {
  method: "GET",
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  }
}

function handleError(response) {
  if (response.ok) return response
  else throw Object.assign(
    new Error(response.statusText),
    {response}
  )
}

function negotiateResponse(response) {
  return response.json()
}

const APIFetch = (url, options = {}) => {
  options = merge(
    {},
    defaultOptions,
    options
  )
  
  return fetch(url, options)
    .then(handleError)
    .then(negotiateResponse)
}

export default APIFetch
