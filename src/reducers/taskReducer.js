import Immutable from "immutable"

const initialState = Immutable.Map({
  list: Immutable.List(),
  habits: Immutable.List(),
  tags: Immutable.List(),
  contexts: Immutable.List(),
  filters: Immutable.Map({
    // Done: false
  }),
  formId: null,
  form: Immutable.Map()
})

function tasks(state = initialState, action) {
  switch (action.type) {
    case "REPLACE_TASKS":
      return state.set('list', action.tasks)
    case "REPLACE_HABITS":
      return state.set('habits', action.tags)
    case "REPLACE_TAGS":
      return state.set('tags', action.tags)
    case "REPLACE_CONTEXTS":
      return state.set('contexts', action.contexts)
    case "REPLACE_FORM":
      return state
        .set('form', Immutable.Map(action.fields))
        .set('formId', action.id)
    case "RESET_FORM":
      return state
        .set('form', initialState.get('form'))
        .set('formId', null)
    case "CHANGE_FILTER":
      return state.setIn(['filters', action.field], action.newVal)
    case "REMOVE_FILTER":
      return state.setIn(['filters', action.field], undefined)
    case "CHANGE_FORM_FIELD":
      return state.setIn(['form', action.field], action.newVal)
    default:
      return state
  }
}

export default tasks
