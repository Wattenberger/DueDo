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

export async function fetchEvents(calendarId="primary") {
  if (!gapi.auth) {
    await auth()
  }
  if (!_.has(gapi, 'client.calendar.events')) {
    await loadCalendarApi()
  }

  let request = gapi.client.calendar.events.list({
    'calendarId': calendarId,
    'timeMax': moment().add(2, "month").format(),
    'timeMin': moment().add(-2, "month").format(),
    'showDeleted': false,
    'singleEvents': true,
    'maxResults': 300,
    'orderBy': 'startTime'
  })

  let events = await(executeRequest(request))
  return { type: POPULATE_CALENDAR_EVENTS, events, calendarId }
}


var loadClient = () => {
  return new Promise(function(resolve, reject) {
    gapi.load('client:auth2', () => resolve())
  })
}

export async function auth() {
  // if (!gapi.auth2) {
  //   return setTimeout(auth, 1000)
  // }
  await loadClient()
  await initClient()
  const isLoggedIn = gapi.auth2.getAuthInstance().isSignedIn.get()

  if (!isLoggedIn) {
    const auth = await gapi.auth2.getAuthInstance().signIn()
  }

  // gapi.auth2.authorize({client_id: CLIENT_ID, scope: SCOPES, immediate: true});
  // gapi.client.init();
  // gapi.client.setApiKey(API_KEY);

  // var auth = await new Promise(async function(resolve, reject) {
  //   await gapi.auth2.authorize(params, res => {
  //     console.log(res)
  //     resolve(res)
  //   })
  // })

//   })
//   var auth = await gapi.auth2.authorize(params)
  return { type: REPLACE_AUTH, auth: true }
}

/**
 *  Initializes the API client library and sets up sign-in state
 *  listeners.
 */
function initClient() {
  new Promise(function(resolve, reject) {
    const params = {
      'api_key': API_KEY,
      'client_id': CLIENT_ID,
      'calendarId': 'primary',
    //   'calendar_id': 'wattenberger@gmail.com',
      'scope': SCOPES.join(' '),
      'immediate': true
    }

    gapi.client.init(params)
      .then(function (res) {
        // Listen for sign-in state changes.
        // gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus);

        // Handle the initial sign-in state.
        resolve()
      }, function(error) {
        reject(error)
      });
  })
}
