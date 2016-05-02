import unsplashAPI from "api/unsplashAPI"

/*
 * action types
 */

let SET_PHOTO = 'FETCH_PHOTO'

/*
 * action creators
 */

export async function getPhoto() {
  let photo = unsplashAPI.fetchPhoto()
  return { type: SET_PHOTO, tasks: photo }
}
