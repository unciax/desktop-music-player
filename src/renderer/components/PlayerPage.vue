<template>
  <div ref="playerbackground" id="player_background">
    <div id="wrapper">
      <br/>
      <button @click="showOpenFileDialog()">Load Music</button>
      <button v-if="isFileSelect" @click="control()">{{ isPlaying ? 'Pause' : 'Play'}}</button>
      <button v-if="isFileSelect" class="alt" @click="stop()" v-bind:disabled="!isPlaying">Stop</button> 
      <p>&nbsp;</p>
      <div v-if="isFileSelect">
        {{ currentMusicTitle }} / {{ currentMusicArtist }} <br/>
        {{ currentMusicTime | timeString }} / {{ currentMusicDuration | timeString }} <br/><br/>
      </div>
      <div v-else>
        Press 'Load Music' button to select an audio file.
      </div>
      <input ref="file" type="file" name="name" style="display: none;" @change="loadFile()"/>
      <audio ref="audio" v-bind:src="url" @canplay="updateMusicInfomation()" @timeupdate="updateCurrentTime()" @ended="stop()"></audio>
      <canvas id="canvas" ref="canvas"></canvas>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'player-page',
    data () {
      return {
        isFileSelect: false,
        isPlaying: false,
        audio: null,
        file: null,
        url: null,
        canvas: null,
        playerbackground: null,
        currentMusicTitle: null,
        currentMusicArtist: null,
        currentMusicDuration: null,
        currentMusicTime: null,
        audioContext: null,
        audioSrc: null,
        audioAnalyser: null,
        ctx: null,
        bufferLength: null,
        canvasHeight: 0,
        canvasWidth: 0,
        audioDataArray: null,
        barWidth: 0,
        barHeight: 0,
        x: 0
      }
    },
    mounted () {
      this.audio = this.$refs.audio
      this.file = this.$refs.file
      this.canvas = this.$refs.canvas
      this.playerbackground = this.$refs.playerbackground
      this.audioContext = new AudioContext()
      this.audioSrc = this.audioContext.createMediaElementSource(this.audio)
      this.ctx = this.canvas.getContext('2d')
      window.addEventListener('resize', this.updateCanvasSize)
    },
    beforeDestroy: function () {
      if (this.audioContext) {
        this.audioContext.close()
      }
      window.removeEventListener('resize', this.updateCanvasSize)
    },
    methods: {
      control () {
        if (this.isPlaying) {
          this.audio.pause()
        } else {
          this.audio.play()
          this.renderFrame()
        }
        this.isPlaying = !this.isPlaying
      },
      stop () {
        this.isPlaying = false
        this.audio.pause()
        this.audio.currentTime = 0
      },
      updateMusicInfomation () {
        this.$getMusicInfomation(this.audio.src)
          .then(info => {
            this.currentMusicTitle = info.musicTitle
            this.currentMusicArtist = info.musicArtist
            let background = this.playerbackground.style
            if (info.musicCover) {
              background.backgroundImage = 'url("' + info.musicCover + '")'
            } else {
              background.backgroundImage = 'none'
            }
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
          this.ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight)
          this.playerbackground.style.backgroundImage = 'none'
          return
        }
        this.url = 'file://' + this.file.files[0].path
        this.isFileSelect = true
        this.audioAnalyser = this.audioContext.createAnalyser()
        this.audioSrc.connect(this.audioAnalyser)
        this.audioAnalyser.connect(this.audioContext.destination)

        this.audioAnalyser.fftSize = 512

        this.bufferLength = this.audioAnalyser.frequencyBinCount

        this.audioDataArray = new Uint8Array(this.bufferLength)

        this.updateCanvasSize()
        this.renderFrame()

        this.x = 0
      },
      renderFrame () {
        requestAnimationFrame(this.renderFrame)

        this.x = 0

        this.audioAnalyser.getByteFrequencyData(this.audioDataArray)

        this.ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight)

        // this.ctx.shadowBlur = 0
        // this.ctx.fillStyle = 'rgb(255, 255, 255)'

        // this.ctx.font = '24px sans-serif'
        // this.ctx.fillText(this.currentMusicTitle, 0, 20)

        // this.ctx.font = '18px sans-serif'
        // this.ctx.fillText(this.currentMusicArtist, 0, 45)

        // this.ctx.fillText(this.timeString(this.currentMusicTime), this.canvasWidth - 80, 45)

        this.ctx.fillStyle = 'rgb(255, 255, 255)'
        this.ctx.shadowBlur = 20
        this.ctx.shadowColor = 'rgb(255, 255, 255)'

        for (var i = 0; i < this.bufferLength; i++) {
          this.barHeight = this.audioDataArray[i] * 0.2 + 1

          this.ctx.fillRect(this.x, 60, this.barWidth, this.barHeight)

          this.x += this.barWidth + 1
        }
      },
      updateCanvasSize () {
        this.canvas.width = window.innerWidth - 20
        this.canvas.height = 500
        this.canvasWidth = this.canvas.width
        this.canvasHeight = this.canvas.height
        this.barWidth = (this.canvasWidth / this.bufferLength) * 1.1
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
    padding: 10px;
  }

  #player_background {
    background-size: cover;
    background-repeat: no-repeat;
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
    background-color: #999;
    border: 1px solid #999;
  }

  button.alt:disabled {
    color: #999;
    background-color: transparent;
    cursor: initial;
  }
</style>
