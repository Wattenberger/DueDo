import {GOOGLE_API_KEY as API_KEY} from "config/config"
import {GOOGLE_CLIENT_ID as CLIENT_ID} from "config/config"

const SCOPES = ["https://www.googleapis.com/auth/calendar.readonly"];

/*
* action types
*/

let POPULATE_CALENDAR_EVENTS = 'POPULATE_CALENDAR_EVENTS'
let REPLACE_AUTH = 'REPLACE_AUTH'

/*
* action creators
*/

var checkAuth = () => {
  if (!gapi.auth) {
    setTimeout(checkAuth, 400)
    return
  }
  gapi.auth.authorize({client_id: CLIENT_ID, scope: SCOPES, immediate: true});
  gapi.client.setApiKey(API_KEY);
}

checkAuth()

var loadCalendarApi = () => {
  gapi.client.load('calendar', 'v3', fetchEvents);
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
  gapi.client.setApiKey();
  var auth = await(gapi.auth.authorize(
    {
      'client_id': CLIENT_ID,
      'scope': SCOPES.join(' '),
      'immediate': true
    }, (authResult) => {
      if (authResult && !authResult.error) {
        loadCalendarApi();
      }
    }
  ))
  return { type: REPLACE_AUTH, auth: auth.access_token }
}
