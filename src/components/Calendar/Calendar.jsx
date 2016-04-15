import React, {Component} from "react"
import classNames from "classnames"
import {connect} from "react-redux"
import moment from "moment"
import PanelTitle from "components/_shared/Panel/PanelTitle/PanelTitle"
import Tag from "components/_ui/Tag/Tag"
import Month from "components/_ui/Calendar/Month"
import Day from "components/_ui/Calendar/Day"

import {changePanel, changeDay} from "actions/panelActions"

require('./Calendar.scss')

@connect(state => ({
  panels: state.panels
}))
class Calendar extends Component {
  getClassName() {
    return classNames("Calendar")
  }

  onDayClick = (date, e) => {
    this.props.dispatch(changeDay(date))
    this.props.dispatch(changePanel("right", "day"))
  }

  renderDay = (day) => {
    return <Day onClick={this.onDayClick} />
  }

  render() {
    return (
      <div className={this.getClassName()}>
        <PanelTitle title="Calendar" panel="calendar" />
        <Month
          dayComponent={this.renderDay}
        />
      </div>
    )
  }
}

export default Calendar
