import Immutable from "immutable"

const initialState = Immutable.Map({
  auth: Immutable.Map(),
  events: Immutable.List(),
})

function googleCalendar(state = initialState, action) {
  switch (action.type) {
    case "REPLACE_AUTH":
      return state.set('auth', action.auth)
    case "POPULATE_CALENDAR_EVENTS":
      return state.set('events', action.events)
    default:
      return state
  }
}

export default googleCalendar
