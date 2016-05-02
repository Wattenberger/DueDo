import React, {Component, PropTypes} from "react"
import classNames from "classnames"
import {connect} from "react-redux"
import _ from "lodash"
import moment from "moment"
import {airtableDateFormat} from "api/airtableAPI"

require('./Day.scss')
const weekends = ["Fr", "Sa", "Su"]

@connect(state => ({
  tasks: state.tasks.get('list')
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
      "Day--weekend": this.isWeekend(),
      "Day--another-month": !this.isSameMonth()
    }, this.props.className)
  }

  onClick = (e) => {
    let {day, onClick} = this.props
    this.props.onClick(day, e)
  }

  isSameMonth() {
    let {day} = this.props
    return moment().isSame(day, 'month')
  }

  isWeekend() {
    let {day} = this.props
    return weekends.indexOf(day.format("dd")) != -1
  }

  renderTasks() {
    let {day, tasks} = this.props
    let date = moment(day).format(airtableDateFormat)

    return tasks
    .filter(task => task.fields && task.fields.When === date)
    .map(task =>
      <div className="Day__task" key={task.id}>{task.fields.Title}</div>
    )
  }


  render() {
    let {day} = this.props

    return (
      <div {...this.props} className={this.getClassName()} onClick={this.onClick}>
        <div className="Day__number">{day.format("D")}</div>
        {this.renderTasks()}
      </div>
    )
  }
}

export default Day
