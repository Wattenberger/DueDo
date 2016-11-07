import React, {Component, PropTypes} from "react"
import classNames from "classnames"
import {connect} from "react-redux"
import _ from "lodash"
import moment from "moment"
import {airtableDateFormat} from "api/airtableAPI"

require('./Day.scss')
const weekends = ["Fr", "Sa", "Su"]

@connect(state => ({
  tasks: state.tasks.get('list'),
  habits: state.tasks.get('habits'),
  events: state.googleCalendar.get('events')
}))
class Day extends Component {
  static propTypes = {
    day: PropTypes.object
  };

  static defaultProps = {
    onClick: _.noOp
  }

  getClassName() {
    return classNames("Day", {
      "Day--today": this.isToday(),
      "Day--weekend": this.isWeekend(),
      "Day--another-month": !this.isSameMonth()
    }, this.props.className)
  }

  getTaskClassName(task) {
    return classNames("Day__task", {
      "Day__task--done": task.fields.Done
    })
  }

  getHabitClassName(habit) {
    let {day} = this.props
    let date = moment(day).format(airtableDateFormat)

    return classNames("Day__habit", {
      "Day__habit--done": _.includes(habit.fields["Habit--Done"], date),
      "Day__habit--missed": !_.includes(habit.fields["Habit--Done"], date) &&
                            moment(day).isBefore(moment())
    })
  }

  onClick = (e) => {
    let {day, onClick} = this.props
    this.props.onClick(day, e)
  }

  isToday() {
    let {day} = this.props
    return moment().isSame(day, 'day')
  }

  isWeekend() {
    let {day} = this.props
    return weekends.indexOf(day.format("dd")) != -1
  }

  isSameMonth() {
    let {day} = this.props
    return moment().isSame(day, 'month')
  }

  getDaysEvents() {
    let {day, events} = this.props
    return events.filter(event => moment(event.start.dateTime, "YYYY-MM-DD").isSame(day, "day"))
  }

  renderTasks() {
    let {day, tasks} = this.props
    let date = moment(day).format(airtableDateFormat)

    return tasks
      .filter(task => task.fields && task.fields.When === date)
      .map(task =>
        <div className={this.getTaskClassName(task)} key={task.id}>{task.fields.Title}</div>
      )
  }

  renderHabits() {
    let {day, habits} = this.props
    let date = moment(day).format(airtableDateFormat)

    return habits
      .filter(habit => _.includes(habit.fields["Habit--DOW"], moment(date).format("e")) &&
                       moment(habit.createdTime, moment.ISO_8601).isBefore(moment(date)))
      .map(habit => <div className={this.getHabitClassName(habit)} key={habit.id}>{habit.fields.Title}</div>)
  }

  renderEvents() {
    return this.getDaysEvents().map(event =>
      <div className="Day__event" key={event.id}>{event.summary}</div>
    )
  }


  render() {
    let {day} = this.props

    return (
      <div {...this.props} className={this.getClassName()} onClick={this.onClick}>
        <div className="Day__header">
          <div className="Day__number">{day.format("D")}</div>
          <div className="Day__dow">{day.format("dddd")}</div>
        </div>
        {this.renderTasks()}
        {this.renderEvents()}
        {this.renderHabits()}
      </div>
    )
  }
}

export default Day
