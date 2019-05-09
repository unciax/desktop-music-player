<template>
  <div ref="playerbackground" id="player_background">
    <div id="wrapper">
      <div class="flex-item">
        <div v-show="!isShowPlaylist">
          <div class="row">
            <div class="col-9">
              <button class="alt" @click="previousMusic()" v-bind:disabled="!isFileSelect && !isPlaying"><icon name="skip_previous"></icon></button>
              <button @click="control()" v-bind:disabled="!isFileSelect">
                 <icon v-if="isPlaying" name="pause"></icon>
                 <icon v-if="!isPlaying" name="play_arrow"></icon>
              </button>
              <button @click="stop()" v-bind:disabled="!isFileSelect && !isPlaying"><icon name="stop"></icon></button>
              <button @click="nextMusic()" v-bind:disabled="!isFileSelect && !isPlaying"><icon name="skip_next"></icon></button>
              &nbsp;
            </div>
            <div class="col-3" style="text-align:right;">
              <button @click="showPlaylist()"><icon name="playlist_play"></icon></button>
            </div>
          </div>
          <div class="row">
            <div class="col">
              <p>&nbsp;</p>
              <p>
                {{ currentMusicTitle }}<br/>
                {{ currentMusicArtist }}<br/>
                {{ currentMusicTime | timeString }} / {{ currentMusicDuration | timeString }}
              </p>
            </div>
          </div>
          <div style="width: 100%; height: 250px;">
            <music-visualizer v-bind:audioElement="audio" responsive></music-visualizer>
          </div>
        </div>
        <div v-show="isShowPlaylist">
          <playlist v-on:currentPlayingChange="onPlayingChanged" v-on:triggerHide="hidePlaylist" ref="playlist"></playlist>
        </div>
        <audio ref="audio" v-bind:src="url" @canplay="playAfterLoaded()" @timeupdate="updateCurrentTime()" @ended="nextMusic()"></audio>
      </div>
    </div> 
  </div>
</template>

<script>
  import MusicVisualizer from '@/components/MusicVisualizer'
  import Playlist from '@/components/Playlist'

  export default {
    name: 'player-page',
    components: {
      MusicVisualizer,
      Playlist
    },
    data () {
      return {
        isFileSelect: false,
        isPlaying: false,
        audio: null,
        url: null,
        list: null,
        playerbackground: null,
        currentMusicTitle: null,
        currentMusicArtist: null,
        currentMusicDuration: null,
        currentMusicTime: null,
        isShowPlaylist: false
      }
    },
    mounted () {
      this.audio = this.$refs.audio
      this.audio.volume = 0.3
      this.list = this.$refs.playlist
      this.playerbackground = this.$refs.playerbackground
      this.isShowPlaylist = true
    },
    methods: {
      control () {
        if (this.isPlaying) {
          this.audio.pause()
        } else {
          this.audio.play()
        }
        this.isPlaying = !this.isPlaying
      },
      stop () {
        this.isPlaying = false
        this.audio.pause()
        this.audio.currentTime = 0
      },
      updateMusicInfomation (playlistItem) {
        this.currentMusicTitle = playlistItem.title
        this.currentMusicArtist = playlistItem.artist
        if (playlistItem.cover) {
          this.playerbackground.style.backgroundImage = 'url("' + playlistItem.cover + '")'
        } else {
          this.playerbackground.style.backgroundImage = 'none'
        }
      },
      updateCurrentTime () {
        this.currentMusicTime = this.audio.currentTime
      },
      playAfterLoaded () {
        this.currentMusicDuration = this.audio.duration
        this.currentMusicTime = this.audio.currentTime
        this.audio.play()
        this.isPlaying = true
      },
      onPlayingChanged (playlistItem) {
        this.isFileSelect = true
        this.url = playlistItem.url
        this.updateMusicInfomation(playlistItem)
      },
      nextMusic () {
        this.list.nextMusic()
      },
      previousMusic () {
        this.list.previousMusic()
      },
      showPlaylist () {
        this.isShowPlaylist = true
      },
      hidePlaylist () {
        this.isShowPlaylist = false
      }
    },
    filters: {
      timeString: function (value) {
        if (!value) return '00:00'
        let sec = value % 60
        let min = value > 60 ? (value - sec) / 60 : 0
        let hour = min > 60 ? (min - (min % 60)) / 60 : 0
        sec = Math.round(sec)
        let displayString = sec < 10 ? '0' + sec : sec
        displayString = (min < 10 ? '0' + min : min) + ':' + displayString
        displayString = (hour > 0 ? (hour < 10 ? '0' + hour : hour) + ':' : '') + displayString
        return displayString
      }
    }
  }
</script>

<style>
  #player_background, #wrapper {
    height: 100vh;
    width: 100vw;
  }

  #wrapper {
    background: rgba(0, 0, 0, .5);
    padding: 0;
    margin: 0;
    display: -webkit-box;
    display: -moz-box;
    display: -ms-flexbox;
    display: -webkit-flex;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .flex-item {
    padding: 10px;
    width: 100%;
    max-width: 768px;
  }

  #player_background {
    background-size: cover;
    background-repeat: no-repeat;
  }
</style>
