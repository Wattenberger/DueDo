import Immutable from "immutable"

const initialState = Immutable.Map({
  open: null
})

function modal(state = initialState, action) {
  switch (action.type) {
    case "OPEN_MODAL":
      return state.set('open', action.id)
    case "CLOSE_MODAL":
      return state.set('open', null)
    default:
      return state
  }
}

export default modal
