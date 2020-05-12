import React, {Component} from "react"
import PropTypes from 'prop-types';
import classNames from "classnames"
import _ from "lodash"
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
    let {value, options, onChange, ...rest} = this.props

    return (
      <div {...rest} className={this.getClassName()}>
        {options.map((option, idx) =>
          (<Button key={idx}
                   type="button"
                   className={this.getOptionClassName(option.value)}
                   onClick={this.onChange.bind(this, option)}
          >
            {_.isUndefined(option.label) ? option.value : option.label}
          </Button>)
        )}
      </div>
      )
  }
}

export default Toggle
