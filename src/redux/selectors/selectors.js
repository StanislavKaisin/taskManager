export const getToken = state => state.session.token;

export const getLoader = state => state.userTasks.loader;

export const getSession = state => state.session;

export const getTasks = (state, search) => {
  if (state.userTasks.tasks) {
    if (!search) {
      return state.userTasks.tasks;
    }
    return state.userTasks.tasks.filter(el => {
      const descript = el.description
        .split(' ')
        .join('')
        .toLowerCase();
      const title = el.title
        .split(' ')
        .join('')
        .toLowerCase();
      const request = search
        .split(' ')
        .join('')
        .toLowerCase();
      return title.includes(request) || descript.includes(request);
    });
  }
};

export const getInfoModal = state => state.modal.modalInfo;

export const getCalendarModal = state => state.modal.modalCalendar;

export const getDeleteModal = state => state.modal.modalDelete;

export const getNickname = state => state.session.nickname;

export const getTaskId = state => state.id;

export const calendarDates = state => state.userTasks.calendar;
