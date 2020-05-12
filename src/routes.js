import React, {Component} from "react"
import {Router, Route, Redirect} from "react-router"
// import appHistory from "./appHistory"
import {BrowserRouter} from "react-router-dom"
import "babel-polyfill"

import App from "components/App/App"
// import Home from "components/Home/Home"
// import Panels from "components/Panels/Panels"

class Routes extends Component {
  render() {
    return (
      <BrowserRouter>
        <div>
          <Route path="/" component={App} />
          {/* <Route path="tasks" component={Panels} />
          <Route path="home" component={Home} /> */}
          {/* <Redirect from="*" to="home" /> */}
        </div>
      </BrowserRouter>
    )
  }
}

export default Routes
