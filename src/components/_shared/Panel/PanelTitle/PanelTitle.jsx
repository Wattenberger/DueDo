import React, {Component, PropTypes} from "react"
import classNames from "classnames"
import {connect} from "react-redux"
import Flex from "components/_ui/Flex/Flex"
import Toggle from "components/_ui/Toggle/Toggle"
import {panelsList} from "reducers/panelsReducer"

import {changePanel} from 'actions/panelActions'

require('react-select/dist/react-select.min.css')
require('./PanelTitle.scss')

@connect(state => ({
  panels: state.panels.toJS()
}))
class PanelTitle extends Component {
  static propTypes = {
    title: PropTypes.string,
    panel: PropTypes.string,
    side: PropTypes.string,
    controls: PropTypes.element
  };

  getClassName() {
    return classNames(
      "PanelTitle", this.props.className
    )
  }

  onPanelChange = (newPanel) => {
    let {side} = this.props
    console.log(newPanel)
    this.props.dispatch(changePanel(side, newPanel))
  }

  renderControls() {
    let {controls} = this.props
    return controls
  }

  render() {
    let {title, panel, controls, side} = this.props

    let panelOptions = panelsList[side].map(panel => ({
      value: panel,
      label: panel.substr(0,1).toUpperCase() + panel.slice(1)
    }))

    return (
      <Flex className={this.getClassName()} direction="row">
          <Toggle
            value={panel}
            options={panelOptions}
            onChange={this.onPanelChange}
          />
        {!!controls && this.renderControls()}
      </Flex>
    )
  }
}

export default PanelTitle
