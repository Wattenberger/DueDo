import React, {Component} from "react"
import classNames from "classnames"
import {connect} from "react-redux"
import PanelTitle from "components/_shared/Panel/PanelTitle/PanelTitle"
import Task from "./Task/Task"

import {getTasks, getHabits, getTags, getContexts} from "actions/taskActions"

require('./Tasks.scss')

@connect(state => ({
  tasks: state.tasks.list
}))
class Tasks extends Component {
  componentWillMount() {
    this.props.dispatch(getTasks())
    this.props.dispatch(getHabits())
    this.props.dispatch(getTags())
    this.props.dispatch(getContexts())
  }

  getClassName() {
    return classNames("Tasks")
  }

  renderTask(task) {
    return <Task task={task} key={task.id} />
  }

  render() {
    let {tasks} = this.props

    return (
      <div className={this.getClassName()}>
        <PanelTitle title="Tasks" panel="tasks" />
        <ul>
          {tasks.map(this.renderTask)}
        </ul>
      </div>
    )
  }
}

export default Tasks
