import React, { Component } from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { compose } from 'redux';
import PropTypes from 'prop-types';

// import npm components
import windowSize from 'react-window-size';
import Loader from 'react-loader-spinner';

// import Components
import Calendar from '../../components/Calendar/Calendar';
import TaskContainer from '../../components/TaskContainer/TaskContainer';
import AddTask from '../../components/AddTask/AddTask';
import EditTask from '../../components/EditTask/EditTask';
import Header from '../../components/Header/Header';
import Modal from '../../components/Modal/Modal';
import PopUpConfirmDelete from '../../components/PopUpConfirmDelete/PopUpConfirmDelete';
import InfoPop from '../../components/InfoPop/InfoPop';
import WrapDesktop from '../../components/WrapDesktop/WrapDesktop';
// import pages

import CalendarPage from '../CalendarPage/CalendarPage';

// import actions and selectors
import { getUserTasks } from '../../redux/actions/tasksActions';
import { getLoader, getTaskId } from '../../redux/selectors/selectors';

// add styles
import styles from './Dashboard.module.css';

class Dashboard extends Component {
  state = {};

  static propTypes = {
    loader: PropTypes.bool.isRequired,
    modal: PropTypes.bool.isRequired,
    token: PropTypes.string.isRequired,
    windowWidth: PropTypes.number.isRequired,
    getUserTasks: PropTypes.func.isRequired
  };

  componentDidMount() {
    const { getUserTasks } = this.props;
    getUserTasks();
  }
  componentWillUnmount() {
    window.removeEventListener('resize', this.updateDimensions);
  }

  render() {
    const { windowWidth, loader, modal, modalInfo, modalCalendar, modalDelete, history, location, match } = this.props;

    return (
      <>
        <Header match={this.props.match} location={this.props.location} />
        <div className={styles.wrapper}>
          {loader ? (
            <div className={styles.loader}>
              <Loader type="Oval" color="#284060" height={35} width={35} timeout={3000} />
            </div>
          ) : (
            <>
              {windowWidth < 1024 && (
                <>
                  <Switch>
                    <Route path="/dashboard" exact component={TaskContainer} />
                    <Route path="/dashboard/calendar" component={CalendarPage} />
                    <Route path="/dashboard/add" component={AddTask} />
                    <Route path="/dashboard/edit" component={EditTask} />
                  </Switch>
                </>
              )}
              {windowWidth >= 1024 && (
                <>
                  <Switch>
                    <Route path="/dashboard" exact component={WrapDesktop} />
                    <Route path="/dashboard/add" component={AddTask} />
                    <Route path="/dashboard/edit" component={EditTask} />
                    <Redirect to="/dashboard" />
                  </Switch>
                </>
              )}
            </>
          )}
        </div>
        {modal && (
          <Modal>
            {modalInfo && <InfoPop />}
            {modalCalendar && <Calendar />}
            {modalDelete && <PopUpConfirmDelete history={history} location={location} match={match} />}
          </Modal>
        )}
      </>
    );
  }
}

const mapStateToProps = state => ({
  loader: getLoader(state),
  modalInfo: state.modal.modalInfo,
  modalCalendar: state.modal.modalCalendar,
  modalDelete: state.modal.modalDelete,
  modal: state.modal.modal,
  taskId: getTaskId(state)
});

const mapDispatchToProps = dispatch => ({
  getUserTasks: () => dispatch(getUserTasks())
});

export default compose(connect(mapStateToProps, mapDispatchToProps), windowSize)(Dashboard);
