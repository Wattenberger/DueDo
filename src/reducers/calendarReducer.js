import Immutable from "immutable"
import moment from "moment"

export const monthFormat = "YYYY-MM"
export const weekFormat = "YYYY-W"

const initialState = Immutable.Map({
  month: moment().format(monthFormat),
  week: moment().format(weekFormat),
})

function calendar(state = initialState, action) {
  switch (action.type) {
    case "SET_WEEK":
      return state.set('week', action.week)
    case "INCREMENT_WEEK":
      if (isNaN(action.change)) return state
      let week = moment(state.get('week'), weekFormat)
                    .add(action.change, "weeks")
                    .format(weekFormat)
                    console.log(week)
      return state.set('week', week)
    case "SET_MONTH":
      return state.set('month', action.month)
    case "INCREMENT_MONTH":
      if (isNaN(action.change)) return state
      let month = moment(state.get('month'), monthFormat)
                    .add(action.change, "months")
                    .format(monthFormat)
      return state.set('month', month)
    default:
      return state
  }
}

export default calendar
