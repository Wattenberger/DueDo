import React, {Component} from "react"
import {Router, Route, Redirect, IndexRedirect} from "react-router"
// import appHistory from "./appHistory"
import {browserHistory} from "react-router"

import App from "components/App/App"
import Home from "components/Home/Home"
import Panels from "components/Panels/Panels"

class Routes extends Component {
  render() {
    return (
      <Router history={browserHistory}>
        <Route path="/" component={App}>
          <IndexRedirect to="home" />
          <Route path="home" component={Home} />
          <Route path="tasks" component={Panels} />
        </Route>
        <Redirect from="*" to="home" />
      </Router>
    )
  }
}

export default Routes
