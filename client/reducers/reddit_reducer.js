import {
  RECEIVE_REDDIT_FOLLOWS,
  RECEIVE_SUBREDDIT_THREADS,
  RECEIVE_CURRENT_SUBREDDIT,
  RECEIVE_SUBREDDIT,
  DELETE_SUBREDDIT,
} from "../actions/reddit_actions.js";

export const _nullState = {
  subreddits: {},
  threads: [],
  currentSubreddit: null,
  currentThread: { idx: null, content: null },
};

const redditReducer = (state = _nullState, action) => {
  let newSubreddits;
  Object.freeze(state);

  switch (action.type) {
    case RECEIVE_REDDIT_FOLLOWS:
      return { ...state, subreddits: action.subreddits };
    case RECEIVE_SUBREDDIT_THREADS:
      return { ...state, threads: action.threads };
    case RECEIVE_CURRENT_SUBREDDIT:
      return { ...state, currentSubreddit: action.id };
    case RECEIVE_SUBREDDIT:
      newSubreddits = {
        ...state.subreddits,
        [action.subreddit.id]: action.subreddit,
      };
      return { ...state, subreddits: newSubreddits };
    case DELETE_SUBREDDIT:
      newSubreddits = { ...state.subreddits };
      delete newSubreddits[action.id];
      return { ...state, subreddits: newSubreddits };
    default:
      return state;
  }
};

export default redditReducer;
