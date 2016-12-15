import React, {Component, PropTypes} from "react"
import classNames from "classnames"
import _ from "lodash"
import moment from "moment"
import Flex from "components/_ui/Flex/Flex"

class Week extends Component {
  static propTypes = {
    start: PropTypes.object,
    month: PropTypes.object,
    dayComponent: PropTypes.func
  };

  static defaultProps = {
    date: moment()
  }

  getClassName() {
    return classNames("Week", this.props.className)
  }

  getDaysInWeek(date) {
    let daysInWeek = [];
    let startDate = moment(date)
    _.times(7, n => {
      let day = moment(date).add(n, "days")
      daysInWeek.push(day)
    })
    return daysInWeek
  }

  renderDay = (day, idx) => {
    let {month, dayComponent} = this.props
    let Component = dayComponent
    return React.cloneElement(Component(day), {month: month, key: idx})
  }

  render() {
    let {start} = this.props
    let daysInWeek = this.getDaysInWeek(start)

    return (
      <Flex className={this.getClassName()} direction="row">
        {daysInWeek.map(this.renderDay)}
      </Flex>
    )
  }
}

export default Week
