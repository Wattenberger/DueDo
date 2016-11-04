import moment from "moment"
import Immutable from "immutable"

const initialState = Immutable.Map({
  day: Immutable.Map(moment())
})

function dayView(state = initialState, action) {
  switch (action.type) {
    case "CHANGE_DAY":
      return state.set('day', Immutable.Map(action.day))
    default:
      return state
  }
}

export default dayView
