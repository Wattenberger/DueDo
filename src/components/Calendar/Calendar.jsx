import React, {Component} from "react"
import classNames from "classnames"
import {connect} from "react-redux"
import moment from "moment"
import Tag from "components/_ui/Tag/Tag"
import ScrollableContainer from "components/_ui/ScrollableContainer/ScrollableContainer"
import Month from "components/_ui/Calendar/Month"
import Day from "components/_ui/Calendar/Day"
import Modal from "components/_shared/Modal/Modal"
import PanelTitle from "components/_shared/Panel/PanelTitle/PanelTitle"
import DayView from "components/DayView/DayView"

import {openModal} from "actions/modalActions"
import {changeDay} from "actions/dayViewActions"
import {changePanel} from "actions/panelActions"

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
    this.props.dispatch(openModal("dayView"))
  }

  renderDay = (day) => {
    return <Day onClick={this.onDayClick} />
  }

  render() {
    return (
      <div className={this.getClassName()}>
        <Modal id="dayView" component={DayView} />
        <PanelTitle title="Calendar" panel="calendar" side="left" />
        <ScrollableContainer className="Tasks__ScrollableContainer">
          <Month
            dayComponent={this.renderDay}
          />
      </ScrollableContainer>
      </div>
    )
  }
}

export default Calendar
