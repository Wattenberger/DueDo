import React, {Component, PropTypes} from "react"
import classNames from "classnames"

require('./Panel.scss')

class Panel extends Component {
  static propTypes = {
    component: PropTypes.func.isRequired
  };

  getClassName() {
    return classNames(
      "Panel", this.props.className
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
