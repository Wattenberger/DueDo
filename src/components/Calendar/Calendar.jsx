import React, {Component} from "react"
import classNames from "classnames"
import {connect} from "react-redux"
import moment from "moment"
import {monthFormat} from "reducers/calendarReducer"
import Button from "components/_ui/Button/Button"
import Keypress, {KEYS} from 'components/_ui/Keypress/Keypress'
import Tag from "components/_ui/Tag/Tag"
import ScrollableContainer from "components/_ui/ScrollableContainer/ScrollableContainer"
import Month from "components/_ui/Calendar/Month"
import Day from "components/_ui/Calendar/Day"
import DayTasks from "components/Calendar/DayTasks"
import TaskDrop from "components/Tasks/TaskDrop/TaskDrop"
import Modal from "components/_shared/Modal/Modal"
import PanelTitle from "components/_shared/Panel/PanelTitle/PanelTitle"
import DayView from "components/DayView/DayView"

import {setMonth, incrementMonth} from "actions/calendarActions"
import {openModal} from "actions/modalActions"
import {changeDay} from "actions/dayViewActions"
import {changePanel} from "actions/panelActions"

require('./Calendar.scss')

@connect(state => ({
  panels: state.panels,
  month: state.calendar.get("month"),
  day: state.dayView.get("day"),
}))
class Calendar extends Component {
  getClassName() {
    return classNames("Calendar")
  }

  keypresses = {
    [KEYS.LEFT]:  this.incrementMonth.bind(this, -1),
    [KEYS.RIGHT]: this.incrementMonth.bind(this, 1),
    [KEYS.UP]:  this.incrementMonth.bind(this, -1),
    [KEYS.DOWN]: this.incrementMonth.bind(this, 1),
  }

  onDayClick = (date, e) => {
    this.props.dispatch(changeDay(date))
    this.props.dispatch(openModal("dayView"))
  }

  onDayViewClose = () => {
    this.props.dispatch(changeDay(null))
  }

  incrementMonth(change) {
    let {day} = this.props
    if (day.get("_isValid")) return

    this.props.dispatch(incrementMonth(change))
  }

  setMonth(month) {
    this.props.dispatch(setMonth(month))
  }

  renderPanelControls() {
    let {month} = this.props
    let thisMonth = moment().format(monthFormat)

    return <div className="Calendar__Panel-controls">
      {month != thisMonth &&
        <Button onClick={this.setMonth.bind(this, thisMonth)}>
          Today
        </Button>
      }
      <Button onClick={this.incrementMonth.bind(this, -1)}>↤</Button>
      <div className="Calendar__Panel-controls__current-month">
        {moment(month, monthFormat).format("MMMM YYYY")}
      </div>
      <Button onClick={this.incrementMonth.bind(this, 1)}>↦</Button>
    </div>
  }

  renderDay = (day) => {
    return <TaskDrop className="DayWrapper">
      <Day day={day} onClick={this.onDayClick}>
        <DayTasks day={day} />
      </Day>
    </TaskDrop>
  }

  render() {
    let {month} = this.props

    return (
      <div className={this.getClassName()}>
        <Keypress keys={this.keypresses} />
        <Modal id="dayView" component={DayView} onClose={this.onDayViewClose} />
        <PanelTitle
          title="Calendar"
          panel="calendar"
          side="left"
          controls={this.renderPanelControls()}
        />
        <ScrollableContainer className="Tasks__ScrollableContainer">
          <Month
            month={month}
            dayComponent={this.renderDay}
          />
      </ScrollableContainer>
      </div>
    )
  }
}

export default Calendar
