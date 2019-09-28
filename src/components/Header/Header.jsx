import React, { Component } from 'react';
import { connect } from 'react-redux';
import styles from './Header.module.css';
import Icon from '../Icon/Icon';
import { openInfoModal, openModal, openCalendarModal } from '../../redux/actions/modalAction.js';
import { logout } from '../../redux/actions/authOperations';
import { getInfoModal, getNickname } from '../../redux/selectors/selectors';
import { compose } from 'redux';
import windowSize from 'react-window-size';
import { CalendarButtonMobile } from '../CalendarButton/CalendarButton';

class Header extends Component {
  state = {};

  render() {
    const { match, location, openModal, logout, nickname, windowWidth } = this.props;

    return (
      <>
        {match.path.includes('/login') && (
          <div className={styles.wrapperForLogin}>
            <h1 className={`${styles.LoginRegisterLogo} Header-LoginRegister-Logo-Mob`}>TaskTraker</h1>
            <h2 className={`${styles.LoginRegisterTagline} Header-LoginRegister-Tagline-Mob`}>Организуй свои дела</h2>
          </div>
        )}

        {/* =====================DASHBOARD */}
        {match.path.includes('dashboard') && (
          <div className={styles.wrapperForDashboard}>
            <h1 className={`${styles.DashboardLogo} Header-Dashboard-Logo-Mob`}>TaskTraker</h1>

            <nav className={`${styles.nav} Header-Dashboard-UserName-Mob`}>
              <div className={styles.UserNameLetter}>{nickname[0].toUpperCase()}</div>
              <div className={styles.UserName}>{nickname}</div>
              <div className={styles.exitWordWrapper} onClick={logout}>
                <span className={styles.exitWord}>Выйти</span>
              </div>

              <Icon icon="Logout" onClick={logout} className={styles.exitBtn} />
            </nav>

            <div className={`${styles.informBtn}  Header-Dashboard-UserName-Mob`}>
              {windowWidth < 768 && location.pathname === '/dashboard' && (
                <span className={styles.calendarSign}>
                  <CalendarButtonMobile />
                </span>
              )}
              <Icon icon="Info" onClick={openModal} className={styles.informSign} />
            </div>
          </div>
        )}
        {/* =====================DASHBOARD */}
      </>
    );
  }
}

const mapStateToProps = state => ({
  modal: getInfoModal(state),
  nickname: getNickname(state)
});

const mapDispatchToProps = dispatch => ({
  openModal: () => {
    dispatch(openModal());
    dispatch(openInfoModal());
  },
  openCalendar: () => {
    dispatch(openModal());
    dispatch(openCalendarModal());
  },
  logout: () => dispatch(logout())
});

export default compose(
  connect(
    mapStateToProps,
    mapDispatchToProps
  ),
  windowSize
)(Header);
