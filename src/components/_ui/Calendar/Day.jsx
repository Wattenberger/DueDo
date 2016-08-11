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

  renderEvents() {
    return this.getDaysEvents().map(event =>
      <div className="Day__event" key={event.id}>{event.summary}</div>
    )
  }


  render() {
    let {day} = this.props

    return (
      <div {...this.props} className={this.getClassName()} onClick={this.onClick}>
        <div className="Day__number">{day.format("D")}</div>
        {this.renderTasks()}
        {this.renderEvents()}
      </div>
    )
  }
}

export default Day
