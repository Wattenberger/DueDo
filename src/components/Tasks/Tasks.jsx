import React, {Component} from "react"
import classNames from "classnames"
import {connect} from "react-redux"
import _ from "lodash"
import moment from "moment"
import ScrollableContainer from "components/_ui/ScrollableContainer/ScrollableContainer"
import Keypress, {KEYS} from 'components/_ui/Keypress/Keypress'
import PanelTitle from "components/_shared/Panel/PanelTitle/PanelTitle"
import Button from "components/_ui/Button/Button"
import Task from "./Task/Task"
import TasksFilters from "./TasksFilters/TasksFilters"
import Pomodoro from "components/Pomodoro/Pomodoro"

import {addNewTask, getTasks, updateTasks, getTags, getContexts, getProjects, changeFormField} from "actions/taskActions"
import {airtableDateFormat} from "api/airtableAPI"

require('./Tasks.scss')

@connect(state => ({
  day: moment(state.dayView.get('day').toJS()).format(airtableDateFormat),
  filters: state.tasks.get('filters').toJS(),
  tasks: state.tasks.get('list'),
  contexts: state.tasks.get('contexts')
}))
class Tasks extends Component {
  componentWillMount() {
    this.props.dispatch(getTasks()).then(() => {
      this.props.dispatch(updateTasks(this.props.tasks))
    })
    this.props.dispatch(getTags())
    this.props.dispatch(getContexts())
    this.props.dispatch(getProjects())
  }

  getClassName() {
    let {className} = this.props
    return classNames(className, "Tasks")
  }

  filterTask = task => {
    let {filters} = this.props

    let valid = true
    Object.keys(filters).forEach(key => {
      let filter = filters[key]
      if (_.isUndefined(filter)) return
      let field = task.fields[key]

      if (
          (_.isArray(filter) && !_.intersection(filter, field).length) ||
          (_.isBoolean(filter) && !!field != filter) ||
          (!_.isUndefined(field) && _.isString(filter) && field.toLowerCase().indexOf(filter.toLowerCase()) === -1)
        ) {
        valid = false
        return
      }
    })
    return valid
  }

  sortTask = task => task.fields.Blocked  ? "2" :
                     task.fields.When     ? "1" + moment(task.fields.When).valueOf() :
                                            "0" + (task.fields.Title || "").toLowerCase()

  getFilteredTasks() {
    let {tasks} = this.props
    if (!_.isArray(tasks)) return []

    return _.chain(tasks)
      .filter(this.filterTask)
      .sortBy(this.sortTask)
      .value()
  }

  filterByContext(tasks, context) {
    return tasks.filter(task =>  task && task.fields && _.includes(task.fields.Contexts, context))
  }

  renderAllUndoneTasks() {
    let {tasks, contexts} = this.props
    let usedContexts = _.chain(tasks)
      .map(task => task && task.fields && task.fields.Contexts)
      .flatten()
      .uniq()
      .sortBy(slug => (contexts[slug] || "").toLowerCase())
      .value()

    return usedContexts.map((context, idx) =>
      <div className="Tasks__context" key={`task-contexts--${context}`}>
        <h6>{contexts[context]}</h6>
        <ul>
          {this.filterByContext(tasks.filter(task => !task.fields.Done), context).map(this.renderTask)}
        </ul>
      </div>
    )
  }


  addTask = () => {
    let {day} = this.props

    this.props.dispatch(addNewTask())
    this.props.dispatch(changeFormField("When", day))
  }

  keypresses = {
    [KEYS.n]: this.addTask
  }

  renderTasks() {
    return _.keys(this.props.filters).length
      ? <ul>{this.getFilteredTasks().map(this.renderTask)}</ul>
      : this.renderAllUndoneTasks()
  }

  renderTask(task) {
    return <Task task={task} key={task.id} />
  }

  renderAddTask() {
    return <Button className="Tasks__add-task" onClick={this.addTask}>+</Button>
  }

  render() {
    return (
      <div className={this.getClassName()}>
        <Keypress keys={this.keypresses} />
        {this.renderAddTask()}
        <TasksFilters />
        <Pomodoro />
        <ScrollableContainer className="Tasks__ScrollableContainer">
          {this.renderTasks()}
        </ScrollableContainer>
      </div>
    )
  }
}

export default Tasks
