import React, {Component} from "react"
import classNames from "classnames"

require('./Home.scss')

class Home extends Component {
  getClassName() {
    return classNames("Home")
  }

  render() {
    return (
      <div className={this.getClassName()}>
        Hi, get ready to DueDo
      </div>
    )
  }
}

export default Home
