import React, { Component } from 'react';
import InfiniteCalendar, {
  Calendar,
  defaultMultipleDateInterpolation,
  withMultipleDates
} from 'react-infinite-calendar';
import 'react-infinite-calendar/styles.css';
import moment from 'moment';
import { connect } from 'react-redux';
import { closePickerModal, closeModal } from '../../redux/actions/modalAction.js';
import styles from './datePicker.module.css';
import { getLastWeekDay } from '../../utils/utils';

const dateToyyyyMMddFormatString = pickedDate => {
  const mmFormatMonth =
    ('' + (pickedDate.getMonth() + 1)).length < 2 ? '0' + (pickedDate.getMonth() + 1) : pickedDate.getMonth();
  const dateString = '' + pickedDate.getFullYear() + '-' + mmFormatMonth + '-' + pickedDate.getDate();
  return dateString;
};

class DatePicker extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selected: this.props.dates || []
    };
  }

  handlerOnSelect = pickedDate => {
    const dateString = dateToyyyyMMddFormatString(pickedDate);
    const selectedString = this.state.selected.map(date => dateToyyyyMMddFormatString(date));
    if (selectedString.includes(dateString)) {
      const filtered = selectedString.filter(el => el !== dateString);
      const filteredOnDateFormat = filtered.map(date => new Date(date));
      return this.setState({ selected: filteredOnDateFormat });
    }
    return this.setState({ selected: [...this.state.selected, pickedDate] });
  };

  handleCloseDatePicker = e => {
    e.preventDefault();
    const { closeModal } = this.props;
    this.props.handleOpenDatePicker(this.state.selected);
    closeModal();
  };

  handleCancelCloseDatePicker = e => {
    e.preventDefault();
    const { closeModal } = this.props;
    this.props.handleOpenDatePicker([]);
    closeModal();
  };

  render() {
    const { selected } = this.state;
    const lastWeek = getLastWeekDay();
    const MultipleDatesCalendar = withMultipleDates(Calendar);

    return (
      <>
        <div className={styles.pickerWrapper}>
          <InfiniteCalendar
            width={400}
            height={300}
            Component={MultipleDatesCalendar}
            interpolateSelection={defaultMultipleDateInterpolation}
            selected={selected}
            onSelect={doo => this.handlerOnSelect(doo)}
            minDate={lastWeek}
            displayOptions={{
              showHeader: false
            }}
            theme={{
              weekdayColor: '#284060'
            }}
            locale={{
              weekStartsOn: 1
            }}
          />
          <div className={styles.pickerBtns}>
            <button className={styles.pickerBtn} type="button" onClick={this.handleCloseDatePicker}>
              Подтвердить
            </button>
            <button className={styles.pickerBtn} type="button" onClick={this.handleCancelCloseDatePicker}>
              Отменить
            </button>
          </div>
        </div>
      </>
    );
  }
}

const mapDispatchToProps = dispatch => ({
  closeModal: () => {
    dispatch(closeModal());
    dispatch(closePickerModal());
  }
});

export default connect(null, mapDispatchToProps)(DatePicker);
