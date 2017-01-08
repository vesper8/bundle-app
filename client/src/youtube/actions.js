import { 
  SET_SIDEBAR_TOGGLE,
  SET_CHANNELS,
  SELECT_CHANNEL,
  SELECT_VIDEO,
  SET_VIDEOS,
  ADD_CHANNEL,
  ON_USERNAME_INPUT
} from './actionTypes';
import Request from 'superagent';
import { PLAYLIST_URL, CHANNEL_URL } from './constants';


// ========== SIDEBAR ACTIONS ==========
export function toggleSidebar(status) {
  const newStatus = !status;
  return {
    type: SET_SIDEBAR_TOGGLE,
    payload: newStatus
  };
};
// ========== END SIDEBAR ACTIONS ==========

// ========== CHANNEL ACTIONS ==========
export function fetchChannelsUsernames() {
  return (dispatch) => {
    Request.get('/api/channels').end( (error, response) => {
      if (error) {
        console.log('Error occured while fetching channels');
      }
      else {
        dispatch(setChannels(response.body))
      }
    });
  };
};

export function setChannels(channels) {
  return {
    type: SET_CHANNELS,
    payload: channels
  };
};

export function fetchChannel(username) {
  return (dispatch) => {
    const url = CHANNEL_URL + username;
    Request.get(url).end( (error, response) => {
      if (error) {
        console.log(`Error occured while fetching channel ${username}`);
      }
      else {
        const newChannel = {
          username: username,
          name: response.body.items[0].snippet.title,
          thumbnail: response.body.items[0].snippet.thumbnails.default.url,
          uploads: response.body.items[0].contentDetails.relatedPlaylists.uploads
        };
        Request.post('/api/channels').send(newChannel).end( () => 
          dispatch(addChannel(newChannel))
        )
      };
    });
  };
};

export function addChannel(channel) {
  return {
    type: ADD_CHANNEL,
    payload: channel
  };
};

export function selectChannel(channel) {
  return {
    type: SELECT_CHANNEL,
    payload: channel
  };
};

export function deleteAllChannels() {
  return (dispatch) => {
    Request.delete('/api/channels').end( (error, response) => {
      dispatch(setChannels([]))
    });
  };
};

// ========== END CHANNEL ACTIONS ==========

// ========== VIDEO ACTIONS ==========
export function selectVideo(video) {
  return {
    type: SELECT_VIDEO,
    payload: video
  };
};

export function fetchVideos(channel) {
  return (dispatch) => {  
    if (channel !== undefined) {
      const url = PLAYLIST_URL + channel.uploads;
      Request.get(url).end( (error, response) => {
        if (error) {
          console.log('Error occured while fetching videos');
        }
        else {
          const videos = response.body.items.map( (video) => video.snippet );
          dispatch(setVideos(videos));
        };
      });
    }
    else {
      dispatch(setVideos([]))
    }
  };
};

export function setVideos(videos) {
  return {
    type: SET_VIDEOS,
    payload: videos
  };
};
// ========== END VIDEO ACTIONS ==========

// ========== FORM ACTIONS ==========
export function onUsernameInput(event) {
  return {
    type: ON_USERNAME_INPUT,
    payload: event
  };
};
// ========== END FORM ACTIONS ==========