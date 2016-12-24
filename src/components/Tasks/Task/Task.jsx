import React, {Component, PropTypes} from "react"
import _ from "lodash"
import classNames from "classnames"
import {connect} from "react-redux"
import {DragSource} from "react-dnd"
import moment from "moment"
import {dragItemTypes} from "constants/ui"
import Flex from "components/_ui/Flex/Flex"
import Button from "components/_ui/Button/Button"
import Tag from "components/_ui/Tag/Tag"

import {updateTask, editTask, deleteTask, finishTask} from "actions/taskActions"
import {startPomodoro} from "actions/pomodoroActions"
import {airtableDateFormat} from "api/airtableAPI"

require('./Task.scss')

const dateFormat = "MM/DD/YYYY"
const today = moment().format(airtableDateFormat)

const dragConfig = {
  beginDrag(props) {
    return {
      task: props.task
    }
  }
}


@DragSource(dragItemTypes.TASK, dragConfig, (connect, monitor) => ({
  connectDragSource: connect.dragSource(),
  isDragging: monitor.isDragging()
}))
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
    task: PropTypes.object,
    dayContext: PropTypes.object,

    isDragging: PropTypes.bool.isRequired,
    connectDragSource: PropTypes.func.isRequired
  };

  getClassName() {
    let {className, task} = this.props
    return classNames(
      "Task", {
        "Task--important": task.fields.Important,
        "Task--scheduled": task.fields.When && moment(task.fields.When).isAfter(moment().add(-1, "day")),
        "Task--blocked":   task.fields.Blocked,
        "Task--done":      task.fields.Done,
      }, className
    )
  }

  getDetailsClassName() {
    let {expanded} = this.state

    return classNames(
      "Task__details", {
        "Task__details--expanded": expanded
      })
  }

  toggleExpanded = (newState) => {
    let {expanded} = this.state
    newState = _.isBoolean(newState) ? newState : !expanded
    this.setState({expanded: newState})
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
    let {dispatch, task, dayContext} = this.props

    dispatch(finishTask(task, dayContext))
  }

  moveTaskToToday = () => {
    let {dispatch, task} = this.props
    dispatch(updateTask(task.id, {When: today}))
  }

  renderButtons() {
    let {fields} = this.props.task

    const buttons = [
      {icon: "🍅", label: "Pomodoro", onClick: this.startPomodoro, exists: true},
      {icon: "⏰", label: "Move to today", onClick: this.moveTaskToToday, exists: fields.When != today},
      {icon: "🗑", label: "Delete", onClick: this.deleteTask, exists: true},
      {icon: "✓", label: "Finish", onClick: this.finishTask, exists: true},
    ]
    return <div className="Task__buttons">
      {buttons.map(button => button.exists && <Button className="Task__buttons__button" onClick={button.onClick}>{button.icon} {button.label}</Button>)}
    </div>
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
    let {task, contexts, isDragging, connectDragSource} = this.props
    let {fields} = task
    let {expanded} = this.state
    const isBucketList = task.fields.Type == "bucketlist"

    return connectDragSource(
      <div className={this.getClassName()}
           onClick={this.editTask}
           onMouseEnter={this.toggleExpanded.bind(true)}
           onMouseLeave={this.toggleExpanded.bind(false)}>
        <Flex className="Task__overview"
              direction="row">
          <div className="Task__text">
            <h6 className="Task__title">
              {isBucketList && <span className="Task__context-marker">ｼ</span>}
              {fields.Title}
              {isDragging}
            </h6>
          </div>
        </Flex>
        {this.renderButtons()}
      </div>
    )
  }
}

export default Task
// export default DragSource(ItemTypes.CARD, cardSource, collect)(Task);
