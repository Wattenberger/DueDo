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
    case "POPULATE_CALENDAR_EVENTS":
      let {ongoing, oneDay} = separateOngoingEvents(action.events)
      return state
        .set('events', oneDay)
        .set('ongoing', ongoing)
    default:
      return state
  }
}

export default googleCalendar
