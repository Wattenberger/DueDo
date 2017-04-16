import React, {Component, PropTypes} from "react"
import classNames from "classnames"
import {connect} from "react-redux"
import _ from "lodash"
import moment from "moment"
import {airtableDateFormat} from "api/airtableAPI"
import {getDayItems, getDayItemClassNames} from "components/Tasks/getDayItems"
  import Task from "components/Tasks/Task/Task"

require('./DayTasks.scss')
const weekends = ["Fr", "Sa", "Su"]

@connect(state => ({
  tasks: state.tasks.get('list'),
  habits: state.tasks.get('habits'),
  events: state.googleCalendar.get('events'),
  ongoing: state.googleCalendar.get('ongoing'),
}))
class DayTasks extends Component {
  static propTypes = {
    day: PropTypes.object,
    detailed: PropTypes.bool,
  };

  getClassName() {
    return classNames("DayTasks", this.props.className)
  }

  isSameMonth() {
    let {day} = this.props
    return moment().isSame(day, 'month')
  }

  renderTask = (task, idx) => {
    let {day, detailed} = this.props

    return detailed ? <Task className={getDayItemClassNames("task", task, day, "DayView__task")}
                            task={task}
                            dayContext={day}
                            key={task.id} />
                    : <div className={getDayItemClassNames("task", task, day, "DayTasks__task")} key={task.id}>
                        {task.fields.Title}
                      </div>
  }

  renderHabit = (habit, idx) => {
    let {day, detailed} = this.props

    return detailed ? <Task className={getDayItemClassNames("habit", habit, day, "DayView__habit")}
                        task={habit}
                        dayContext={day}
                        habitInfo={{done: _.includes(habit.fields["Habit--Done"], moment(day).format(airtableDateFormat))}}
                        key={habit.id}
                      />
                    : <div className={getDayItemClassNames("habit", habit, day, "DayTasks__habit")} key={habit.id}>
                         {habit.fields.Title}
                       </div>
  }

  renderEvent = (event, idx) => {
    let {day, detailed} = this.props

    return <div className={getDayItemClassNames("event", event, day, "DayTasks__event")} key={event.id}>
              {detailed && <span className="DayView__event__time">{moment(event.start.dateTime).format("h:mm A")}</span>}
              {event.summary}
            </div>
  }

  renderOngoingEvent = (event, idx) => {
    let {day, detailed} = this.props
    const classnames = getDayItemClassNames("ongoing", event, day, "DayTasks__event")

    return <div className={classnames} key={event.id}>
      {!_.includes(classnames, "DayTasks__event__ongoing--middle-day") && event.summary}
    </div>
  }


  render() {
    let {day, ongoing, events, tasks, habits} = this.props

    return (
      <div className={this.getClassName()} onClick={this.onDayClick}>
        {getDayItems("ongoing", ongoing, day).map(this.renderOngoingEvent)}
        {getDayItems("events", events, day).map(this.renderEvent)}
        {getDayItems("tasks", tasks, day).map(this.renderTask)}
        {getDayItems("habits", habits, day).map(this.renderHabit)}
      </div>
    )
  }
}

export default DayTasks
