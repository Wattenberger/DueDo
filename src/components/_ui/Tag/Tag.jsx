import React, {Component} from "react"
import PropTypes from 'prop-types';
import classNames from "classnames"

require('./Tag.scss')

class Tag extends Component {
  getClassName() {
    return classNames(
      "Tag", this.props.className
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

export default Tag
