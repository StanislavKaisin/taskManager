// Тут пишем функции хелперы, это файл для экспорта тут ничего не должно исполняться
import { format } from 'date-fns';

export const datesFromTasks = tasks => {
  let result = {};
  result.isCompleted = [];
  result.isDisabled = [];
  if (Array.isArray(tasks)) {
    tasks.map(task => {
      if (!Array.isArray(task.dates)) return null;
      task.dates.map(date => {
        date.isComplete
          ? result.isDisabled.push(new Date(date.date).toLocaleDateString())
          : result.isCompleted.push(new Date(date.date).toLocaleDateString());
      });
    });
  }
  return result;
};

export const addTaskToCalendar = (task, calendar) => {
  const { _id, title } = task;
  const isRepeat = task.dates.length > 1;

  if (isRepeat) {
    for (let i = 0; i < task.dates.length; i++) {
      const taskDate = format(new Date(task.dates[i].date), 'dd-MM-yyyy');

      calendar.map(el => {
        if (el.date === taskDate) {
          el.repeatTasks.tasks.push({ _id, title, isRepeat });
          el.repeatTasks.count = el.repeatTasks.tasks.length;
          return el;
        }
        return el;
      });

      if (!calendar.some(el => el.date === taskDate)) {
        calendar.push({
          date: taskDate,
          repeatTasks: { tasks: [{ _id, title, isRepeat }], count: 1 },
          oneTasks: { tasks: [], count: 0 }
        });
      }
    }
  }

  if (!isRepeat) {
    const taskDate = format(new Date(task.dates[0].date), 'dd-MM-yyyy');

    calendar.map(el => {
      if (el.date === taskDate) {
        el.oneTasks.tasks.push({ _id, title, isRepeat });
        el.oneTasks.count = el.oneTasks.tasks.length;
        return el;
      }
      return el;
    });

    if (!calendar.some(el => el.date === taskDate)) {
      calendar.push({
        date: taskDate,
        oneTasks: { tasks: [{ _id, title, isRepeat }], count: 1 },
        repeatTasks: { tasks: [], count: 0 }
      });
    }
  }

  return calendar;
};

// convert daye from format RFC2822 (Fri Apr 05 2019 16:59:00 GMT-0700 (Pacific Daylight Time)) into 2019-04-05
export const convertDateFromRFC2822 = dateRFC2822 => {
  const dateStr = String(dateRFC2822);
  var mnths = {
      Jan: '01',
      Feb: '02',
      Mar: '03',
      Apr: '04',
      May: '05',
      Jun: '06',
      Jul: '07',
      Aug: '08',
      Sep: '09',
      Oct: '10',
      Nov: '11',
      Dec: '12'
    },
    date = dateStr.split(' ');

  return [date[2], mnths[date[1]], date[3]].join('-');
};


export const getLastMonthDay = params => {
  let today = new Date();
  const todayYear = today.getFullYear();
  const todayMonth = today.getMonth();
  const todayDate = today.getDate();
  today = new Date(todayYear, todayMonth, todayDate);
  let lastMonthDay = new Date();
  lastMonthDay.setTime(today.getTime() - 4 * 7 * 24 * 60 * 60 * 1000);
  return lastMonthDay;
};

export const getLastWeekDay = params => {
  let today = new Date();
  const todayYear = today.getFullYear();
  const todayMonth = today.getMonth();
  const todayDate = today.getDate();
  today = new Date(todayYear, todayMonth, todayDate);
  let lastWeekDay = new Date();
  lastWeekDay.setTime(today.getTime() -  7 * 24 * 60 * 60 * 1000);
  return lastWeekDay;
};