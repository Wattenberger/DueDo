import React, {Component, PropTypes} from "react"
import classNames from "classnames"
import {connect} from "react-redux"
import moment from "moment"
import Flex from "components/_ui/Flex/Flex"
import Button from "components/_ui/Button/Button"
import Tag from "components/_ui/Tag/Tag"

import {updateTask, editTask, deleteTask, finishTask} from "actions/taskActions"
import {startPomodoro} from "actions/pomodoroActions"
import {airtableDateFormat} from "api/airtableAPI"

require('./Task.scss')

const dateFormat = "MM/DD/YYYY"
const today = moment().format(airtableDateFormat)

@connect(state => ({
  tags: state.tasks.get('tags'),
  contexts: state.tasks.get('contexts')
}))
class Task extends Component {
  constructor(props) {
    super(props)
    this.state = {
      expanded: false
    }
  }

  static propTypes = {
    task: PropTypes.object
  };

  getClassName() {
    let {task} = this.props
    return classNames(
      "Task", {
        "Task--important": task.fields.Important
      }, this.props.className
    )
  }

  getDetailsClassName() {
    let {expanded} = this.state

    return classNames(
      "Task__details", {
        "Task__details--expanded": expanded
      })
  }

  toggleExpanded = () => {
    let {expanded} = this.state
    this.setState({expanded: !expanded})
  }

  startPomodoro = () => {
    let {dispatch, task} = this.props
    dispatch(startPomodoro(task.id))
  }

  editTask = () => {
    let {dispatch, task} = this.props
    dispatch(editTask(task.id, task.fields))
  }

  deleteTask = () => {
    let {dispatch, task} = this.props
    dispatch(deleteTask(task.id))
  }

  finishTask = () => {
    let {dispatch, task} = this.props
    dispatch(finishTask(task.id))
  }

  moveTaskToToday = () => {
    let {dispatch, task} = this.props
    dispatch(updateTask(task.id, {When: today}))
  }

  renderDetails() {
    let {fields} = this.props.task
    return <div className={this.getDetailsClassName()}>
        {fields.When && <div className="Task__date">{moment(fields.When).format(dateFormat)}</div>}
        <p className="Task__description">{fields.Description}</p>
        <ul>
          {fields.Tags && fields.Tags.map(this.renderTag)}
        </ul>
      </div>
  }

  renderTag = (tag, idx) => {
    let {tags} = this.props
    return <Tag key={idx}>{tags[tag]}</Tag>
  }

  render() {
    let {task, contexts} = this.props
    let {fields} = task
    let {expanded} = this.state
    let contextList = fields.Contexts && fields.Contexts.map(context => contexts[context])
    const isBucketList = contextList.includes("ｼ bucketlist")

    return (
      <div className={this.getClassName()}>
        <Flex className="Task__overview" direction="row" onClick={this.toggleExpanded}>
          <div className="Task__text">
            <h6 className="Task__title">
              {isBucketList && <span className="Task__context-marker">ｼ</span>}
              {fields.Title}
            </h6>
            <div className="Task__buttons">
                <Button onClick={this.startPomodoro}>🍅</Button>
              {fields.When != today && <Button onClick={this.moveTaskToToday}>⏰</Button>}
              <Button onClick={this.editTask}>🖉</Button>
              <Button onClick={this.deleteTask}>🗑</Button>
              <Button onClick={this.finishTask}>✓</Button>
            </div>
          </div>
        </Flex>
        {this.renderDetails()}
      </div>
    )
  }
}

export default Task
