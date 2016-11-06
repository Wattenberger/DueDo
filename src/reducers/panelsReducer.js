import Immutable from "immutable"

export const panelsList = {
  left: ["calendar"],
  right: ["tasks"]
}

const initialState = Immutable.Map({
  left: "calendar",
  right: "tasks",
})

function panels(state = initialState, action) {
  switch (action.type) {
    case "CHANGE_PANEL":
      return state.set(action.side, action.panel)
    default:
      return state
  }
}

export default panels
