import React, {Component} from "react"
import classNames from "classnames"
import {connect} from "react-redux"
import moment from "moment"
import {monthFormat, weekFormat} from "reducers/calendarReducer"
import Button from "components/_ui/Button/Button"
import Keypress, {KEYS} from 'components/_ui/Keypress/Keypress'
import Tag from "components/_ui/Tag/Tag"
import ScrollableContainer from "components/_ui/ScrollableContainer/ScrollableContainer"
import Month from "components/_ui/Calendar/Month"
import Week from "components/_ui/Calendar/Week"
import Day from "components/_ui/Calendar/Day"
import DayTasks from "components/Calendar/DayTasks"
import TaskDrop from "components/Tasks/TaskDrop/TaskDrop"
import Modal from "components/_shared/Modal/Modal"
import PanelTitle from "components/_shared/Panel/PanelTitle/PanelTitle"
import DayView from "components/DayView/DayView"

import {setMonth, incrementMonth, setWeek, incrementWeek} from "actions/calendarActions"
import {openModal} from "actions/modalActions"
import {changeDay} from "actions/dayViewActions"
import {changePanel} from "actions/panelActions"

require('./Calendar.scss')

@connect(state => ({
  panels: state.panels,
  month: state.calendar.get("month"),
  week: state.calendar.get("week"),
  day: state.dayView.get("day"),
}))
class Calendar extends Component {
  constructor(props) {
    super(props)
    this.state = {
      view: 'month'
    }
  }

  getClassName() {
    let {view} = this.state

    return classNames("Calendar", {
      "Calendar--weekly": view == 'week'
    })
  }

  keypresses = {
    [KEYS.LEFT]:  this.incrementInterval.bind(this, -1),
    [KEYS.RIGHT]: this.incrementInterval.bind(this, 1),
    [KEYS.UP]:  this.incrementInterval.bind(this, -1),
    [KEYS.DOWN]: this.incrementInterval.bind(this, 1),
    [KEYS.ENTER]: this.onDayClick.bind(this, moment()),
    [KEYS.m]: this.setView.bind(this, "month"),
    [KEYS.w]: this.setView.bind(this, "week"),
  }

  onDayClick(date, e) {
    let {day} = this.props
    if (day.get("_isValid")) return

    this.props.dispatch(changeDay(date))
    this.props.dispatch(openModal("dayView"))
  }

  onDayViewClose = () => {
    this.props.dispatch(changeDay(null))
  }

  incrementInterval(change) {
    let {day} = this.props
    let {view} = this.state
    if (day.get("_isValid")) return

    view == 'month' && this.props.dispatch(incrementMonth(change))
    view == 'week' && this.props.dispatch(incrementWeek(change))
  }

  setInterval(target) {
    let {view} = this.state
    view == 'month' && this.props.dispatch(setMonth(target))
    view == 'week' && this.props.dispatch(setWeek(target))
  }

  setView(view) {
    let {day} = this.props
    if (day.get("_isValid")) return
    this.setState({view})
  }

  toggleWeek = () => {
    let {view} = this.state
    this.setState({view: view == 'month' ? 'week' : 'month'})
  }

  renderPanelControls() {
    let {week, month} = this.props
    let {view} = this.state
    let thisInterval = moment().format(view == 'month' ? monthFormat : weekFormat)

    return <div className="Calendar__Panel-controls">
      {this.props[view] != thisInterval &&
        <Button onClick={this.setInterval.bind(this, thisInterval)}>
          Today
        </Button>
      }
      <Button onClick={this.incrementInterval.bind(this, -1)}>↤</Button>
      <div className="Calendar__Panel-controls__current-month">
        {view == 'week' && `Week ${moment(week, weekFormat).format("W")}, ${moment(week, weekFormat).format("MMMM YYYY")}`}
        {view == 'month' && moment(month, monthFormat).format("MMMM YYYY")}
      </div>
      <Button onClick={this.incrementInterval.bind(this, 1)}>↦</Button>
      <Button onClick={this.toggleWeek}>{view}</Button>
    </div>
  }

  renderMonth() {
    let {month} = this.props

    return <Month
      month={month}
      dayComponent={this.renderDay}
    />
  }

  renderWeek() {
    let {week, month} = this.props
    let day = moment(week, weekFormat).add("days", -1)

    return <Week
      start={day}
      dayComponent={this.renderDay}
      month={moment(month, monthFormat)}
    />
  }

  renderDay = (day) => {
    return <TaskDrop className="DayWrapper">
      <Day day={day} onClick={this.onDayClick.bind(this)}>
        <DayTasks day={day} />
      </Day>
    </TaskDrop>
  }

  render() {
    let {view} = this.state

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
        <ScrollableContainer className="Calendar__ScrollableContainer">
          {view == 'month' && this.renderMonth()}
          {view == 'week' && this.renderWeek()}
      </ScrollableContainer>
      </div>
    )
  }
}

export default Calendar
