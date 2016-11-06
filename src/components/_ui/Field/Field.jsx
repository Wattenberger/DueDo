import React, {Component, PropTypes} from "react"
import ReactDOM from 'react-dom'
import classNames from "classnames"
import _ from "lodash"
import Flex from "components/_ui/Flex/Flex"
import Select from "react-select"
import Toggle from "components/_ui/Toggle/Toggle"
import DateInput from "./DateInput/DateInput"

require('./Field.scss')

class Field extends Component {
  static propTypes = {
    label: PropTypes.string,
    value: PropTypes.oneOfType([
      PropTypes.bool,
      PropTypes.string,
      PropTypes.array,
      PropTypes.object
    ]),
    options: PropTypes.array,
    type: PropTypes.oneOf(["text", "number", "date", "checkbox", "textarea", "select", "toggle"]),
    fieldOptions: PropTypes.object,
    autoFocus: PropTypes.bool,
    onChange: PropTypes.func
  }

  static defaultProps = {
    type: "text"
  }

  getClassName() {
    let {type} = this.props
    return classNames(
      "Field", `Field--${type}`, this.props.className
    )
  }

  componentDidMount() {
    let {autoFocus} = this.props

    if (autoFocus && this.refs.input) {
      setTimeout(() => {
        ReactDOM.findDOMNode(this.refs.input).focus();
      }, 100)
    }
  }

  onChange = (e) => {
    e.preventDefault()
    let {type} = this.props
    let newVal = e.target.value

    if (type == "number") newVal = +newVal
    this.props.onChange(newVal)
  }

  onCheckboxChange = (e) => {
    let newVal = !e.target.checked
    this.props.onChange(!newVal)
  }

  onSelectChange = (newVal) => {
    this.props.onChange(newVal)
  }

  onToggleChange = (newVal, e) => {
    this.props.onChange(newVal, e)
  }

  renderInput = () => {
    let {value, type, autoFocus} = this.props

    if (type === "checkbox") return this.renderCheckbox()
    if (type === "textarea") return this.renderTextArea()
    if (type === "select") return this.renderSelect()
    if (type === "toggle") return this.renderToggle()
    if (type === "date") return this.renderDateInput()
    return <input type={type} value={value} onChange={this.onChange} ref="input" />
  }

  renderCheckbox() {
    let {value} = this.props
    return <input type="checkbox" checked={value} value={value} onChange={this.onCheckboxChange} />
  }

  renderTextArea() {
    let {value} = this.props
    return <textarea value={value} onChange={this.onChange} />
  }

  renderSelect() {
    let {value, options, fieldOptions} = this.props

    return <Select
        name="select"
        value={value}
        clearable={false}
        options={options}
        {...fieldOptions}
        onChange={this.onSelectChange}
      />
  }

  renderToggle() {
    let {value, options, fieldOptions} = this.props

    return <Toggle
        value={value}
        options={options}
        {...fieldOptions}
        onChange={this.onToggleChange}
      />
  }

  renderDateInput() {
    let {value, fieldOptions, onChange} = this.props

    return <DateInput
        value={value}
        {...fieldOptions}
        onChange={onChange}
      />
  }

  render() {
    let {label, value} = this.props

    return (
      <Flex className={this.getClassName()} direction="row">
        {label && <label className="Field__label">{label}</label>}
        <div className="Field__input">
          {this.renderInput()}
        </div>
      </Flex>
    )
  }
}

export default Field
