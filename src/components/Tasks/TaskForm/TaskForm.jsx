import React, {Component, PropTypes} from "react"
import classNames from "classnames"
import {connect} from "react-redux"
import moment from "moment"
import Select from "react-select"
import Button from "components/_ui/Button/Button"
import ButtonGroup from "components/_ui/Button/ButtonGroup/ButtonGroup"
import Field from "components/_ui/Field/Field"
import PanelTitle from "components/_shared/Panel/PanelTitle/PanelTitle"

import {airtableDateFormat} from "api/airtableAPI"

import {closeModal} from "actions/modalActions"
import {changePanel} from 'actions/panelActions'
import {dateFormat, createTask, changeFormField, submitForm} from 'actions/taskActions'

require('react-select/dist/react-select.min.css')
require('./TaskForm.scss')

const typeOptions = [
  {value: "task", label: "task"},
  {value: "habit", label: "habit"},
  {value: "bucketlist", label: "bucketlist"},
  {value: "goal", label: "goal"},
]
const taskTypes = ["task", "habit", "bucketlist"]
const goalIntervalOptions = [{value: "day"}, {value: "week"}, {value: "month"}, {value: "year"}]
const intervalMap = {
  day: "DDD",
  week: "w",
  month: "M",
  year: "YYYY",
}
const daysOfTheWeek = [
  {value: 0, label: "Sunday"},
  {value: 1, label: "Monday"},
  {value: 2, label: "Tuesday"},
  {value: 3, label: "Wednesday"},
  {value: 4, label: "Thursday"},
  {value: 5, label: "Friday"},
  {value: 6, label: "Saturday"},
]

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

  getFields() {
    let {form} = this.props

    let fields = [
      {slug: "Type", type: "toggle", options: typeOptions},
      {render: this.renderIntervalFields, mustHaveType: "habit"},
      {slug: "Title"},
      {slug: "Goal--Index", label: "Index", type: "number", fieldOptions: {positive: true}, mustHaveType: "goal"},
      {slug: "Goal--Interval", label: "Interval", type: "toggle", options: goalIntervalOptions, mustHaveType: "goal"},
      {slug: "Description", type: "textarea", mustHaveType: taskTypes},
      {slug: "Tags", type: "select", options: this.getOptions("tags"), fieldOptions: {multi: true, allowCreate: true}, mustHaveType: taskTypes},
      {slug: "Contexts", type: "select", options: this.getOptions("contexts"), fieldOptions: {multi: true, allowCreate: true}, mustHaveType: taskTypes},
      {slug: "When", type: "date", fieldOptions: {dateFormat: dateFormat.form}, mustHaveType: ["task", "bucketlist"]},
      {slug: "Blocked", type: "checkbox", mustHaveType: taskTypes},
      {slug: "Important", type: "checkbox", mustHaveType: taskTypes},
    ]

    if (form.Type) fields = fields.filter(field =>
      !field.mustHaveType ||
      _.isString(field.mustHaveType) && field.mustHaveType == form.Type ||
      _.isArray(field.mustHaveType) && _.includes(field.mustHaveType, form.Type)
    )
    return fields
  }

  getOptions(field) {
    return Object.keys(this.props[field]).map((key, val) => ({
      label: this.props[field][key],
      value: key
    }))
  }

  onChange = async (field, newVal) => {
    await this.props.dispatch(changeFormField(field.slug, newVal))
    if (_.includes(["Type", "Goal--Index", "Goal--Interval"], field.slug)) this.updateGoalFields()
  }

  onDowToggle = (dow) => {
    let {form} = this.props
    let dows = form["Habit--DOW"] ?
               form["Habit--DOW"].split("").map(dow => +dow) :
               []

    if (_.includes(dows, dow.value)) {
      let idx = dows.indexOf(dow.value)
      dows.splice(idx, 1)
    } else {
      dows.push(dow.value)
      dows.sort()
    }
    dows = dows.join("")
    this.onChange({slug: "Habit--DOW"}, dows)
  }

  onSubmit = (e) => {
    let {dispatch} = this.props
    e.preventDefault()
    this.props.dispatch(submitForm())
  }

  updateGoalFields = async () => {
    let {form} = this.props
    const interval = form.Type == "goal" ?
                     form["Goal--Interval"] || "week" :
                     undefined
    await this.props.dispatch(changeFormField("Goal--Interval", interval))
    this.props.dispatch(changeFormField("Goal--Index", form.Type == "goal" ? +moment().format(intervalMap[interval]) : undefined))
  }

  renderField = (field, idx) => {
    let {form} = this.props

    return field.render && field.render() ||
      <Field
        key={idx}
        label={field.label || field.slug}
        value={form[field.slug]}
        type={field.type}
        options={field.options}
        fieldOptions={field.fieldOptions}
        onChange={this.onChange.bind(this, field)}
        autoFocus={field.slug == "Title"}
      />
  }

  renderIntervalFields = () => {
    let {form} = this.props
    let dows = form["Habit--DOW"] && form["Habit--DOW"]
                 .split("")
                 .map(dow => +dow)

    let buttons = daysOfTheWeek.map(dow => {
      dow.active = _.includes(dows, dow.value)
      return dow
    })

    return <div className="TaskForm__instructions-fields">
        <ButtonGroup buttons={buttons}
                     onChange={this.onDowToggle}
        />
      </div>
  }

  render() {
    let {formId, form} = this.props
    let fields = this.getFields()

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
