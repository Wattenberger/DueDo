import React, {Component, PropTypes} from "react"
import classNames from "classnames"
import Button from "components/_ui/Button/Button"

require('./Toggle.scss')

class Toggle extends Component {
  static PropTypes = {
    value: PropTypes.string,
    options: PropTypes.array,
    onChange: PropTypes.func
  }

  static defaultProps = {
  }

  getClassName() {
    return classNames(
      "Toggle", this.props.className
    )
  }

  getOptionClassName(slug) {
    let {value} = this.props

    return classNames(
      "Toggle__option", {
        "Toggle__option--selected": slug == value
      }
    )
  }

  onChange = (option, e) => {
    this.props.onChange(option.value, e)
  }

  render() {
    let {value, options} = this.props

    return (
      <div {...this.props} className={this.getClassName()}>
        {options.map((option, idx) =>
          (<Button type="button"
                   className={this.getOptionClassName(option.value)}
                   onClick={this.onChange.bind(this, option)}
          >
            {option.label}
          </Button>)
        )}
      </div>
      )
  }
}

export default Toggle
