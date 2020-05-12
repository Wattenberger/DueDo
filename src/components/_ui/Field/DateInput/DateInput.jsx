import React, {Component} from "react"
import PropTypes from 'prop-types';
import classNames from "classnames"
import moment from "moment"
import Keypress, {KEYS} from 'components/_ui/Keypress/Keypress'
import days from "./daysOfTheWeek"
import strings from "./dayStrings"

const possibleFormats = [
  "M/D",
  "YYYY-MM-DD",
  "MMM DD",
  "MM DD",
  "MM/DD",
  "DD",
  "MMMM DD",
  "Do",
  "MM/DD/YYYY",
  "MM/DD/YY",
  "YYYY/MM/DD",
  "YYYY-MM-D"
]

class DateInput extends Component {
  constructor(props) {
    super(props)
    this.state = {
      value: this.props.value
    }
  }

  static propTypes = {
    value: PropTypes.string,
    dateFormat: PropTypes.string,
    canBeEmpty: PropTypes.bool,
    onSanitize: PropTypes.func,
    onChange: PropTypes.func
  }

  static defaultProps = {
    dateFormat: "MM/DD/YYYY",
    canBeEmpty: true,
    onSanitize: () => {}
  }

  getClassName() {
    return classNames(
      "DateInput", this.props.className
    )
  }

  getDayFromWeekday(day) {
    let {dateFormat} = this.props
    // make sure it's the next DOW in the future
    let dow = moment().day()
    if (day < dow) day += 7
    return moment().day(day).format(dateFormat)
  }

  getDayFromDiff(diff) {
    let {dateFormat} = this.props
    return moment().add(diff[0], diff[1] || 'd').format(dateFormat)
  }

  validateDate(str, format, possDate) {
    if (possDate.isBefore(moment())) {
      if (!format.includes("Y")) {
        possDate.add(1, "year")
      } else if (!format.includes("M")) {
        possDate.add(1, "M")
      } else {
        return possDate
      }
      return this.validateDate(str, format, possDate)
    }
    return possDate
  }

  getDayfromDate(str) {
    let {dateFormat} = this.props
    let date = null

    possibleFormats.forEach(format => {
      if (date) return
      let possDate = moment(str, format)
      if (possDate.isValid()) {
        possDate = this.validateDate(str, format, possDate)
        date = possDate.format(dateFormat)
      }
    })
    return date || moment().format(dateFormat)
  }

  stringToDate(str) {
    let {dateFormat, canBeEmpty} = this.props
    if (!str && canBeEmpty) return null
    str = str.toLowerCase()

    return days[str] ? this.getDayFromWeekday(days[str]) :
           strings[str] ? this.getDayFromDiff(strings[str]) :
           this.getDayfromDate(str)
  }

  onBlur = () => {
    let {value} = this.state
    let newVal = this.stringToDate(value)

    this.setState({value: newVal})
    this.props.onChange(newVal)
  }

  keypresses = {
    [KEYS.ENTER]: this.onBlur
  }

  onChange = (e) => {
    let newVal = e.target.value
    this.setState({value: newVal})
  }

  setValue() {
    this.props.onChange(this.state.value)
  }

  render() {
    let {value} = this.state

    return (
      <span>
          <Keypress keys={this.keypresses} elem={this.refs.input} />
          <input
            ref="input"
            className={this.getClassName()}
            value={value}
            onChange={this.onChange}
            onBlur={this.onBlur}
          />
      </span>
    )
  }
}

export default DateInput
