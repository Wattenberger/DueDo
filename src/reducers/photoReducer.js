const initialState = {
  photo: null
}

function photo(state = initialState, action) {
  switch (action.type) {
    case "SET_PHOTO":
      return Object.assign({}, state, {
        photo: action.photo
      })
    default:
      return state
  }
}

export default photo
