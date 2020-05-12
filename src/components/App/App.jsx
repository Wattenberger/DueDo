import React, {Component} from "react"
import {connect} from "react-redux"
import classNames from "classnames"
import Panels from "components/Panels/Panels"

require('styles/app.scss')
require('./App.scss')

@connect(state => ({}))
class App extends Component {
  getClassName() {
    return classNames("App")
  }

  render() {
    return (
      <div className={this.getClassName()}>
        <Panels />
        {this.props.children}
      </div>
    )
  }
}

export default App
