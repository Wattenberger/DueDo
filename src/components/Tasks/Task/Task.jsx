import React, {Component} from "react"
import PropTypes from 'prop-types';
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

const dateFormat = "M/DD"
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
  isDragging: monitor.isDragging(),
}))
@connect(state => ({
  tags: state.tasks.get('tags'),
  contexts: state.tasks.get('contexts')
}))
class Task extends Component {
  constructor(props) {
    super(props)
    this.state = {
    }
  }

  static propTypes = {
    task: PropTypes.object,
    dayContext: PropTypes.object,
    habitInfo: PropTypes.object,

    connectDragSource: PropTypes.func.isRequired,
    isDragging: PropTypes.bool.isRequired,
  };

  getClassName() {
    let {className, task, isDragging} = this.props

    return classNames(
      "Task", {
        "Task--important": task.fields.Important,
        "Task--scheduled": task.fields.When && moment(task.fields.When).isAfter(moment().add(-1, "day")),
        "Task--blocked":   task.fields.Blocked,
        "Task--done":      task.fields.Done,
        "Task--dragging":  isDragging,
      }, className
    )
  }

  getDetailsClassName() {
    let {expanded} = this.state

    return"Task__details"
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

  isScheduled = () => {
    let {task, habitInfo} = this.props
    let {fields} = task
    const isDone = (habitInfo && habitInfo.done) || fields.Done
    return !isDone && fields.When
  }

  renderButtons() {
    let {task, habitInfo} = this.props
    let {fields} = task
    const isDone = (habitInfo && habitInfo.done) || fields.Done
    const now = moment()
    const isToday = moment(fields.When).isSame(now, "day")

    const buttons = [
      {icon: "🍅", label: "Pomodoro", onClick: this.startPomodoro, exists: !isDone},
      {icon: "⏰", label: "Move to today", onClick: this.moveTaskToToday, exists: this.isScheduled() && !isToday},
      {icon: "🗑", label: "Delete", onClick: this.deleteTask, exists: true},
      {icon: "✓", label: fields.Type == "habit" ? "Done" : "Finish", onClick: this.finishTask, exists: !isDone},
    ]
    return <div className="Task__buttons">
      {buttons.map((button, idx) => {
        const noBubbleClick = (e, ...args) => {
          e.stopPropagation()
          button.onClick(...args)
        }
        return button.exists &&
          <Button className="Task__buttons__button" onClick={noBubbleClick} key={idx}>
            {button.icon} {button.label}
          </Button>
      })}
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
    let {task, contexts, dayContext, connectDragSource} = this.props
    let {fields} = task
    let {expanded} = this.state

    return connectDragSource(
      <div className={this.getClassName()}>
        <Flex className="Task__overview"
              direction="row"
              onClick={this.editTask}>
          <div className="Task__text">
            <div className="Task__title">
              <div className="Task__title__title">{fields.Title}</div>
              {this.isScheduled() &&
                <div className="Task__title__scheduled">
                  {fields.When == today || (dayContext && dayContext.isSame(moment(), "day")) ?
                    "Today" :
                    moment(fields.When).format(dateFormat)
                  }
                </div>
              }
            </div>
          </div>
        </Flex>
        {this.renderButtons()}
      </div>
    )
  }
}

export default Task
// export default DragSource(ItemTypes.CARD, cardSource, collect)(Task);
