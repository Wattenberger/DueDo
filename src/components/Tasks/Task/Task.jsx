import React, {Component, PropTypes} from "react"
import classNames from "classnames"
import {connect} from "react-redux"
import Flex from "components/_ui/Flex/Flex"
import Tag from "components/_ui/Tag/Tag"

require('./Task.scss')

@connect(state => ({
  tags: state.tasks.tags,
  contexts: state.tasks.contexts
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

  renderDetails() {
    let {fields} = this.props.task
    return <div className={this.getDetailsClassName()}>
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

    return (
      <div className={this.getClassName()}>
        <Flex className="Task__overview" direction="row" onClick={this.toggleExpanded}>
          <div className="Task__text">
            <h6 className="Task__title">{fields.Title}</h6>
          </div>
          <div>
            {fields.Context && <h6 className="Task__context">{contexts[fields.Context[0]]}</h6>}
          </div>
        </Flex>
        {this.renderDetails()}
      </div>
    )
  }
}

export default Task
