import {GOOGLE_API_KEY as API_KEY} from "config/config"

const SCOPES = ["https://www.googleapis.com/auth/calendar.readonly"];

/**
* Load Google Calendar client library. List upcoming events
* once client library is loaded.
*/
function loadCalendarApi() {
  gapi.client.load('calendar', 'v3', listUpcomingEvents);
}

/**
* Print the summary and start datetime/date of the next ten events in
* the authorized user's calendar. If no events are found an
* appropriate message is printed.
*/
function listUpcomingEvents() {
  var request = gapi.client.calendar.events.list({
    'calendarId': 'primary',
    'timeMin': (new Date()).toISOString(),
    'showDeleted': false,
    'singleEvents': true,
    'maxResults': 10,
    'orderBy': 'startTime'
  });

  request.execute(function(resp) {
    return resp.items
  });
}

const googleAPI = {
  checkAuth() {
    gapi.auth.authorize({client_id: clientId, scope: scopes, immediate: true});
  },
  init() {
      checkAuth();
      gapi.client.setApiKey(apiKey);
  },
  auth() {
    setTimeout(() => {
      gapi.auth.authorize(
        {
          'client_id': CLIENT_ID,
          'scope': SCOPES.join(' '),
          'immediate': true
        }, (authResult) => {
          if (authResult && !authResult.error) {
            loadCalendarApi();
          } else {
          }
        }
      )
    }, 1000)
  },
  fetchEvents() {
    return listUpcomingEvents()
  },
}

export default googleAPI
