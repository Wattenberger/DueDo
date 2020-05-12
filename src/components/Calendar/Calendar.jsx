import React, {Component} from "react"
import classNames from "classnames"
import {connect} from "react-redux"
import moment from "moment"
import {monthFormat, weekFormat, dayFormat} from "reducers/calendarReducer"
import Button from "components/_ui/Button/Button"
import RadioGroup from "components/_ui/RadioGroup/RadioGroup"
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

import {setMonth, incrementMonth, setWeek, incrementWeek, setDay, incrementDay} from "actions/calendarActions"
import {openModal} from "actions/modalActions"
import {changeDay} from "actions/dayViewActions"
import {auth, fetchEvents} from "actions/googleActions"
import {changePanel} from "actions/panelActions"

const formats = {monthFormat, weekFormat, dayFormat}

require('./Calendar.scss')

@connect(state => ({
  panels: state.panels,
  month: state.calendar.get("month"),
  week: state.calendar.get("week"),
  firstDay: state.calendar.get("day"),
  day: state.dayView.get("day"),
}))
class Calendar extends Component {
  constructor(props) {
    super(props)
    this.state = {
      view: 'month',
      days: 4,
    }
  }

  getClassName() {
    let {view} = this.state

    return classNames("Calendar", {
      "Calendar--weekly": view == 'week',
      "Calendar--x-days": view == 'days',
    })
  }

  setView = (view, days) => {
    let {day} = this.props
    if (day.get("_isValid")) return
    this.setState({view})
    if (days) this.setState({days})
  }

  keypresses = {
    [KEYS.LEFT]:  this.incrementInterval.bind(this, -1),
    [KEYS.RIGHT]: this.incrementInterval.bind(this, 1),
    [KEYS.UP]:  this.incrementInterval.bind(this, -1),
    [KEYS.DOWN]: this.incrementInterval.bind(this, 1),
    [KEYS.ENTER]: this.setView.bind(this, "days", 1),
    [KEYS.ESC]: this.setView.bind(this, "month"),
    [KEYS.t]: this.onTodayClick.bind(this),
    // [KEYS.c]: this.setView.bind(this, "month"),
    [KEYS.m]: this.setView.bind(this, "month"),
    [KEYS.w]: this.setView.bind(this, "week"),
    [KEYS.d]: this.setView.bind(this, "days", 4),
    [KEYS[1]]: this.setView.bind(this, "days", 1),
    [KEYS[2]]: this.setView.bind(this, "days", 2),
    [KEYS[3]]: this.setView.bind(this, "days", 3),
    [KEYS[4]]: this.setView.bind(this, "days", 4),
    [KEYS[5]]: this.setView.bind(this, "days", 5),
    [KEYS[6]]: this.setView.bind(this, "days", 6),
    [KEYS[7]]: this.setView.bind(this, "days", 7),
  }

  onDayClick(date, e) {
    let {day} = this.props
    if (day.get("_isValid")) return

    const target = date.format(dayFormat)
    this.props.dispatch(setDay(target))
    this.setView("days", 1)
  }

  onDayViewClose = () => {
    this.props.dispatch(changeDay(null))
  }

  incrementInterval(change) {
    let {day} = this.props
    let {view} = this.state
    if (day.get("_isValid")) return

    view == 'month' && this.props.dispatch(incrementMonth(change))
    view == 'week'  && this.props.dispatch(incrementWeek(change))
    view == 'days'  && this.props.dispatch(incrementDay(change))
  }

  setInterval(target) {
    let {view} = this.state
    view == 'month' && this.props.dispatch(setMonth(target))
    view == 'week'  && this.props.dispatch(setWeek(target))
    view == 'days'  && this.props.dispatch(setDay(target))
  }

  onTodayClick() {
    let {view} = this.state
    let thisInterval = moment().add(view == "week" ? 1 : 0, "day").format(formats[`${view}Format`])
    this.setInterval(thisInterval)
  }

  getNewEvents() {
    this.props.dispatch(fetchEvents())
    this.props.dispatch(fetchEvents("amelia@polygraph.cool"))
  }

  renderPanelControls() {
    let {firstDay, week, month} = this.props
    let {view} = this.state
    let thisInterval = moment().add(view == "week" ? 1 : 0, "day").format(formats[`${view}Format`])
    const buttons = ["days", "week", "month"]

    return <div className="Calendar__Panel-controls">
      <Button onClick={this.incrementInterval.bind(this, -1)}>↤</Button>
      <div className="Calendar__Panel-controls__current-month">
        {view == 'days'  && moment(firstDay, dayFormat).format("dddd MMMM DD YYYY")}
        {view == 'week'  && `Week ${moment(week, weekFormat).format("W")}, ${moment(week, weekFormat).format("MMMM YYYY")}`}
        {view == 'month' && moment(month, monthFormat).format("MMMM YYYY")}
      </div>
      <Button onClick={this.incrementInterval.bind(this, 1)}>↦</Button>
      {this.props[view] != thisInterval &&
        <Button onClick={this.onTodayClick.bind(this)}>
          Today
        </Button>
      }
      <div className="Calendar__right-buttons">
        <Button onClick={this.getNewEvents.bind(this)}>↻</Button>
        <RadioGroup className="Calendar--view-radio-group"
                    options={buttons}
                    value={view}
                    onSelect={this.setView}
        />
      </div>
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
    let day = moment(week, weekFormat).add(-1, "days")

    return <Week
      start={day}
      dayComponent={this.renderDay}
      month={moment(month, monthFormat)}
    />
  }

  renderDays() {
    let {firstDay, month} = this.props
    let {days} = this.state
    let visibleDays = [
      moment(firstDay, dayFormat),
      ..._.times(days - 1, n => moment(firstDay, dayFormat).add(n + 1, "days"))
    ]

    return <div className="Calendar--days-container">
      {visibleDays.map(this.renderDay)}
    </div>
  }

  renderDay = (day, idx) => {
    let {days, view} = this.state

    const detailed = view == "days" && days < 3;
    const className = classNames({"Day--detailed": detailed})

    return <TaskDrop className="DayWrapper" day={day} key={idx}>
      <Day day={day} className={className} onClick={view != "days" && this.onDayClick.bind(this, day)}>
        <DayTasks day={day} detailed={detailed} />
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
          {view == 'week'  && this.renderWeek()}
          {view == 'days'  && this.renderDays()}
        </ScrollableContainer>
      </div>
    )
  }
}

export default Calendar
