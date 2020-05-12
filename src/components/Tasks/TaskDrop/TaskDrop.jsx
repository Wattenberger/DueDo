import React, {Component} from "react"
import PropTypes from 'prop-types';
import classNames from "classnames"
import {connect} from "react-redux"
import {DropTarget} from "react-dnd"
import {dragItemTypes} from "constants/ui"

import {airtableDateFormat} from "api/airtableAPI"
import {updateTask} from "actions/taskActions"

const dropConfig = {
  drop(props, monitor, component) {
    let {task} = monitor.getItem()
    let {day} = props
    const newField = {When: day.format(airtableDateFormat)}

    props.dispatch(updateTask(task.id, newField))
  }
}

require('./TaskDrop.scss')

@connect()
@DropTarget(dragItemTypes.TASK, dropConfig, (connect, monitor) => ({
  connectDropTarget: connect.dropTarget(),
  isOver: monitor.isOver()
}))
class TaskDrop extends Component {
  constructor(props) {
    super(props)
    this.state = {
    }
  }

  static propTypes = {
    isOver: PropTypes.bool.isRequired
  };

  getClassName() {
    let {className, isOver} = this.props

    return classNames(className,
      "TaskDrop", {
      "TaskDrop--is-over": isOver
    })
  }

  render() {
    let {className, children, connectDropTarget, isOver, ...rest} = this.props
    const childrenWithProps = React.Children.map(children,
      child => React.cloneElement(child, rest)
    )

    return connectDropTarget(
      <div className={this.getClassName()}>
        {childrenWithProps}
      </div>
    )
  }
}

export default TaskDrop
