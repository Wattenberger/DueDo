import React, {Component, PropTypes} from "react"
import classNames from "classnames"
import _ from "lodash"
import moment from "moment"

require('./Day.scss')

class Day extends Component {
  static propTypes = {
    day: PropTypes.object
  };

  static defaultProps = {
    onClick: _.noOp
  }

  getClassName() {
    return classNames("Day", this.props.className)
  }

  onClick = (e) => {
    let {day, onClick} = this.props
    this.props.onClick(day, e)
  }

  render() {
    let {day} = this.props

    return (
      <div {...this.props} className={this.getClassName()} onClick={this.onClick}>
        <div className="Day__number">{day.format("D")}</div>
      </div>
    )
  }
}

export default Day
