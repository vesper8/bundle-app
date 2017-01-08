import { 
  SET_CHANNELS,
  SELECT_CHANNEL,
  ADD_CHANNEL,
  SET_VIDEOS,
  SELECT_VIDEO,
  SET_SIDEBAR_TOGGLE,
  ON_USERNAME_INPUT
} from './actionTypes';

export function channelsReducer(state = { all: [], current: 0 }, action) {
  switch (action.type) {
    case SET_CHANNELS:
      return { ...state, all: action.payload }
    case SELECT_CHANNEL:
      return { ...state, current: action.payload }
    case ADD_CHANNEL:
      return { ...state, all: [...state.all, action.payload] }
    default:
      return state;
  }
};

export function videosReducer(state = { all: [], current: 0 }, action) {
  switch(action.type) {
    case SET_VIDEOS:
      return { ...state, all: action.payload };
    case SELECT_VIDEO:
      return { ...state, current: action.payload };
    default:
      return state;
  }
};

export function sidebarReducer(state = false, action) {
  switch (action.type) {
    case SET_SIDEBAR_TOGGLE:
      return action.payload;
    default:
      return state;
  }
};

export function usernameInputReducer(state = '', action) {
  switch(action.type) {
    case ON_USERNAME_INPUT:
      return action.payload;
    default:
      return state;
  }
};