import React, { Component } from "react";
import PropTypes from "prop-types";
import windowSize from "react-window-size";
import Loader from "react-loader-spinner";
import { connect } from "react-redux";
import { compose } from "redux";
// import styles from './Dashboard.module.css';
import { loginSuccess } from "../../redux/actions/authActions";
import { Switch, Route } from "react-router-dom";
import { getUserTasks } from "../../redux/actions/tasksActions";
import { getToken, getLoader } from "../../redux/selectors/selectors";
import InfoPop from "../../components/InfoPop/InfoPop";
import Svg from "../../components/Icon/Icon";

import Task from "../../components/Task/Task.jsx";

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
const task22 = {
  taskNumber: 1,
  taskHeader: "Подготовка документации",
  taskDescription:
    "Давно выяснено, что при оценке дизайна и композиции читаемый текст мешает сосредоточиться",
  isLoop: true,
  loopDates: [10, 17, 21],
  isComplete: false,
  onEdit: () => {},
  onCompltete: () => {}
};

export const DashboardContext = React.createContext({});

const Header = () => (
  <div>
    <h1>Header</h1>
  </div>
);

const Calendar = () => (
  <div>
    <h1>Calendar</h1>
  </div>
);

const AddForm = () => (
  <div>
    <h1>AddForm</h1>
  </div>
);

const Tasks = () => (
  <div>
    <h1>Tasks</h1>
    <Task task={task} />
  </div>
);

class Dashboard extends Component {
  state = { modalInfo: false };

  static propTypes = {
    loader: PropTypes.bool.isRequired,
    token: PropTypes.string.isRequired,
    windowWidth: PropTypes.number.isRequired,
    loginSuccess: PropTypes.func.isRequired,
    getUserTasks: PropTypes.func.isRequired
  };

  componentDidMount() {
    const { token, getUserTasks } = this.props;
    getUserTasks(token);
  }

  onOpenModalInfo = () => {
    this.setState({ modalInfo: true });
  };

  onCloseModalInfo = () => {
    this.setState({ modalInfo: false });
  };

  render() {
    const { windowWidth, loader } = this.props;
    const { modalInfo } = this.state;

    return (
      <>
        {modalInfo && <InfoPop onClose={this.onCloseModalInfo} />}
        <Header />
        <Svg icon="Calendar" onClick={this.onOpenModalInfo} />
        {(loader && (
          <Loader
            type="Oval"
            color="#284060"
            height={50}
            width={50}
            timeout={3000} //3 secs
          />
        )) || (
          <>
            {windowWidth < 1024 && (
              <>
                <Switch>
                  <Route path="/dashboard" exact component={Tasks} />
                  <Route path="/dashboard/calendar" component={Calendar} />
                  <Route path="/dashboard/add" component={AddForm} />
                </Switch>
                <button>+</button>
              </>
            )}
            {windowWidth >= 1024 && (
              <>
                <Tasks />
                <Calendar />
                <button>+</button>
              </>
            )}
          </>
        )}
      </>
    );
  }
}

const mapStateToProps = state => ({
  token: getToken(state),
  loader: getLoader(state)
});

const mapDispatchToProps = dispatch => ({
  loginSuccess: session => dispatch(loginSuccess(session)),
  getUserTasks: token => dispatch(getUserTasks(token))
});

export default compose(
  connect(
    mapStateToProps,
    mapDispatchToProps
  ),
  windowSize
)(Dashboard);
