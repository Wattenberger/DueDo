import React, {Component, PropTypes} from "react"
import classNames from "classnames"
import {connect} from "react-redux"
import Flex from "components/_ui/Flex/Flex"
import Select from "react-select"
import {panelsList} from "reducers/panelsReducer"

import {changePanel} from 'actions/panelActions'

require('react-select/dist/react-select.min.css')
require('./PanelTitle.scss')

@connect(state => ({
  panels: state.panels,
  day: state.panels.day
}))
class PanelTitle extends Component {
  static propTypes = {
    title: PropTypes.string,
    panel: PropTypes.string
  };

  getClassName() {
    return classNames(
      "PanelTitle", this.props.className
    )
  }

  getSide() {
    let {panel, panels} = this.props
    return panels.left === panel ? "left" : "right"
  }

  onPanelChange = (newPanel) => {
    let side = this.getSide()
    this.props.dispatch(changePanel(side, newPanel.value))
  }

  render() {
    let {title, panel} = this.props
    let panelOptions = panelsList.map(panel => ({
      value: panel,
      label: panel.substr(0,1).toUpperCase() + panel.slice(1)
    }))

    return (
      <Flex className={this.getClassName()} direction="column">
        <h4 className="Panel__title">
          <Select
            name="panels-list-select"
            value={panel}
            clearable={false}
            options={panelOptions}
            onChange={this.onPanelChange}
            />
        </h4>
      </Flex>
    )
  }
}

export default PanelTitle
