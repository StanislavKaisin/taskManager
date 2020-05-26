import React from 'react';
import AddButton from '../AddButton/AddButon';
import TaskList from '../TaskList/TaskList';
import s from './TaskContainer.module.css';
import { CalendarButtonTablet } from '../CalendarButton/CalendarButton';

import useScreenWidth from '../../utils/useScreenWidth';

const TaskContainer = props => {
  const windowWidth=useScreenWidth();
  return (
    <div className={s.taskContainer}>
      <div className={s.taskInnerContainer}>
        <TaskList />
        <AddButton />
      </div>
      {windowWidth >= 768 && windowWidth < 1024 ? <CalendarButtonTablet /> : ''}
    </div>
  );
};

export default TaskContainer;