import React, {Component, PropTypes} from "react"
import classNames from "classnames"
import {connect} from "react-redux"
import Select from "react-select"
import Button from "components/_ui/Button/Button"
import Field from "components/_ui/Field/Field"
import PanelTitle from "components/_shared/Panel/PanelTitle/PanelTitle"

import {changePanel} from 'actions/panelActions'
import {createTask} from 'actions/taskActions'

require('react-select/dist/react-select.min.css')
require('./AddTask.scss')

@connect(state => ({
  tags: state.tasks.tags,
  contexts: state.tasks.contexts
}))
class AddTask extends Component {
  constructor(props) {
    super(props)
    this.state = {
    }
  }

  getClassName() {
    return classNames(
      "AddTask", this.props.className
    )
  }

  getOptions(field) {
    let values = _.values(this.props[field])
    return values.map(val => ({
      label: val,
      value: val
    }))
  }

  onChange = (slug, newVal) => {
    this.setState({[slug]: newVal})
  }

  onSubmit = (e) => {
    e.preventDefault()
    this.props.dispatch(createTask(this.state))
  }

  renderField = (field, idx) => {
    return <Field
        key={idx}
        label={field.label}
        value={this.state[field.slug]}
        type={field.type}
        options={field.options}
        selectOptions={field.selectOptions}
        onChange={this.onChange.bind(this, field.slug)}
      />
  }

  render() {
    const fields = [
      {slug: "Title", label: "Title"},
      {slug: "Description", label: "Description", type: "textarea"},
      {slug: "Tags", label: "Tags", type: "select", options: this.getOptions("tags"), selectOptions: {multi: true}},
      {slug: "Context", label: "Context", type: "select", options: this.getOptions("contexts")},
      {slug: "Blocked", label: "Blocked", type: "checkbox"},
      {slug: "Important", label: "Important", type: "checkbox"},
    ]

    return (
      <div className={this.getClassName()}>
        <PanelTitle title="Add Task" panel="addTask" />
        <form onSubmit={this.onSubmit}>
          {fields.map(this.renderField)}
          <Button type="submit">Create</Button>
        </form>
      </div>
    )
  }
}

export default AddTask
