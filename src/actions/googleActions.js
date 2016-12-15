import _ from "lodash"
import moment from "moment"
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

  let request = gapi.client.calendar.events.list({
    'calendarId': 'primary',
    'timeMax': moment().add(3, "month").format(),
    'timeMin': moment().add(-3, "month").format(),
    'showDeleted': false,
    'singleEvents': true,
    'maxResults': 100,
    'orderBy': 'startTime'
  })

  let events = await(executeRequest(request))
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
