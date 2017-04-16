import React, {Component, PropTypes} from "react"
import classNames from "classnames"
import _ from "lodash"
import moment from "moment"

require('./Day.scss')
const weekends = ["Sa", "Su"]

class Day extends Component {
  static propTypes = {
    day: PropTypes.object,
    month: PropTypes.object,
    onClick: PropTypes.func,
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

  onClick = (e) => {
    let {day, onClick} = this.props
    onClick && onClick(day, e)
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
    let {day, month} = this.props
    return month ? month.isSame(day, 'month') : true
  }

  render() {
    let {day} = this.props

    return (
      <div className={this.getClassName()} onClick={this.onClick}>
        <div className="Day__header">
          <div className="Day__number">{day.format("D")}</div>
          <div className="Day__dow">{day.format("dddd")}</div>
        </div>
        {this.props.children}
      </div>
    )
  }
}

export default Day
