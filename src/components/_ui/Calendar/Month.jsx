import React, {Component, PropTypes} from "react"
import classNames from "classnames"
import _ from "lodash"
import moment from "moment"
import {monthFormat} from "reducers/calendarReducer"
import Week from "./Week"

class Month extends Component {
  static propTypes = {
    month: PropTypes.object,
    dayComponent: PropTypes.func
  };

  static defaultProps = {
  }

  getClassName() {
    return classNames("Month", this.props.className)
  }

  getWeeksInMonth() {
    let {month} = this.props

    let weeksInMonth = [];
    let startDate = moment(month, monthFormat).startOf("month").startOf("week")
    let endDate = moment(month, monthFormat).endOf("month")
    let numWeeksInMonth = endDate.diff(startDate, "weeks") + 1
    _.times(numWeeksInMonth, n => {
      let start = moment(startDate).add(n, "weeks")
      weeksInMonth.push(start)
    })
    return weeksInMonth
  }

  renderWeek = (day, idx) => {
    let {month, dayComponent} = this.props
    return <Week start={day} dayComponent={dayComponent} month={moment(month, monthFormat)} key={idx} />
  }

  render() {
    let weeksInMonth = this.getWeeksInMonth()

    return (
      <div className={this.getClassName()}>
        {weeksInMonth.map(this.renderWeek)}
      </div>
    )
  }
}

export default Month
