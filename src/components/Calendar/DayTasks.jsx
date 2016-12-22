import React, {Component, PropTypes} from "react"
import classNames from "classnames"
import {connect} from "react-redux"
import _ from "lodash"
import moment from "moment"
import {airtableDateFormat} from "api/airtableAPI"
import {getDayItems, getDayItemClassNames} from "components/Tasks/getDayItems"

require('./DayTasks.scss')
const weekends = ["Fr", "Sa", "Su"]

@connect(state => ({
  tasks: state.tasks.get('list'),
  habits: state.tasks.get('habits'),
  events: state.googleCalendar.get('events'),
  ongoing: state.googleCalendar.get('ongoing'),
}))
class DayTasks extends Component {
  static propTypes = {
    day: PropTypes.object,
  };

  getClassName() {
    return classNames("DayTasks", this.props.className)
  }

  isSameMonth() {
    let {day} = this.props
    return moment().isSame(day, 'month')
  }

  renderTasks() {
    let {day, tasks} = this.props

    return getDayItems("tasks", tasks, day).map(task =>
        <div className={getDayItemClassNames("task", task, day, "DayTasks__task")} key={task.id}>
          {task.fields.Title}
        </div>
      )
  }

  renderHabits() {
    let {day, habits} = this.props

    return getDayItems("habits", habits, day).map(habit =>
      <div className={getDayItemClassNames("habit", habit, day, "DayTasks__habit")} key={habit.id}>
        {habit.fields.Title}
      </div>
    )
  }

  renderEvents() {
    let {day, events} = this.props

    return getDayItems("events", events, day).map(event =>
      <div className={getDayItemClassNames("event", event, day, "DayTasks__event")} key={event.id}>
        {event.summary}
      </div>
    )
  }

  renderOngoingEvents() {
    let {day, ongoing} = this.props

    return getDayItems("ongoing", ongoing, day).map(event => {
      const classnames = getDayItemClassNames("ongoing", event, day, "DayTasks__event")
      return <div className={classnames} key={event.id}>
        {!_.includes(classnames, "DayTasks__event__ongoing--middle-day") && event.summary}
      </div>
    })
  }


  render() {
    let {day} = this.props

    return (
      <div className={this.getClassName()} onClick={this.onDayClick}>
        {this.renderOngoingEvents()}
        {this.renderEvents()}
        {this.renderTasks()}
        {this.renderHabits()}
      </div>
    )
  }
}

export default DayTasks
