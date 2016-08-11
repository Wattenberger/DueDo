import React, {Component, PropTypes} from "react"
import classNames from "classnames"
import _ from "lodash"
import moment from "moment"
import Week from "./Week"

class Month extends Component {
  static propTypes = {
    date: PropTypes.object,
    dayComponent: PropTypes.func
  };

  static defaultProps = {
    date: moment()
  }

  getClassName() {
    return classNames("Month", this.props.className)
  }

  getWeeksInMonth(date) {
    let weeksInMonth = [];
    let startDate = moment(date).startOf("month").startOf("week")
    let endDate = moment(date).endOf("month")
    let numWeeksInMonth = endDate.diff(startDate, "weeks") + 1
    _.times(numWeeksInMonth, n => {
      let start = moment(startDate).add(n, "weeks")
      weeksInMonth.push(start)
    })
    return weeksInMonth
  }

  renderWeek = (day, idx) => {
    let {dayComponent} = this.props
    return <Week start={day} dayComponent={dayComponent} key={idx} />
  }

  render() {
    let {date} = this.props
    let weeksInMonth = this.getWeeksInMonth(date)

    return (
      <div className={this.getClassName()}>
        {weeksInMonth.map(this.renderWeek)}
      </div>
    )
  }
}

export default Month
