import React, {Component} from "react"
import classNames from "classnames"
import {connect} from "react-redux"
import moment from "moment"

import {clearPomodoro} from "actions/pomodoroActions"

require('./Pomodoro.scss')
var updateInterval;

@connect(state => ({
  pomodoro: state.pomodoro.toJS()
}))
class Pomodoro extends Component {
  constructor(props) {
    super(props)
    this.state = {
      now: moment()
    }
  }

  getClassName() {
    return classNames("Pomodoro")
  }

  componentDidMount = () => {
    updateInterval = setInterval(this.updateTime, 100)
  }

  componentWillUnmount() {
    clearInterval(updateInterval)
  }

  updateTime = () => {
    let {pomodoro} = this.props

    var now = moment()
    this.setState({now: now})
    if (now.isAfter(pomodoro.end)) {
      alert("Pomodoro done!")
      this.clearPomodoro()
    }
  }

  clearPomodoro = () => {
    this.props.dispatch(clearPomodoro())
  }

  renderTime() {
      let {pomodoro} = this.props
      let {now} = this.state
      let minutesDiff = pomodoro.end.diff(now, "minutes")
      let secondsDiff = pomodoro.end.diff(now, "seconds")

      return minutesDiff + ":" + (secondsDiff - 60 * Math.floor(secondsDiff / 60))
  }

  render() {
      let {pomodoro} = this.props

    return pomodoro.start &&
      (
        <div className={this.getClassName()}>
          <div className="Pomodoro__background" />
          {this.renderTime()}
        </div>
      )
  }
}

export default Pomodoro
