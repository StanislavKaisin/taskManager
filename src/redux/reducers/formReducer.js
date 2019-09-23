import { formTypes } from '../actions/formAction';

//const initialState = { title: '', description: '' };

export const formReducer = (state = {}, { type, payload }) => {
  switch (type) {
    case formTypes.ADD_TASK_FORM_SUCCESS:
      return { ...state, title: payload.title, description: payload.description };
    case formTypes.POST_TASK_SUCCSESS:
      return { state: payload };
    default:
      return state;
  }
};