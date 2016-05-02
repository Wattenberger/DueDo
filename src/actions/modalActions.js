/*
 * action types
 */

let OPEN_MODAL = 'OPEN_MODAL'
let CLOSE_MODAL = 'CLOSE_MODAL'

/*
 * action creators
 */

export async function openModal(id) {
  return { type: OPEN_MODAL, id }
}

export async function closeModal() {
  return { type: CLOSE_MODAL }
}
