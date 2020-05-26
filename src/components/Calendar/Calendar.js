import React, { Component } from 'react';
import { Calendar } from 'react-calendar-component';
import moment from 'moment';
import 'moment/locale/ru';
import Icon from '../Icon/Icon';
import CalendarRenderDay from '../CalendarRenderDay/CalendarRenderDay';
import uuid from 'uuid/v4';

class TaskCalendar extends Component {
  state = {
    date: moment()
  };

  render() {
    return (
      <Calendar 
        onChangeMonth={date => this.setState({ date })}
        date={this.state.date}
        renderDay={props => <CalendarRenderDay {...props} key={uuid()}/>}
        renderHeader={({ date, onPrevMonth, onNextMonth }) => (
          <div className="Calendar-header">
            <button onClick={onPrevMonth}>
              <Icon className="Calendar-icon" icon="Back" />
            </button>
            <div className="Calendar-header-currentDate">{date.format('MMMM YYYY')}</div>
            <button onClick={onNextMonth}>
              <Icon className="Calendar-icon" icon="Next" />
            </button>
          </div>
        )}
      />
    );
  }
}

export default TaskCalendar;
