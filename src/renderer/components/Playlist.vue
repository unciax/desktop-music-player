<template>
  <ul>
    <li v-for="item in list" v-bind:key="item.url">
      {{ item.title }}
    </li>
  </ul>
</template>

<script>
  import PlaylistItem from '@/model/PlaylistItem'

  export default {
    name: 'playlist',
    data () {
      return {
        currentIndex: 0,
        _currentPlaying: null,
        list: []
      }
    },
    mounted () {
    },
    computed: {
      currentPlaying: {
        get: function () {
          return this._currentPlaying
        },
        set: function (newValue) {
          this._currentPlaying = newValue
          this.$emit('currentPlayingChange', newValue)
        }
      }
    },
    methods: {
      addMusic (url) {
        this.$getMusicInfomation(url)
          .then(info => {
            let item = new PlaylistItem(url, info.title, info.artist, info.cover)
            this.list.push(item)
            if (!this._currentPlaying) {
              this.currentPlaying = item
              this.currentIndex = 0
            }
          })
          .catch(err => {
            console.error(err.message)
          })
      },
      removeMusic (index) {
        if (index === this.currentIndex && index === (this.list.length - 1)) {
          this.currentIndex = 0
        }
        this.list.slice(index, 1)
        if (this.list.length === 0) {
          this.currentIndex = -1
        }
      },
      nextMusic () {
        if (this.list.length === 0) {
          return
        }
        this.currentIndex = (this.currentIndex + 1 >= this.list.length) ? 0 : this.currentIndex + 1
        this.currentPlaying = this.list[this.currentIndex]
      },
      previousMusic () {
        if (this.list.length === 0) {
          return
        }
        this.currentIndex = (this.currentIndex - 1 <= 0) ? this.list.length - 1 : this.currentIndex - 1
        this.currentPlaying = this.list[this.currentIndex]
      }
    },
    watch: {
    }
  }
</script>

<style>
</style>
