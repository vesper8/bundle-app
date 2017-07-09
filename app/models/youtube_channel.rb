# == Schema Information
#
# Table name: youtube_channels
#
#  id         :integer          not null, primary key
#  username   :string           not null
#  url        :string           not null
#  created_at :datetime         not null
#  updated_at :datetime         not null
#

# API Constants
PLAYLIST_URL = "https://www.googleapis.com/youtube/v3/playlistItems?" +
  "part=snippet&key=#{ENV['youtube_api_key']}&playlistId="

CHANNEL_USERNAME_URL = "https://www.googleapis.com/youtube/v3/channels?" +
  "part=snippet%2CcontentDetails&key=#{ENV['youtube_api_key']}&forUsername="

CHANNEL_ID_URL = "https://www.googleapis.com/youtube/v3/channels?"+
  "part=snippet%2CcontentDetails&key=#{ENV['youtube_api_key']}&id="


class YoutubeChannel < ApplicationRecord
  include HTTParty
  validate :validate_channel

  validates :name, uniqueness: true, presence: true
  validates :url, presence: true

  has_many :youtube_channel_follows
  has_many :users, through: :youtube_channel_follows

  def validate_channel
    # Perform two checks, valid username or valid channel id
    request_data = username_request

    if request_data["items"].length == 0
      request_data = channel_id_request
    end

    # Further process if channel is valid
    if request_data["items"].length > 0
      process_channel_data(request_data)
    else
      self.errors[:base] << "Not a valid username or channel ID"
    end
  end

  def process_channel_data(request_data)
    channel_data = request_data["items"][0]

    self.display_name = channel_data["snippet"]["title"]
    self.thumbnail = channel_data["snippet"]["thumbnails"]["default"]["url"]
    self.upload_id = channel_data["contentDetails"]["relatedPlaylists"]["uploads"]
  end

  def username_request
    self.url = CHANNEL_USERNAME_URL + self.name
    HTTParty.get(self.url)
  end

  def channel_id_request
    self.url = CHANNEL_ID_URL + self.name
    HTTParty.get(self.url)
  end

  def get_videos
    video_url = PLAYLIST_URL + self.upload_id
    HTTParty.get(video_url)["items"]
  end
end
