import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getTasks } from '../../redux/selectors/selectors';

import Task from '../../components/Task/Task.jsx';

import styles from './TaskList.module.css';

import refactoredTaskList from '../../utils/refactoredTaskList';

const ifToday = number => {
  const now = new Date();
  const date = new Date(number);
  if (
    date.getFullYear() === now.getFullYear() &&
    date.getMonth() === now.getMonth() &&
    date.getDate() === now.getDate()
  ) {
    return 'Сегодня';
  } else {
    return date.toLocaleDateString();
  }
};

const sortedByCompleted = (tasks, date) => {
  date = new Date(date).toISOString();

  const result = {};

  result.completedTasks = [];
  result.unCompletedTasks = tasks;

  tasks.map(task => {
    task.dates.map(taskDate => {
      if (taskDate.date === date && taskDate.isComplete) {
        result.completedTasks.push(task);
        result.unCompletedTasks = result.unCompletedTasks.filter(item => item._id !== task._id);
      }
    });
  });
  return result;
};

const TaskList = ({ tasks }) => {
  useEffect(() => {
    const days = document.querySelectorAll('#TaskList>li');
    let todayLi;
    days.forEach(day => {
      if (day.children[0].innerText === 'Сегодня') todayLi = day;
    });
    todayLi && todayLi.scrollIntoView(true);
  }, []);

  return tasks && tasks.length ? (
    <ul className={styles.list} id="TaskList">
      {tasks &&
        tasks.map(taska => {
          return (
            <li key={taska.date + Math.random()}>
              <p className={styles.today}>{ifToday(taska.date)}</p>
              <ul className={styles.subList} key={Math.random()}>
                {/* <p className={styles.today}>Выполненные задачи</p>   */}
                {sortedByCompleted(taska.tasks, taska.date) &&
                  sortedByCompleted(taska.tasks, taska.date).unCompletedTasks.map((task, index) => {
                    return (
                      <li className={styles.subListItem} key={task._id + Math.random()}>
                        <Task task={task} taskNumber={index + 1} date={taska.date} />
                      </li>
                    );
                  })}
                {sortedByCompleted(taska.tasks, taska.date).completedTasks.length > 0 && (
                  <li>
                    <p className={styles.today}>Выполненные задачи</p>
                    {sortedByCompleted(taska.tasks, taska.date).completedTasks.map((task, index) => {
                      return (
                        <div className={styles.subListItem} key={task._id + Math.random()}>
                          <Task task={task} taskNumber={index + 1} date={taska.date} />
                        </div>
                      );
                    })}
                  </li>
                )}
              </ul>
            </li>
          );
        })}
    </ul>
  ) : (
    <div className={styles.emptyTaskMessage}>
      <p className={styles.intro}>Нет запланированных задач.</p>
      <p className={styles.intro}>Время начать управлять своей жизнью!</p>
    </div>
  );
};

TaskList.propTypes = {
  tasks: PropTypes.arrayOf(Object)
};

const mapStateToProps = state => ({
  tasks: refactoredTaskList(getTasks(state, state.userTasks.search))
});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(TaskList);
