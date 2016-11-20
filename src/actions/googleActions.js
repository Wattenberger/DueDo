import _ from "lodash"
import {GOOGLE_API_KEY as API_KEY} from "config/config"
import {GOOGLE_CLIENT_ID as CLIENT_ID} from "config/config"

const SCOPES = ["https://www.googleapis.com/auth/calendar.readonly"];
const needs = (req, func, run=()=>{}, timeout=1000) => {
  if(!req) {
    run()
    setTimeout(func, timeout)
  }
  return !!req
}
/*
* action types
*/

let POPULATE_CALENDAR_EVENTS = 'POPULATE_CALENDAR_EVENTS'
let REPLACE_AUTH = 'REPLACE_AUTH'

/*
* action creators
*/

// var checkAuth = () => {
//   if (!gapi.auth) {
//     setTimeout(checkAuth, 400)
//     return
//   }
//   gapi.auth.authorize({client_id: CLIENT_ID, scope: SCOPES, immediate: true});
//   gapi.client.setApiKey(API_KEY);
// }
//
// checkAuth()

var loadCalendarApi = () => {
  return new Promise(function(resolve, reject) {
    gapi.client.load('calendar', 'v3', res => resolve(res))
  })
}

var executeRequest = (req) => {
  return new Promise(function(resolve, reject) {
    req.execute(function(res) {
      var events = res.items || []
      resolve(events)
    })
  })
}

export async function fetchEvents() {
  if (!gapi.auth) {
    await auth()
  }
  if (!_.has(gapi, 'client.calendar.events')) {
    await loadCalendarApi()
  }

  var request = gapi.client.calendar.events.list({
    'calendarId': 'primary',
    'timeMin': (new Date()).toISOString(),
    'showDeleted': false,
    'singleEvents': true,
    'maxResults': 10,
    'orderBy': 'startTime'
  })

  var events = await(executeRequest(request))
  return { type: POPULATE_CALENDAR_EVENTS, events }
}

export async function auth() {
  if (!gapi.auth) {
    return setTimeout(auth, 1000)
  }
  gapi.auth.authorize({client_id: CLIENT_ID, scope: SCOPES, immediate: true});
  gapi.client.setApiKey(API_KEY);

  gapi.client.setApiKey();
  var auth = await(gapi.auth.authorize(
    {
      'client_id': CLIENT_ID,
      'scope': SCOPES.join(' '),
      'immediate': true
    }
  ))
  return { type: REPLACE_AUTH, auth: auth.access_token }
}
