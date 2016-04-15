const initialState = {
  list: [],
  habits: [],
  tags: [],
  contexts: []
}

function tasks(state = initialState, action) {
  switch (action.type) {
    case "REPLACE_TASKS":
      return Object.assign({}, state, {
        list: action.tasks
      })
    case "REPLACE_HABITS":
      return Object.assign({}, state, {
        habits: action.tags
      })
    case "REPLACE_TAGS":
      return Object.assign({}, state, {
        tags: action.tags
      })
    case "REPLACE_CONTEXTS":
      return Object.assign({}, state, {
        contexts: action.contexts
      })
    default:
      return state
  }
}

export default tasks
