<template>
  <div id="wrapper">
    <button @click="showOpenFileDialog()">Load Music</button>
    <p>&nbsp;</p>
    <div v-if="isFileSelect">
      {{ currentMusicTitle }} / {{ currentMusicArtist }} <br/>
      {{ currentMusicTime | timeString }} / {{ currentMusicDuration | timeString }} <br/><br/>
      <button @click="control()">{{ isPlaying ? 'Pause' : 'Play'}}</button>
      <button class="alt" @click="stop()" v-bind:disabled="!isPlaying">Stop</button>      
    </div>
    <div v-else>
      Press 'Load Music' button to select an audio file.
    </div>
    <input ref="file" type="file" name="name" style="display: none;" @change="loadFile()"/>
    <audio ref="audio" v-bind:src="url" @canplay="updateMusicInfomation()" @timeupdate="updateCurrentTime()" @ended="stop()"></audio>
  </div>
</template>

<script>
  export default {
    name: 'player-page',
    data () {
      return {
        tagLib: require('music-metadata'),
        isFileSelect: false,
        isPlaying: false,
        audio: null,
        file: null,
        url: null,
        currentMusicTitle: null,
        currentMusicArtist: null,
        currentMusicDuration: null,
        currentMusicTime: null
      }
    },
    mounted () {
      this.audio = this.$refs.audio
      this.file = this.$refs.file
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
      updateMusicInfomation () {
        this.tagLib.parseFile(this.audio.src.replace('file:/', ''))
          .then(metadata => {
            this.currentMusicTitle = metadata.common.title ? metadata.common.title : 'No Title'
            this.currentMusicArtist = metadata.common.artist ? metadata.common.artist : 'No Artist'
          })
          .catch(err => {
            console.error(err.message)
          })
        this.currentMusicDuration = this.audio.duration
        this.currentMusicTime = this.audio.currentTime
      },
      updateCurrentTime () {
        this.currentMusicTime = this.audio.currentTime
      },
      showOpenFileDialog () {
        this.file.click()
      },
      loadFile () {
        if (this.file.files.length === 0) {
          this.isFileSelect = false
          return
        }
        this.url = 'file://' + this.file.files[0].path
        this.isFileSelect = true
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

  body { font-family: 'Source Sans Pro', sans-serif; }

  #wrapper {
    background:
      radial-gradient(
        ellipse at top left,
        rgba(255, 255, 255, 1) 40%,
        rgba(229, 229, 229, .9) 100%
      );
    height: 100vh;
    padding: 60px 80px;
    width: 100vw;
  }

  button {
    font-size: .8em;
    cursor: pointer;
    outline: none;
    padding: 0.75em 2em;
    border-radius: 2em;
    display: inline-block;
    color: #fff;
    background-color: #4fc08d;
    transition: all 0.15s ease;
    box-sizing: border-box;
    border: 1px solid #4fc08d;
  }

  button.alt {
    color: #42b983;
    background-color: transparent;
  }

  button:disabled {
    background-color: #555;
    border: 1px solid #555;
  }

  button.alt:disabled {
    color: #555;
    background-color: transparent;
    cursor: initial;
  }
</style>
