import Immutable from "immutable"
import moment from "moment"

export const monthFormat = "YYYY-MM"

const initialState = Immutable.Map({
  month: moment().format(monthFormat)
})

function calendar(state = initialState, action) {
  switch (action.type) {
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
