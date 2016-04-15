import React, {Component, PropTypes} from "react"
import classNames from "classnames"
import Flex from "components/_ui/Flex/Flex"
import Select from "react-select"

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
    type: PropTypes.oneOf(["text", "number", "checkbox", "textarea", "select"]),
    selectOptions: PropTypes.object,
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

  onChange = (e) => {
    let newVal = e.target.value
    this.props.onChange(newVal)
  }

  onCheckboxChange = (e) => {
    let newVal = !e.target.checked
    this.props.onChange(!newVal)
  }

  onSelectChange = (newVal) => {
    this.props.onChange(newVal)
  }

  renderInput = () => {
    let {value, type} = this.props
    if (type === "checkbox") return this.renderCheckbox()
    if (type === "textarea") return this.renderTextArea()
    if (type === "select") return this.renderSelect()
    return <input type={type} value={value} onChange={this.onChange} />
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
    let {value, options, selectOptions} = this.props
    return <Select
        name="select"
        value={value}
        clearable={false}
        options={options}
        {...selectOptions}
        onChange={this.onSelectChange}
      />
  }

  render() {
    let {label, value} = this.props

    return (
      <Flex className={this.getClassName()} direction="row">
        <label className="Field__label">{label}</label>
        <div className="Field__input">
          {this.renderInput()}
        </div>
      </Flex>
    )
  }
}

export default Field
