import _ from "lodash"
import moment from "moment"
import classNames from "classnames"
import {airtableDateFormat} from "api/airtableAPI"

export const getDayItems = (type, list, day) => {
  let date = moment(day).format(airtableDateFormat)
  const taskSort = task => task.fields.Blocked  ? "1" :
                                                  "0" + task.fields.Title.toLowerCase()


  switch(type) {
    case "tasks":
      return _.chain(list)
              .filter(task => task && task.fields && task.fields.When === date)
              .sortBy(taskSort)
              .value()
    case "events":
      return list.filter(event => moment(event.start.dateTime, "YYYY-MM-DD").isSame(day, "day"))
    case "habits":
      return list.filter(habit => _.includes(habit.fields["Habit--DOW"], moment(date).format("e")) &&
                                  moment(habit.createdTime, moment.ISO_8601).isBefore(moment(date).add(1, "day"), "day"))
    case "ongoing":
      return list.filter(event => moment(event.start.date, "YYYY-MM-DD").add(-1, "day").isBefore(day, "day") &&
                                  moment(event.end.date,   "YYYY-MM-DD").isAfter( day, "day"))
  }
}

export const getDayItemClassNames = (type, item, day, base) => {
    let date = moment(day).format(airtableDateFormat)
    let classes = {}

    switch(type) {
      case "task":
        if (!_.has(item, "fields")) break
        classes[`${base}--done`] = item.fields.Done
        break
      case "event":
        break
      case "habit":
        if (!_.has(item, "fields")) break
        classes[`${base}--done`] = _.includes(item.fields["Habit--Done"], date),
        classes[`${base}--missed`] = !_.includes(item.fields["Habit--Done"], date) &&
                                     moment(day).isBefore(moment())
        break
      case "ongoing":
        if (!_.has(item, "start")) break
        let isMiddleDate = moment(item.start.date, airtableDateFormat).isBefore(day, "day") &&
                           +day.format("e")

        classes[`${base}__ongoing`] = true
        classes[`${base}__ongoing--middle-day`] = isMiddleDate
        break
    }

    return classNames(base, classes)
}
