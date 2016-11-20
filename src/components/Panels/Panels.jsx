import React, {Component} from "react"
import classNames from "classnames"
import {connect} from "react-redux"
import {changePanel} from 'actions/panelActions'
import ResizableComponent from 'components/_ui/ResizableComponent/ResizableComponent';
import Modal from "components/_shared/Modal/Modal"
import Panel from "components/_shared/Panel/Panel"
import Tasks from "components/Tasks/Tasks"
import TaskForm from "components/Tasks/TaskForm/TaskForm"
import Calendar from "components/Calendar/Calendar"
import DayView from "components/DayView/DayView"

import {auth, fetchEvents} from "actions/googleActions"

require('./Panels.scss')

const initPanelRatio = 0.76
const panelsMap = {
  tasks: Tasks,
  habits: Tasks,
  bucketlist: Tasks,
  calendar: Calendar,
  day: DayView
}
const resizableComponentOptions = {
  minWidth: 150
}

@connect(state => ({
  panels: state.panels.toJS()
}))
class Panels extends Component {
  getClassName() {
    return classNames("Panels")
  }

  componentDidMount = async () => {
    await(this.props.dispatch(auth()))
    this.props.dispatch(fetchEvents())
  }

  renderPanel(side) {
    let {panels} = this.props
    let component = panelsMap[panels[side]]
    if (!component) return
    return <Panel
                className={`Panel--${side}`}
                component={component}
           />
  }

  onDuringResize = (width) => {
    this.setState({resizableComponentWidth: width})
  }

  render() {
    let {panels} = this.props
    const initialWidth = window.innerWidth * initPanelRatio

    return (
      <div className={this.getClassName()}>
        <Modal id="taskForm" component={TaskForm} />
        <ResizableComponent
          height="100%"
          width={initialWidth}
          options={resizableComponentOptions}
          direction="e"
          onDuringResize={this.onDuringResize}
        >
          {this.renderPanel('left')}
        </ResizableComponent>
        {this.renderPanel('right')}
      </div>
    )
  }
}

export default Panels
