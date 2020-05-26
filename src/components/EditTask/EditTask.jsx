import React, { Component } from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import style from './EditTask.module.css';
import Icon from '../Icon/Icon';
import { getTasks } from '../../redux/selectors/selectors';
import { editTask } from '../../redux/actions/tasksActions';
import { warn } from '../../utils/notification';
import { openModal, openDeleteModal } from '../../redux/actions/modalAction';
import DatePicker from '../DatePicker/DatePicker';
import { openPickerModal } from '../../redux/actions/modalAction.js';
import Modal from '../Modal/Modal';

class EditTask extends Component {
  state = {
    title: '',
    description: '',
    dates: []
  };

  componentDidMount() {
    const { id, tasks } = this.props;
    if (!tasks) {
      this.props.history.push('/dashboard');
      return;
    }
    const newState = tasks.find(el => el._id === id);
    this.setState({ ...newState });
  }

  handleChange = event => {
    const { title, description } = this.state;
    if (title.length > 50 || description.length > 200) {
      return;
    }
    this.setState({ [event.target.name]: event.target.value });
  };

  handleOpenDatePicker = dates => {
    const { openModal, modal } = this.props;

    if (modal) {
      const convertedDates = dates.map(date => ({ date }));
      this.setState(state => ({
        dates: convertedDates
      }));
    }
    if (!modal) {
      openModal();
    }
  };

  handleSubmit = event => {
    event.preventDefault();
    const { title, description, dates } = this.state;
    const { id, tasks } = this.props;
    const editTask = tasks.find(el => el._id === id);

    if (title === '' || description === '' || dates.length === 0) {
      warn('Все поля должны быть заполнены');
      return;
    }

    if (
      !this.props.error ||
      title !== editTask.title ||
      description !== editTask.description ||
      dates.length !== editTask.dates.length
    ) {
      this.props.editTask({ title, description, dates }, id);
      this.props.history.push('/dashboard');
      this.setState({ title: '', description: '' });
    }
    if (
      this.props.error ||
      title === editTask.title ||
      description === editTask.description ||
      dates.length === editTask.dates.length
    ) {
      this.setState({ error: this.props.error });
    }
  };

  handleReset = () => {
    this.props.history.push('/dashboard');
    this.setState({ title: '', description: '' });
  };

  render() {
    const { title, description, dates } = this.state;
    const { confirmDelete, modal } = this.props;
    return (
      <div className={style.bodybg}>
        <form onSubmit={this.handleSubmit} className={style.formBg}>
          <input
            name="title"
            type="text"
            value={title}
            onChange={this.handleChange}
            placeholder="#1 Введите название задачи"
            className={style.title}
            maxLength="50"
          ></input>
          {title.length >= 50 && <span className={style.errorSpan}>Описание не должно быть больше 50-ти символов</span>}
          <span className={style.dataPickerContainer} onClick={this.handleOpenDatePicker}>
            <div>
              <Icon icon="Calendar" className={style.formIcon} />
            </div>
            {dates.length > 0 ? (
              <p className={style.dataPickerTitle}>
                {dates.map(el => (
                  <span key={el._id}>{moment(el.date).format('DD-MM-YYYY')}; &ensp;</span>
                ))}
              </p>
            ) : (
              <p className={style.dataPickerTitle}>Выберите дату</p>
            )}
            <div>
              <Icon icon="ArrowRight" className={style.formIcon} />
            </div>
          </span>
          {modal ? (
            <Modal>
              <DatePicker
                dates={dates.map(el => el.date)}
                modal={modal}
                handleOpenDatePicker={this.handleOpenDatePicker}
              />
            </Modal>
          ) : (
            ''
          )}
          <p className={style.labelDescription}>Краткое описание:</p>
          <textarea
            name="description"
            wrap="virtual"
            className={style.textArea}
            onChange={this.handleChange}
            value={description}
            placeholder="Введите описание задачи"
            maxLength="200"
          ></textarea>
          {description.length >= 200 && (
            <span className={style.errorSpan}>Описание не должно быть больше 200-ти символов</span>
          )}
          <button type="button" className={style.deleteBtn}>
            <Icon icon="Delete" className={style.formIconDelete} onClick={confirmDelete} />
          </button>
          <div className={style.battonContainer}>
            <button type="submit" className={style.saveBtn}>
              Сохранить
            </button>
            <button type="reset" className={style.resetBtn} onClick={this.handleReset}>
              Отмена
            </button>
          </div>
        </form>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  id: state.id,
  error: state.form.error,
  tasks: getTasks(state, ''),
  modal: state.modal.modalPicker
});

const mapDispatchToProps = dispatch => ({
  editTask: (data, id) => dispatch(editTask(data, id)),
  confirmDelete: () => {
    dispatch(openModal());
    dispatch(openDeleteModal());
  },
  openModal: () => {
    dispatch(openPickerModal());
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(EditTask);
