import React, {Component} from "react"
import PropTypes from 'prop-types';
import classNames from "classnames"

require('./Panel.scss')

class Panel extends Component {
  static propTypes = {
    component: PropTypes.func.isRequired,
    photoBackground: PropTypes.bool
  };

  getClassName() {
    return classNames(
      "Panel", {
        "Panel--photo-background": this.props.photoBackground
      }, this.props.className
    )
  }

  renderComponent() {
    let Component = this.props.component
    return <Component />
  }

  render() {
    let {title} = this.props

    return (
      <div className={this.getClassName()}>
        <div className="Panel__container">
          {this.renderComponent()}
        </div>
      </div>
    )
  }
}

export default Panel
