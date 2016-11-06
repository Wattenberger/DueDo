import React, {Component} from "react"
import classNames from "classnames"
import {connect} from "react-redux"
import moment from "moment"
import PanelTitle from "components/_shared/Panel/PanelTitle/PanelTitle"
import Keypress, {KEYS} from 'components/_ui/Keypress/Keypress'
import Flex from "components/_ui/Flex/Flex"
import Button from "components/_ui/Button/Button"
import Task from "components/Tasks/Task/Task"
import {airtableDateFormat} from "api/airtableAPI"

import {changeDay} from "actions/dayViewActions"

require('./DayView.scss')

const dateFormat = "dddd MMMM Do YYYY"
const today = moment()

@connect(state => ({
  day: moment(state.dayView.get('day').toJS()),
  tasks: state.tasks.get('list'),
  events: state.googleCalendar.get('events')
}))
class DayView extends Component {
  getClassName() {
    return classNames("DayView")
  }

  changeDay(diff) {
    let {day} = this.props
    let newDate = day.add(diff, 'd')
    this.props.dispatch(changeDay(newDate))
  }

  changeDayToToday = () => {
    this.props.dispatch(changeDay(today))
  }

  keypresses = {
      [KEYS.LEFT]:  this.changeDay.bind(this, -1),
      [KEYS.RIGHT]: this.changeDay.bind(this, 1)
  }

  getDaysEvents() {
    let {day, events} = this.props
    return events.filter(event => moment(event.start.dateTime, "YYYY-MM-DD").isSame(day, "day"))
  }

  renderTodayButton() {
    return <Button onClick={this.changeDayToToday}>Today</Button>
  }

  renderTitleControls() {
    let {day} = this.props

    return <Flex className="DayView__title-controls">
      <Button onClick={this.changeDay.bind(this, -1)}>↤</Button>
      {
        !day.isSame(today, 'day') &&
        day.isBefore(today, 'day') &&
        this.renderTodayButton()
     }
      <span className="DayView__title-controls__text">{day.format(dateFormat)}</span>
      {
        !day.isSame(today, 'day') &&
        !day.isBefore(today, 'day') &&
        this.renderTodayButton()
     }
      <Button onClick={this.changeDay.bind(this, 1)}>↦</Button>
    </Flex>
  }

  renderTasks() {
    let {day, tasks} = this.props
    let date = day.format(airtableDateFormat)

    return tasks
      .filter(task => task.fields && task.fields.When === date)
      .map(task =>
        <Task task={task} key={task.id} />
      )
  }

  renderEvents() {
    return <div className="DayView__events">
      {this.getDaysEvents().map(event =>
        <div className="DayView__event" key={event.id}>
          <span className="DayView__event__time">{moment(event.start.dateTime).format("h:mm A")}</span>
          {event.summary}
        </div>
      )}
    </div>
  }

  render() {
    let {day, tasks} = this.props

    return (
      <div className={this.getClassName()}>
        <Keypress keys={this.keypresses} />
        {this.renderTitleControls()}
        {this.renderTasks()}
        {this.renderEvents()}
      </div>
    )
  }
}

export default DayView
