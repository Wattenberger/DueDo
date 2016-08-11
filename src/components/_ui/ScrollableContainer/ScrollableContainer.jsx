import React, {Component, PropTypes} from "react"
import classNames from "classnames"

require('./ScrollableContainer.scss')

class ScrollableContainer extends Component {
  getClassName() {
    return classNames(
      "ScrollableContainer", this.props.className
    )
  }

  render() {
    return (
      <div {...this.props} className={this.getClassName()}>
        {this.props.children}
      </div>
      )
  }
}

export default ScrollableContainer
