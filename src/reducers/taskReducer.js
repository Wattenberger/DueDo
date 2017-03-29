import Immutable from "immutable"
import moment from "moment"
import {airtableDateFormat} from "api/airtableAPI"

const initialState = Immutable.Map({
  list: Immutable.List(),
  tasks: Immutable.List(),
  habits: Immutable.List(),
  bucketlist: Immutable.List(),
  tags: Immutable.List(),
  contexts: Immutable.List(),
  filters: Immutable.Map({
    Type: "task",
    Done: false,
  }),
  formId: null,
  form: Immutable.Map({
    Type: "task",
  })
})

function tasks(state = initialState, action) {
  switch (action.type) {
    case "REPLACE_TASKS":
      let tasks = action.tasks.filter(task => !task.fields.Type || task.fields.Type == "task")
      let habits = action.tasks.filter(task => task.fields.Type == "habit")
      let bucketlist = action.tasks.filter(task => task.fields.Type == "bucketlist")
      return state
        .set('list', action.tasks)
        .set('tasks', tasks)
        .set('habits', habits)
        .set('bucketlist', bucketlist)
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
