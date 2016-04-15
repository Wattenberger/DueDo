import React, {Component} from "react"
import classNames from "classnames"
import {connect} from "react-redux"
import moment from "moment"
import PanelTitle from "components/_shared/Panel/PanelTitle/PanelTitle"
// import {Month} from "react-calendar"

import {changePanel, changeDate} from "actions/panelActions"

require('./DayView.scss')

@connect(state => ({
  day: state.panels.day
}))
class DayView extends Component {
  static defaultProps = {
    day: moment()
  }

  getClassName() {
    return classNames("DayView")
  }

  render() {
    let {day} = this.props

    return (
      <div className={this.getClassName()}>
        <PanelTitle title={day.format("dddd MMMM Do YYYY")} panel="day" />
        Hi, it's {day.format("dddd MMMM Do YYYY")}
      </div>
    )
  }
}

export default DayView
