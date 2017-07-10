import { connect } from "react-redux";
import HomePage from "./HomePage";
import {
  fetchYoutubeFollows,
  fetchYoutubeVideos,
} from "../../actions/youtube_actions";
import { fetchTwitchFollows } from "../../actions/twitch_actions";

const mapStateToProps = state => ({
  youtube: state.youtube,
  mode: state.mode,
});

const mapDispatchToProps = dispatch => ({
  fetchYoutubeFollows: () => dispatch(fetchYoutubeFollows()),
  fetchYoutubeVideos: url => dispatch(fetchYoutubeVideos(url)),
  fetchTwitchFollows: () => dispatch(fetchTwitchFollows()),
});

export default connect(mapStateToProps, mapDispatchToProps)(HomePage);
