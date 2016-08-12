import Immutable from "immutable"
import moment from "moment"

const initialState = Immutable.Map({
  start: null,
  end: null,
  length: 25,
  taskId: null
})

function pomodoro(state = initialState, action) {
  switch (action.type) {
    case "START_POMODORO":
      let now = moment()
      return state
            .set('start', now)
            .set('end', now.add(state.get('length'), 'm'))
            .set('taskId', action.id)
    case "CLEAR_POMODORO":
      return initialState
    default:
      return state
  }
}

export default pomodoro
