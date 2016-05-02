import React, {Component, PropTypes} from "react"
import classNames from "classnames"
import {connect} from "react-redux"
import _ from "lodash"
import Filter from "./TasksFilter/TasksFilter"

require('./TasksFilters.scss')

const filters = [
  {field: "Title", type: "text"},
  {field: "Tags", type: "select"},
  {field: "Contexts", type: "select"},
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

  renderCurrentFilter() {
    let {filters} = this.props

    return <div className="TasksFilters__current" onClick={this.toggleExpanded}>
      <h6>Filters</h6>
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
