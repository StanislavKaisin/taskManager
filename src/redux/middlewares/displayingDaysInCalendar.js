import { tasksTypes } from '../actions/tasksActions';

import { getLastMonthDay } from '../../utils/utils';

const displayingDaysInCalendar = store => next => action => {
  if (action.type === tasksTypes.FETCH_TASKS_SUCCESS) {
    if (!action.payload.calendar) return;
    const lastMonthDay = getLastMonthDay();
    action.payload.calendar = action.payload.calendar.filter(({ date }) => {
      if (!date.length) return;
      const dateAsArray = date.split('-');
      const dateDate = dateAsArray[0];
      const dateMonth = dateAsArray[1] - 1;
      const dateYear = dateAsArray[2];
      let dateForFilter = new Date(dateYear, dateMonth, dateDate);
      if (dateForFilter.getTime() >= lastMonthDay.getTime()) {
        return date;
      }
    });
  }
  return next(action);
};

export default displayingDaysInCalendar;
