import React, {Component, PropTypes} from "react"
import classNames from "classnames"
import moment from "moment"
import days from "./daysOfTheWeek"
import strings from "./dayStrings"

const possibleFormats = [
  "MMMM DD",
  "Do",
  "MMM DD",
  "MM DD",
  "MM/DD",
  "MM/DD/YYYY",
  "MM/DD/YY",
  "DD",
  "YYYY-MM-DD"
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
    onChange: PropTypes.func
  }

  static defaultProps = {
    dateFormat: "MM/DD/YYYY"
  }

  getClassName() {
    return classNames(
      "DateInput", this.props.className
    )
  }

  getDayFromWeekday(day) {
    let {dateFormat} = this.props
    return moment().day(day).format(dateFormat)
  }

  getDayFromDiff(diff) {
    let {dateFormat} = this.props
    return moment().add(diff[0], diff[1] || 'd').format(dateFormat)
  }

  getDayfromDate(str) {
    let {dateFormat} = this.props
    let date = null

    possibleFormats.forEach(format => {
      if (date) return
      let possDate = moment(str, format)
      if (possDate.isValid()) console.log(format); date = possDate.format(dateFormat)
    })
    return date || moment().format(dateFormat)
  }

  stringToDate(str) {
    let {dateFormat} = this.props
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
      <input
        className={this.getClassName()}
        value={value}
        onChange={this.onChange}
        onBlur={this.onBlur}
      />
    )
  }
}

export default DateInput
