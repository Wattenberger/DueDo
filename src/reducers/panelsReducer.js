import moment from "moment"

export const panelsList = ["tasks", "addTask", "habits", "calendar", "day"]

const initialState = {
  left: "tasks",
  right: "addTask",
  day: moment()
}

function panels(state = initialState, action) {
  switch (action.type) {
    case "CHANGE_PANEL":
      return Object.assign({}, state, {
        [action.side]: action.panel
      })
    case "CHANGE_DAY":
      return Object.assign({}, state, {
        day: action.day
      })
    default:
      return state
  }
}

export default panels
