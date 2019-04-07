<template>
  <div id="wrapper">
    {{ currentMusicTitle }} / {{ currentMusicArtist }} <br/>
    {{ currentMusicTime | timeString }} / {{ currentMusicDuration | timeString }} <br/>
    <audio ref="audio" v-bind:src="url" @canplay="updateMusicInfomation()" @timeupdate="updateCurrentTime($event)" @ended="stop()"></audio>
    <button @click="control()">{{ isPlaying ? 'Pause' : 'Play'}}</button>
    <button class="alt" @click="stop()" v-bind:disabled="!isPlaying">Stop</button>
  </div>
</template>

<script>
  export default {
    name: 'player-page',
    data () {
      return {
        tagLib: require('music-metadata'),
        isPlaying: false,
        audio: null,
        url: 'file:///Users/unciax/Desktop/bgm162.mp3',
        currentMusicTitle: null,
        currentMusicArtist: null,
        currentMusicDuration: null,
        currentMusicTime: null
      }
    },
    mounted () {
      this.audio = this.$refs.audio
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
      updateCurrentTime ($event) {
        this.currentMusicTime = this.audio.currentTime
      },
      changeToDisplayTimeString (value) {
        let sec = value % 60
        let min = (value - sec) / 60
        sec = Math.round(sec)
        return min + ':' + sec
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
