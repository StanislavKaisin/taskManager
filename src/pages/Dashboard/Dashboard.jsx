import React, { Component } from "react";
import PropTypes from "prop-types";
import windowSize from "react-window-size";
import Loader from "react-loader-spinner";
import { connect } from "react-redux";
import { compose } from "redux";
import styles from "./Dashboard.module.css";
import { loginSuccess } from "../../redux/actions/authActions";
import { openModal } from "../../redux/actions/modalAction.js";
import { Switch, Route, Link } from "react-router-dom";
import { getUserTasks } from "../../redux/actions/tasksActions";
import { getToken, getLoader, getModal } from "../../redux/selectors/selectors";
import InfoPop from "../../components/InfoPop/InfoPop";
import Icon from "../../components/Icon/Icon";
import AddForm from "../../components/AddForm/AddForm";
import Calendar from "../../components/Calendar/Calendar";
import TaskList from "../../components/TaskList/TaskList";
import Task from "../../components/Task/Task.jsx";
import Header from "../../components/Header/Header";

const task = {
  taskNumber: 1,
  taskHeader: "Подготовка документации",
  taskDescription:
    "Давно выяснено, что при оценке дизайна и композиции читаемый текст мешает сосредоточиться",
  isLoop: false,
  loopDates: [10, 17, 21],
  isComplete: true,
  onEdit: () => {},
  onCompltete: () => {}
};

export const DashboardContext = React.createContext({});

// const Calendar = () => (
//   <div>
//     <h1>Calendar</h1>
//   </div>
// );

// const AddForm = () => (
//   <div>
//     <h1>AddForm</h1>
//   </div>
// );

class Dashboard extends Component {
  state = {};

  static propTypes = {
    loader: PropTypes.bool.isRequired,
    modal: PropTypes.bool.isRequired,
    token: PropTypes.string.isRequired,
    windowWidth: PropTypes.number.isRequired,
    loginSuccess: PropTypes.func.isRequired,
    getUserTasks: PropTypes.func.isRequired,
    openModal: PropTypes.func.isRequired
  };

  componentDidMount() {
    const { token, getUserTasks } = this.props;
    getUserTasks(token);
  }

  render() {
    const { windowWidth, loader, modal, openModal } = this.props;

    return (
      <>
        <Header match={this.props.match} />
        <Icon icon="Info" onClick={openModal} />
        {(loader && (
          <Loader
            type="Oval"
            color="#284060"
            height={35}
            width={35}
            timeout={3000}
          />
        )) || (
          <>
            {windowWidth < 1024 && (
              <>
                <Switch>
                  {/* <Route path="/dashboard" exact component={Tasks} /> */}
                  <Route path="/dashboard/calendar" component={Calendar} />
                  <Route path="/dashboard/add" component={AddForm} />
                </Switch>
              </>
            )}
            {windowWidth >= 1024 && (
              <>
                {/* <Tasks /> */}
                <Calendar />
                <Link to="/dashboard/add">
                  <button className={styles.btnAdd}>+</button>
                </Link>
                <Route path="/dashboard/add" component={AddForm} />
              </>
            )}
          </>
        )}
        {modal && <InfoPop />}
      </>
    );
  }
}

const mapStateToProps = state => ({
  token: getToken(state),
  loader: getLoader(state),
  modal: getModal(state)
});

const mapDispatchToProps = dispatch => ({
  loginSuccess: session => dispatch(loginSuccess(session)),
  getUserTasks: token => dispatch(getUserTasks(token)),
  openModal: () => dispatch(openModal())
});

export default compose(
  connect(
    mapStateToProps,
    mapDispatchToProps
  ),
  windowSize
)(Dashboard);
