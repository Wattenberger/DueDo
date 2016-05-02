import Unsplash from 'unsplash-js';
import fetch from "./utils/fetch"
import {UNSPLASH_APPLICATION_ID as APP_ID, UNSPLASH_SECRET as APP_SECRET, UNSPLASH_REDIRECT_URL as REDIRECT_URL} from "config/config"

const baseUrl = "https://api.unsplash.com/photos/"
const params = {
  client_id: APP_ID,
  redirect_uri: REDIRECT_URL,
}

const unsplash = new Unsplash({
  applicationId: "{APP_ID}",
  secret: "{APP_SECRET}",
  callbackUrl: "{CALLBACK_URL}"
});

const unsplashAPI = {
  fetchPhoto() {
    return unsplash.photos.getRandomPhoto({ username: "wattenberger" })
      .then(toJson)
        .then(json => {
          console.log(json)
        })
  },
}


export default unsplashAPI
