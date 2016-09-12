import moment from "moment"
import Immutable from "immutable"

export const panelsList = {
  left: ["calendar", "day"],
  right: ["tasks", "habits"]
}

const initialState = Immutable.Map({
  left: "calendar",
  right: "tasks",
  day: Immutable.Map(moment())
})

function panels(state = initialState, action) {
  switch (action.type) {
    case "CHANGE_PANEL":
      return state.set(action.side, action.panel)
    case "CHANGE_DAY":
      return state.set('day', Immutable.Map(action.day))
    default:
      return state
  }
}

export default panels
