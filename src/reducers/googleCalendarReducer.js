import Immutable from "immutable"
import moment from "moment"

const separateOngoingEvents = events => {
  let ongoing = []
  let oneDay = []
  events.forEach(event => {
    let start = moment(event.start.date || event.start.dateTime, "YYYY-MM-DD")
    let end = moment(event.end.date || event.end.dateTime, "YYYY-MM-DD")
    if (start.isSame(end)) {
        oneDay.push(event)
    } else {
        ongoing.push(event)
    }
  })
  return {ongoing, oneDay}
}

const initialState = Immutable.Map({
  auth: Immutable.Map(),
  events: Immutable.List(),
  ongoing: Immutable.List(),
})

function googleCalendar(state = initialState, action) {
  switch (action.type) {
    case "REPLACE_AUTH":
      return state.set('auth', action.auth)
    case "CLEAR_CALENDAR_EVENTS":
      return state
        .set('events', initialState.events)
        .set('ongoing', initialState.ongoing)
    case "POPULATE_CALENDAR_EVENTS":
      let newEvents = separateOngoingEvents(action.events)
      const events = [
        ...(state.events || []).filter(d => d.calendarId == calendarId),
        ...(newEvents.oneDay || []).map(d => ({...d, calendarId: action.calendarId}))
      ]
      const ongoing = [
        ...(state.ongoing || []).filter(d => d.calendarId == calendarId),
        ...(newEvents.ongoing || []).map(d => ({...d, calendarId: action.calendarId}))
      ]
      return state
        .set('events', events)
        .set('ongoing', ongoing)
    case "ADD_CALENDAR_EVENTS":
      let additionalEvents = separateOngoingEvents(action.events)
      return state
        .set('events', additionalEvents.oneDay)
        .set('ongoing', additionalEvents.ongoing)
    default:
      return state
  }
}

export default googleCalendar
