import {
  SET_CHANNELS,
  SELECT_CHANNEL,
  SELECT_VIDEO,
  SET_VIDEOS,
  ON_USERNAME_INPUT,
} from './actionTypes';
import Request from 'superagent';
require('superagent-csrf')(Request);
import {PLAYLIST_URL, CHANNEL_USERNAME_URL, CHANNEL_ID_URL} from './constants';

// ========== CHANNEL ACTIONS ==========
export function fetchChannelsUsernames() {
  return dispatch => {
    Request.get('/api/youtube_channels').end((error, response) => {
      if (error) {
        console.log('Error occured while fetching youtube channels');
      } else {
        dispatch(setChannels(response.body));
      }
    });
  };
}

export function setChannels(channels) {
  return {type: SET_CHANNELS, payload: channels};
}

export function fetchChannel(username, csrf_token) {
  return dispatch => {
    const url = CHANNEL_USERNAME_URL + username;
    Request.get(url).end((error, response) => {
      if (error) {
        console.log(`Error occured while fetching channel ${username}`);
      } else if (response.body.items[0] !== undefined) {
        const newChannel = {
          username: username,
          name: response.body.items[0].snippet.title,
          thumbnail: response.body.items[0].snippet.thumbnails.default.url,
          uploads: response.body.items[0].contentDetails.relatedPlaylists
            .uploads,
        };
        Request.post('/api/youtube_channels')
          .csrf(csrf_token)
          .send(newChannel)
          .end(() => dispatch(fetchChannelsUsernames()));
      } else {
        const url = CHANNEL_ID_URL + username;
        Request.get(url).end((error, response) => {
          if (error) {
            console.log(`Error occured while fetching channel ${username}`);
          } else {
            const newChannel = {
              username: username,
              name: response.body.items[0].snippet.title,
              thumbnail: response.body.items[0].snippet.thumbnails.default.url,
              uploads: response.body.items[0].contentDetails.relatedPlaylists
                .uploads,
            };
            Request.post('/api/youtube_channels')
              .send(newChannel)
              .end(() => dispatch(fetchChannelsUsernames()));
          }
        });
      }
    });
  };
}

export function selectChannel(channel) {
  return {type: SELECT_CHANNEL, payload: channel};
}

export function deleteAllChannels(options = {csrf_token: null}) {
  return dispatch => {
    Request.delete(`/api/youtube_channels`).csrf(options.csrf_token).end(() => {
      dispatch(fetchChannelsUsernames());
    });
  };
}

export function deleteChannel(options = {id: null, csrf_token: null}) {
  return dispatch => {
    Request.delete(`/api/youtube_channels/${options.id}`)
      .csrf(options.csrf_token)
      .end(() => {
        dispatch(fetchChannelsUsernames());
      });
  };
}

// ========== END CHANNEL ACTIONS ==========
// ========== VIDEO ACTIONS ==========
export function selectVideo(video) {
  return {type: SELECT_VIDEO, payload: video};
}

export function fetchVideos(channel) {
  return dispatch => {
    if (channel !== undefined) {
      const url = PLAYLIST_URL + channel.uploads;
      Request.get(url).end((error, response) => {
        if (error) {
          console.log('Error occured while fetching videos');
        } else {
          const videos = response.body.items.map(video => video.snippet);
          dispatch(setVideos(videos));
        }
      });
    } else {
      dispatch(setVideos([]));
    }
  };
}

export function setVideos(videos) {
  return {type: SET_VIDEOS, payload: videos};
}

// ========== END VIDEO ACTIONS ==========
// ========== FORM ACTIONS ==========
export function onUsernameInput(event) {
  return {type: ON_USERNAME_INPUT, payload: event};
}