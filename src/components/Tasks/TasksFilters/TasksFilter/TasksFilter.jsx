import React, {Component} from "react"
import PropTypes from 'prop-types';
import classNames from "classnames"
import {connect} from "react-redux"
import _ from "lodash"
import Flex from "components/_ui/Flex/Flex"
import Field from "components/_ui/Field/Field"

import {getTasks, updateTasks, changeFilter, removeFilter} from "actions/taskActions"

require('./TasksFilter.scss')

@connect(state => ({
  filters: state.tasks.get('filters').toJS(),
  tags: state.tasks.get('tags'),
  contexts: state.tasks.get('contexts'),
  projects: state.tasks.get('projects'),
}))
class TasksFilter extends Component {
  static propTypes = {
    type: PropTypes.oneOf(["text", "select", "checkbox"]),
    field: PropTypes.string
  }

  static defaultProps = {
    type: "text"
  }

  getClassName() {
    return classNames(
      "TasksFilter", this.props.className
    )
  }

  getOptions() {
    let field = this.props.field.toLowerCase()

    return this.props[field] && Object.keys(this.props[field]).map((key, val) => ({
      label: this.props[field][key],
      value: key
    }))
  }

  onChange = (newVal) => {
    let {field, type} = this.props
    if (_.isUndefined(newVal) || _.isString(newVal) && !newVal.length) {
      this.props.dispatch(removeFilter(field))
    } else {
      this.props.dispatch(changeFilter(field, newVal))
      if (field == "Done" && newVal) {
        this.props.dispatch(getTasks())
      }
    }
  }

  render() {
    let {filters, type, field} = this.props

    return (
      <Flex className={this.getClassName()}>
        <Field
          type={type}
          label={field}
          value={filters[field]}
          options={this.getOptions()}
          fieldOptions={{multi: true}}
          onChange={this.onChange}
        />
      </Flex>
    )
  }
}

export default TasksFilter
