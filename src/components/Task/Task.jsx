import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { getIdSuccess } from '../../redux/actions/getIdAction';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import styles from './Task.module.css';

import Icon from '../../components/Icon/Icon';
import { completeTask } from '../../redux/actions/tasksActions.js';
import { getToken, getTaskId } from '../../redux/selectors/selectors';
import { format } from 'date-fns';

import useScreenWidth from '../../utils/useScreenWidth';

import { getLastMonthDay } from '../../utils/utils';

const lastMonthDay = getLastMonthDay();

const refactoringProps = props => {
  const { dates, title, description, isRepeat, _id } = props.task;

  const refactoringProps = {
    taskHeader: !title ? 'назва_таски' : title,
    taskDescription: !description ? 'опис_таски' : description,
    isLoop: isRepeat,
    loopDates: dates
      .reduce((uniqueDates, date) => {
        if (uniqueDates.includes(date)) return uniqueDates;
        uniqueDates.push(date);
        return uniqueDates;
      }, [])
      .filter(date => {
        if (Date.parse(date.date) >= lastMonthDay.getTime()) return date;
      })
      .reduce((acc, elem, index) => {
        acc.push(!index || index % 4 === 0 ? '\n' + new Date(elem.date).getDate() : new Date(elem.date).getDate());
        return acc;
      }, [])
      .join(','),
    dates: dates,

    taskNumber: !props.taskNumber ? 'номер_таски' : props.taskNumber,
    taskId: _id
  };
  return refactoringProps;
};

const findTaskDate = (dates, date) => {
  return dates.find(el => format(new Date(el.date), 'yyyy-MM-dd') === format(new Date(date), 'yyyy-MM-dd'));
};

const Task = props => {
  const { taskNumber, taskHeader, taskDescription, isLoop, loopDates, taskId, dates } = refactoringProps(props);
  const windowWidth = useScreenWidth();
  const { onEdit, onComplete, date } = props;
  const completeTaskDate = findTaskDate(dates, date);
  return (
    <>
      <div className={styles.task}>
        <div className={completeTaskDate.isComplete ? styles.taskHeaderInactive : styles.taskHeader}>
          <div className={styles.numberContainer}>
            <p className={styles.headerNumber}>{taskNumber}. </p>
          </div>
          <div className={styles.textContainer}>
            <p className={styles.headerText}>{taskHeader}</p>
          </div>
        </div>
        <div className={styles.taskBody}>
          <p>{taskDescription}</p>
          <hr />
        </div>
        <div className={styles.taskControls}>
          <div className={styles.taskControlsRepeat}>
            {isLoop && (
              <>
                <button
                  type="button"
                  disabled={completeTaskDate.isComplete ? true : false}
                  className={
                    completeTaskDate.isComplete ? styles.taskControlsRepeatBtnInactive : styles.taskControlsRepeatBtn
                  }
                >
                  <Icon icon="Loop" />
                </button>
                <span
                  className={completeTaskDate.isComplete ? styles.taskControlsDatesInactive : styles.taskControlsDates}
                >
                  {loopDates}
                </span>
              </>
            )}
          </div>

          <div className={styles.taskControlsCompleteContainer}>
            <Link to="/dashboard/edit">
              <button className={styles.taskControlsEdit} type="button" onClick={() => onEdit(taskId)}>
                <Icon icon="Edit" />
              </button>
            </Link>
            {windowWidth > 768 ? <p>Редактировать</p> : null}
            <button
              type="button"
              disabled={completeTaskDate.isComplete ? true : false}
              className={completeTaskDate.isComplete ? styles.taskControlsDoneInactive : styles.taskControlsDone}
              onClick={() => onComplete({ sectionDate: props.date, taskDates: props.task.dates }, taskId)}
            >
              <Icon icon="Done" />
            </button>
            {windowWidth > 768 ? loopDates[0].isComplete ? <p>Выполнено</p> : <p>Выполнить</p> : null}
          </div>
        </div>
      </div>
    </>
  );
};

Task.propTypes = {
  task: PropTypes.shape({
    taskNumber: PropTypes.string,
    isRepeat: PropTypes.bool.isRequired,
    title: PropTypes.string,
    description: PropTypes.string,
    dates: PropTypes.arrayOf(
      PropTypes.shape({
        isComplete: PropTypes.bool,
        date: PropTypes.string
      })
    ).isRequired,
    onEdit: PropTypes.func,
    onCompltete: PropTypes.func
  })
};

Task.defaultProps = {
  taskHeader: '',
  description: 'опис_таски',
  title: 'назва_таски',
  onEdit: () => {}
};

const mSTP = state => ({
  token: getToken(state),
  id: getTaskId(state)
});

const mDTP = dispatch => ({
  onComplete: (data, taskId) => dispatch(completeTask(data, taskId)),
  onEdit: taskId => dispatch(getIdSuccess(taskId))
});

export default compose(connect(mSTP, mDTP))(Task);
