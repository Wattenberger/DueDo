import React, {Component} from "react"
import classNames from "classnames"
import {connect} from "react-redux"
import moment from "moment"
import {airtableDateFormat} from "api/airtableAPI"
import PanelTitle from "components/_shared/Panel/PanelTitle/PanelTitle"
import Keypress, {KEYS} from 'components/_ui/Keypress/Keypress'
import Flex from "components/_ui/Flex/Flex"
import Button from "components/_ui/Button/Button"
import Task from "components/Tasks/Task/Task"
import {getDayItems, getDayItemClassNames} from "components/Tasks/getDayItems"

import {changeDay} from "actions/dayViewActions"

require('./DayView.scss')

const dateFormat = "dddd MMMM Do YYYY"
const today = moment()

@connect(state => ({
  day: moment(state.dayView.get('day').toJS()),
  tasks: state.tasks.get('list'),
  habits: state.tasks.get('habits'),
  events: state.googleCalendar.get('events'),
  ongoing: state.googleCalendar.get('ongoing'),
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

  renderTodayButton() {
    return <Button onClick={this.changeDayToToday}>Today</Button>
  }

  renderTitleControls() {
    let {day} = this.props

    return <Flex className="DayView__title-controls">
      <Button onClick={this.changeDay.bind(this, -1)}>↤</Button>
      {!day.isSame(today, 'day') && !day.isBefore(today, 'day') && this.renderTodayButton()}
      <span className="DayView__title-controls__text">{day.format(dateFormat)}</span>
      {!day.isSame(today, 'day') && day.isBefore(today, 'day') && this.renderTodayButton()}
      <Button onClick={this.changeDay.bind(this, 1)}>↦</Button>
    </Flex>
  }

  renderTasks() {
    let {day, tasks} = this.props

    return getDayItems("tasks", tasks, day)
      .map(task =>
        <Task className={getDayItemClassNames("task", task, day, "DayView__task")}
              task={task}
              dayContext={day}
              key={task.id} />
      )
  }

  renderEvents() {
    let {events, day} = this.props
    return <div className="DayView__events">
      {getDayItems("events", events, day).map(event =>
        <div className={getDayItemClassNames("event", event, day, "DayView__event")} key={event.id}>
          <span className="DayView__event__time">{moment(event.start.dateTime).format("h:mm A")}</span>
          {event.summary}
        </div>
      )}
    </div>
  }

  renderOngoingEvents() {
    let {ongoing, day} = this.props

    return <div className="DayView__events DayView__events__ongoing">
      {getDayItems("ongoing", ongoing, day).map(event =>
        <div className={getDayItemClassNames("ongoing", event, day, "DayView__event")} key={event.id}>
          {event.summary}
        </div>
      )}
    </div>
  }

  renderHabits() {
    let {day, habits} = this.props
    
    return <div className="DayView__events">
      {getDayItems("habits", habits, day).map(habit =>
        <Task className={getDayItemClassNames("habit", habit, day, "DayView__habit")}
              task={habit}
              dayContext={day}
              key={habit.id}
        />
      )}
    </div>
  }

  render() {
    let {day, tasks} = this.props

    return (
      <div className={this.getClassName()}>
        <Keypress keys={this.keypresses} />
        {this.renderTitleControls()}
        {this.renderEvents()}
        {this.renderOngoingEvents()}
        {this.renderTasks()}
        {this.renderHabits()}
      </div>
    )
  }
}

export default DayView
