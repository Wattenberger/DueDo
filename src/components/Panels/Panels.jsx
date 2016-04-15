import React, {Component} from "react"
import classNames from "classnames"
import {connect} from "react-redux"
import {changePanel} from 'actions/panelActions'
import ResizableComponent from 'components/_ui/ResizableComponent/ResizableComponent';
import Panel from "components/_shared/Panel/Panel"
import Tasks from "components/Tasks/Tasks"
import AddTask from "components/Tasks/AddTask/AddTask"
import Calendar from "components/Calendar/Calendar"
import DayView from "components/DayView/DayView"

require('./Panels.scss')
const initPanelRatio = 0.3
const panelsMap = {
  tasks: Tasks,
  habits: Tasks,
  addTask: AddTask,
  calendar: Calendar,
  day: DayView
}
const resizableComponentOptions = {
  minWidth: 150
}

@connect(state => ({
  panels: state.panels,
  day: state.panels.day
}))
class Panels extends Component {
  getClassName() {
    return classNames("Panels")
  }

  renderPanel(side) {
    let {panels} = this.props
    let component = panelsMap[panels[side]]
    if (!component) return
    return <Panel className={`Panel--${side}`} component={component} />
  }

  onDuringResize = (width) => {
    this.setState({resizableComponentWidth: width})
  }

  render() {
    let {panels} = this.props
    const initialWidth = window.innerWidth * initPanelRatio

    return (
      <div className={this.getClassName()}>
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
