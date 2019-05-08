<template>
  <div>
    <div class="row">
      <div class="col-9">
        <button @click="showFileDialog()"><font-awesome-icon icon="plus" /></button>
      </div>
      <div class="col-3 text-right">
        <button @click="hidePlaylist()"><font-awesome-icon icon="times" /></button>
      </div>
    </div>
    <input ref="file" type="file" name="name" style="display: none;" @change="loadMusic()"/>
    <div class="row">
      <div class="col list-container" style="height: 330px;">
        <div class="list-disable text-center" v-show="list.length == 0">
          <h1>Empty Playlist</h1>
          <p>&nbsp;</p>
          <p>Press <font-awesome-icon icon="plus" /> to add song into playlist.</p>
        </div>
        <div class="list" v-for="(item, index) in list" v-bind:key="item.url" @click="changeToSelectedMusic(index)">
          <p>
            <font-awesome-icon v-if="index === currentIndex" icon="volume-up" />&nbsp;
            {{ item.title }}
          </p>
        </div> 
      </div>
    </div>
     
  </div>
</template>

<script>
  import PlaylistItem from '@/model/PlaylistItem'

  export default {
    name: 'playlist',
    data () {
      return {
        currentIndex: 0,
        _currentPlaying: null,
        list: [],
        file: null
      }
    },
    mounted () {
      this.file = this.$refs.file
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
      showFileDialog () {
        this.file.click()
      },
      loadMusic () {
        if (this.file.files.length === 0) {
          return
        }
        this.addMusic('file://' + this.file.files[0].path)
      },
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
        this.currentIndex = (this.currentIndex - 1 < 0) ? this.list.length - 1 : this.currentIndex - 1
        this.currentPlaying = this.list[this.currentIndex]
      },
      changeToSelectedMusic (index) {
        this.currentIndex = index
        this.currentPlaying = this.list[this.currentIndex]
      },
      hidePlaylist () {
        this.$emit('triggerHide')
      }
    },
    watch: {
    }
  }
</script>

<style>
  .list-container {
    padding-top: 5px;
    height: 100%;
    max-height: 400px;
    overflow-y: scroll;
  }
  div.list,
  div.list-disable {
    color: #fff;
    padding: 10px 30px;
    border-radius: 0.5em;
  }
  div.list:hover {
    background: rgba(0, 0, 0, .1);
    cursor: pointer;
  }
  div.list-disable:hover {
    background: none;
    cursor: initial;
  }
  div.list svg {
    margin-left: -15px;
  }
</style>
