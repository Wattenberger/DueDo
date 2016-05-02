import React, {Component} from "react"
import classNames from "classnames"
import {connect} from "react-redux"
import _ from "lodash"
import moment from "moment"
import Keypress, {KEYS} from 'components/_ui/Keypress/Keypress'
import PanelTitle from "components/_shared/Panel/PanelTitle/PanelTitle"
import Button from "components/_ui/Button/Button"
import Task from "./Task/Task"
import TasksFilters from "./TasksFilters/TasksFilters"

import {addNewTask, getTasks, getHabits, getTags, getContexts, changeFormField} from "actions/taskActions"
import {airtableDateFormat} from "api/airtableAPI"

require('./Tasks.scss')

@connect(state => ({
  day: moment(state.panels.get('day').toJS()).format(airtableDateFormat),
  filters: state.tasks.get('filters').toJS(),
  tasks: state.tasks.get('list')
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

  getFilteredTasks() {
    let {tasks, filters} = this.props

    return tasks
      .filter(task => {
        let valid = true
        Object.keys(filters).forEach(key => {
          let filter = filters[key]
          if (_.isUndefined(filter)) return
          let field = task.fields[key]

          if (
              _.isArray(filter) && !_.intersection(filter, field).length ||
              _.isBoolean(filter) && !!field != filter ||
              _.isString(filter) && field.toLowerCase().indexOf(filter.toLowerCase()) === -1
            ) {
            valid = false
          }
        })
        return valid
      })
  }

  addTask = () => {
    let {day} = this.props

    this.props.dispatch(addNewTask())
    this.props.dispatch(changeFormField("When", day))
  }

  keypresses = {
    [KEYS.n]: this.addTask
  }

  renderTask(task) {
    return <Task task={task} key={task.id} />
  }

  renderAddTask() {
    return <Button onClick={this.addTask}>+</Button>
  }

  render() {
    let filteredTasks = this.getFilteredTasks()

    return (
      <div className={this.getClassName()}>
        <Keypress keys={this.keypresses} />
        <PanelTitle title="Tasks" panel="tasks" controls={this.renderAddTask()} side="left" />
        <TasksFilters />
        <ul>
          {filteredTasks.map(this.renderTask)}
        </ul>
      </div>
    )
  }
}

export default Tasks
