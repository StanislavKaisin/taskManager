import React, { Component } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
// import { editTaskSuccess, editTask } from '../../redux/actions/tasksActions';
import { getIdSuccess } from '../../redux/actions/getIdAction';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import styles from './Task.module.css';
import windowSize from 'react-window-size';
import Icon from '../../components/Icon/Icon';
import { requestDoneTask } from '../../redux/actions/tasksActions.js';
import { getToken, getTaskId, getDate } from '../../redux/selectors/selectors';

const refactoringProps = props => {
  const { dates, title, description, taskNumber, isRepeat, _id } = props.task;

  const refactoringProps = {
    loopDates: dates,
    taskHeader: !title ? 'назва_таски' : title,
    taskDescription: !description ? 'опис_таски' : description,
    isRepeat,
    taskNumber: !taskNumber ? 'номер_таски' : taskNumber,
    taskId: _id
  };
  return refactoringProps;
};

class Task extends Component {
  
  render() {
    const { taskNumber, taskHeader, taskDescription, isLoop, loopDates, taskId } = refactoringProps(this.props);
    const windowWidth = this.props.windowWidth ? this.props.windowWidth : null;
    const { onEdit, token, id, onComplete } = this.props;

    return (
      <>
        <div className={styles.task}>
          <div className={loopDates[0].isComplete ? styles.taskHeaderInactive : styles.taskHeader}>
            <div className={styles.numberContainer}>
              <p className={styles.headerNumber}>{taskNumber}. </p>
            </div>
            <div className={styles.textContainer}>
              <p className={styles.headerText}>{taskHeader}</p>
            </div>
          </div>
          <div className={styles.taskBody}>
            <p>{taskDescription}</p>
          </div>
          <div className={styles.taskControls}>
            <div className={styles.taskControlsRepeat}>
              {isLoop && (
                <>
                  <button
                    type="button"
                    disabled={loopDates[0].isComplete ? true : false}
                    className={
                      loopDates[0].isComplete ? styles.taskControlsRepeatBtnInactive : styles.taskControlsRepeatBtn
                    }
                  >
                    <Icon icon="Loop" />
                  </button>
                  {/* <p className={isComplete ? styles.taskControlsDatesInactive : styles.taskControlsDates}>
                                {loopDates}
                            </p> */}
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
                disabled={loopDates[0].isComplete ? true : false}
                className={loopDates[0].isComplete ? styles.taskControlsDoneInactive : styles.taskControlsDone}
                onClick={() => onComplete(id, token, { dates: [] })}
              >
                <Icon icon="Done" />
              </button>
              {windowWidth > 768 ? loopDates[0].isComplete ? <p>Выполнено</p> : <p>Выполнить</p> : null}
            </div>
          </div>
        </div>
      </>
    );
  }
}

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
  id: getTaskId(state),
 
});

const mDTP = dispatch => ({
  onComplete: (id, token, data) => dispatch(requestDoneTask({ id, token, data })),
  onEdit: taskId => dispatch(getIdSuccess(taskId))
});

export default compose(
  connect(
    mSTP,
    mDTP
  ),
  windowSize
)(Task);
