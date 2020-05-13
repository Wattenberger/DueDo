import React, {Component} from "react"
import PropTypes from 'prop-types';
import classNames from "classnames"
import {connect} from "react-redux"
import _ from "lodash"
import Toggle from "components/_ui/Toggle/Toggle"
import Filter from "./TasksFilter/TasksFilter"

import {changeFilter, removeFilter} from "actions/taskActions"

require('./TasksFilters.scss')

const filters = [
  {field: "Title", type: "text"},
  {field: "Tags", type: "select"},
  {field: "Contexts", type: "select"},
  {field: "Project", type: "select"},
  {field: "Done", type: "checkbox"}
]

@connect(state => ({
  filters: state.tasks.get('filters').toJS(),
}))
class TasksFilters extends Component {
  constructor(props) {
    super(props)
    this.state = {
      expanded: false
    }
  }

  getClassName() {
    return classNames(
      "TasksFilters", this.props.className
    )
  }

  getDetailsClassName() {
    let {expanded} = this.state

    return classNames(
      "TasksFilters__details", {
        "TasksFilters__details--expanded": expanded
      }
    )
  }

  toggleExpanded = (newVal) => {
    this.setState({expanded: _.isBoolean(newVal) ? newVal : !this.state.expanded})
  }

  changeTypeFilter = (type, e) => {
    e.stopPropagation()
    this.props.dispatch(changeFilter("Type", type))
  }

  renderCurrentFilter() {
    let {filters} = this.props

    let toggleOptions = [
      {value: "task", label: "tasks"},
      {value: "habit", label: "habits"},
      {value: "bucketlist", label: "bucketlist"}
    ]

    return <div className="TasksFilters__current" onClick={this.toggleExpanded}>
      <h6>Filters</h6>
      <Toggle className="TasksFilters__toggle"
              value={filters.Type}
              options={toggleOptions}
              onChange={this.changeTypeFilter}
      />
    </div>
  }

  renderFilter(field, type, idx) {
    return <Filter
      type={type}
      field={field}
      key={idx}
    />
  }

  render() {
    return (
      <div className={this.getClassName()}>
        {this.renderCurrentFilter()}
        <div className={this.getDetailsClassName()}>
          {filters.map((filter, idx) => this.renderFilter(filter.field, filter.type, idx))}
        </div>
      </div>
    )
  }
}

export default TasksFilters
