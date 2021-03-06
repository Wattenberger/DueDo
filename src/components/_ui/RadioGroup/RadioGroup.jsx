import React, {Component} from "react"
import PropTypes from 'prop-types';
import classNames from "classnames"
import {isObject} from "lodash"

require('./RadioGroup.scss')

class RadioGroup extends Component {
  static propTypes = {
    options: PropTypes.array,
    value: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.object
    ]),
    clear: PropTypes.bool,
    onSelect: PropTypes.func,
    onClear: PropTypes.func
  };

  static defaultProps = {
    options: [],
    onSelect: () => {},
    onClear: () => {}
  };

  getClassName() {
    return classNames(
      "RadioGroup", this.props.className
    )
  }

  getOptionStyle(option) {
    let style = {}
    if (option.color) style.color = option.color
    return style
  }

  renderOption(option, idx) {
    let {value} = this.props

    let className = classNames(
      "RadioGroup__option", {
        "RadioGroup__option--selected": option === value
      }
    )
    return <button className={className} style={this.getOptionStyle(option)} onClick={this.props.onSelect.bind(this, option)} key={idx}>
      {isObject(option) ? option.value : option}
    </button>
  }

  renderClear() {
    return <div className="RadioGroup__option RadioGroup__clear" onClick={this.props.onClear.bind(this)}>x</div>
  }

  render() {
    let {options, clear} = this.props

    return (
      <div className={this.getClassName()}>
        {options.map(this.renderOption.bind(this))}
        {clear && this.renderClear.bind(this)()}
      </div>
    )
  }
}

export default RadioGroup
