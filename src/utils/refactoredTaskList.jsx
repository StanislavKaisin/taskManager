import { format } from 'date-fns';

import { getLastMonthDay } from './utils';

export const refactoredTaskList = tasks => {
  const lastMonthDay = getLastMonthDay();
  let allDates = [];
  let allDatesWithIds = [];
  if (Array.isArray(tasks)) {
    tasks.map(task => {
      if (Array.isArray(task.dates)) {
        task.dates.map(date => {
          allDatesWithIds.push({
            dateAsNumber: new Date(date.date).getTime(),
            date: format(new Date(date.date), 'yyyy-MM-dd'),
            taskId: task._id
          });
          return allDates.push(new Date(date.date).getTime());
        });
      }
    });
  }
  const sortedAllDates = allDates.sort((a, b) => a - b);
  const sortedallDatesWithIds = allDatesWithIds.sort((a, b) => a.dateAsNumber - b.dateAsNumber);
  const uniqueDatesWithIds = (arrOfDates, arrOfDatesWithIds) => {
    let resultofDates = [];
    let result = [];
    for (let index = 0; index < arrOfDates.length; index++) {
      if (!resultofDates.includes(arrOfDates[index])) {
        if (arrOfDates[index] && arrOfDates[index] >= lastMonthDay.getTime()) {
          resultofDates.push(arrOfDates[index]);
          result.push({
            date: arrOfDates[index],
            tasks: arrOfDatesWithIds.reduce((acc, task) => {
              if (task.dateAsNumber !== arrOfDates[index]) {
                return acc;
              }
              if (task.dateAsNumber === arrOfDates[index]) {
                const taskToResult = tasks.filter(elem => elem._id === task.taskId);
                acc.push(...taskToResult);
                return acc;
              }
            }, [])
          });
        }
      }
    }
    return result;
  };
  const datesWithIds = uniqueDatesWithIds(sortedAllDates, sortedallDatesWithIds);
  return datesWithIds;
};

export default refactoredTaskList;
