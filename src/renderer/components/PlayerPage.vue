<template>
  <div ref="playerbackground" id="player_background">
    <div id="wrapper">
      <div class="flex-item">
        <button @click="showOpenFileDialog()"><font-awesome-icon icon="folder-open" /></button>
        <button v-if="isFileSelect" @click="control()">
          <font-awesome-icon v-if="isPlaying" icon="pause" />
          <font-awesome-icon v-if="!isPlaying" icon="play" />
        </button>
        <button v-if="isFileSelect" class="alt" @click="stop()" v-bind:disabled="!isPlaying"><font-awesome-icon icon="stop" /></button> 
        <p>&nbsp;</p>
        <div v-if="isFileSelect">
          {{ currentMusicTitle }}<br/>
          {{ currentMusicArtist }}<br/>
          {{ currentMusicTime | timeString }} / {{ currentMusicDuration | timeString }}
        </div>
        <div v-else>
          Press 'Load Music' button to select an audio file.<br/><br/>
        </div>
        <input ref="file" type="file" name="name" style="display: none;" @change="loadFile()"/>
        <audio ref="audio" v-bind:src="url" @canplay="playAfterLoaded()" @timeupdate="updateCurrentTime()" @ended="nextMusic()"></audio>
        <div style="width: 100%; height: 250px;">
          <music-visualizer v-bind:audioElement="audio" responsive></music-visualizer>
        </div>
        <playlist v-on:currentPlayingChange="onPlayingChanged" ref="playlist"></playlist>
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
        file: null,
        url: null,
        list: null,
        playerbackground: null,
        currentMusicTitle: null,
        currentMusicArtist: null,
        currentMusicDuration: null,
        currentMusicTime: null
      }
    },
    mounted () {
      this.audio = this.$refs.audio
      this.file = this.$refs.file
      this.list = this.$refs.playlist
      this.playerbackground = this.$refs.playerbackground
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
      showOpenFileDialog () {
        this.file.click()
      },
      loadFile () {
        if (this.file.files.length === 0) {
          return
        }
        this.isFileSelect = true
        this.list.addMusic('file://' + this.file.files[0].path)
      },
      playAfterLoaded () {
        this.currentMusicDuration = this.audio.duration
        this.currentMusicTime = this.audio.currentTime
        this.audio.play()
        this.isPlaying = true
      },
      onPlayingChanged (playlistItem) {
        this.url = playlistItem.url
        this.updateMusicInfomation(playlistItem)
      },
      nextMusic () {
        this.isPlaying = false
        this.list.nextMusic()
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
  @import url('https://fonts.googleapis.com/css?family=Source+Sans+Pro');

  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  body { 
    font-family: 'Source Sans Pro', sans-serif;
    color: #fff;
    background:
      radial-gradient(
        ellipse at top left,
        rgba(255, 255, 255, 1) 40%,
        rgba(229, 229, 229, .9) 100%
      );
  }

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

  button {
    font-size: 1em;
    cursor: pointer;
    outline: none;
    padding: 0.75em 2em;
    border: 0px;
    border-radius: 0.5em;
    display: inline-block;
    color: #fff;
    background-color: transparent;
    transition: all 0.15s ease;
    box-sizing: border-box;
  }

  button:hover {
    background: rgba(0, 0, 0, .1);
  }

  button:hover .svg-inline--fa {
    -webkit-filter: drop-shadow( 0px 0px 4px rgba(255, 255, 255, .7));
    filter: drop-shadow( 0px 0px 4px rgba(255, 255, 255, .7));
  }

  button:disabled {
    color: #999;
  }

  button:disabled:hover {
    background: transparent;
  }

  button:disabled .svg-inline--fa {
    -webkit-filter: none;
    filter: none;
  }
</style>
