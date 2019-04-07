<template>
  <div id="wrapper">
    {{ currentMusicTitle }} / {{ currentMusicArtist }} <br/>
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
        currentMusicTitle: null,
        currentMusicArtist: null
      }
    },
    mounted () {
      let url = 'file:///Users/unciax/Desktop/01.mp3'
      this.audio = new Audio(url)
      this.tagLib.parseFile(url.replace('file:/', ''))
        .then(metadata => {
          this.currentMusicTitle = metadata.common.title
          this.currentMusicArtist = metadata.common.artist
        })
        .catch(err => {
          console.error(err.message)
        })
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
