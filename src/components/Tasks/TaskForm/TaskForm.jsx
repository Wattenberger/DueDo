import React, {Component, PropTypes} from "react"
import classNames from "classnames"
import {connect} from "react-redux"
import moment from "moment"
import Select from "react-select"
import Button from "components/_ui/Button/Button"
import Field from "components/_ui/Field/Field"
import PanelTitle from "components/_shared/Panel/PanelTitle/PanelTitle"

import {airtableDateFormat} from "api/airtableAPI"

import {closeModal} from "actions/modalActions"
import {changePanel} from 'actions/panelActions'
import {dateFormat, createTask, createNewOption, changeFormField, submitForm} from 'actions/taskActions'

require('react-select/dist/react-select.min.css')
require('./TaskForm.scss')

@connect(state => ({
  tags: state.tasks.get('tags'),
  contexts: state.tasks.get('contexts'),
  formId: state.tasks.get('formId'),
  form: state.tasks.get('form').toJS()
}))
class TaskForm extends Component {
  getClassName() {
    return classNames(
      "TaskForm", this.props.className
    )
  }

  getOptions(field) {
    return Object.keys(this.props[field]).map((key, val) => ({
      label: this.props[field][key],
      value: key
    }))
  }

  onChange = (field, newVal) => {
    this.props.dispatch(changeFormField(field.slug, newVal))
  }

  onSubmit = (e) => {
    let {dispatch} = this.props
    e.preventDefault()
    this.props.dispatch(submitForm())
  }

  renderField = (field, idx) => {
    let {form} = this.props

    return <Field
        key={idx}
        label={field.label}
        value={form[field.slug]}
        type={field.type}
        options={field.options}
        fieldOptions={field.fieldOptions}
        onChange={this.onChange.bind(this, field)}
        autoFocus={!idx}
      />
  }

  render() {
    let {formId, form} = this.props
    const fields = [
      {slug: "Title", label: "Title"},
      {slug: "Description", label: "Description", type: "textarea"},
      {slug: "Tags", label: "Tags", type: "select", options: this.getOptions("tags"), fieldOptions: {multi: true, allowCreate: true}},
      {slug: "Contexts", label: "Contexts", type: "select", options: this.getOptions("contexts"), fieldOptions: {multi: true, allowCreate: true}},
      {slug: "When", label: "When", type: "date", fieldOptions: {dateFormat: dateFormat.form}},
      {slug: "Blocked", label: "Blocked", type: "checkbox"},
      {slug: "Important", label: "Important", type: "checkbox"},
    ]

    return (
      <div className={this.getClassName()}>
        <h3>{formId ? `Edit '${form.Title}'` : "Create a Task"}</h3>

        <form onSubmit={this.onSubmit}>
          <div className="TaskForm__fields">
            {fields.map(this.renderField)}
          </div>
          <Button type="submit">{formId ? `Save` : "Create"}</Button>
        </form>
      </div>
    )
  }
}

export default TaskForm
