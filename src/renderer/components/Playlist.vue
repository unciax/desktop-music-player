<template>
  <div>
    <!-- Control -->
    <div class="row">
      <div class="col-9">
        <button @click="showFileDialog()"><icon name="playlist_add"></icon></button>
      </div>
      <div class="col-3 text-right">
        <button @click="hidePlaylist()"><icon name="close"></icon></button>
      </div>
    </div>
    <input ref="file" type="file" name="name" style="display: none;" multiple accept="audio/*" @change="loadMusic()"/>
    <!-- Playlist -->
    <div class="row">
      <div class="col list-container" style="height: 330px;">
        <div class="list-disable text-center" v-show="list.length == 0">
          <h1>Empty Playlist</h1>
          <p>&nbsp;</p>
          <p>Press <icon name="playlist_add"></icon> to add song into playlist.</p>
        </div>
        <list-item 
          v-for="(item, index) in list" 
          :key="item.url" 
          :item="item" 
          :index="index"
          :watchIndex="currentIndex" 
          @click="changeToSelectedMusic(index)"
          @destory="removeMusic(index)"></list-item> 
      </div>
    </div>
     
  </div>
</template>

<script>
  import PlaylistItem from '@/model/PlaylistItem'
  import ListItem from '@/components/ListItem'

  export default {
    name: 'playlist',
    components: {
      ListItem
    },
    data () {
      return {
        currentIndex: -1,
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
        for (var index = 0; index < this.file.files.length; index++) {
          this.addMusic('file://' + this.file.files[index].path)
        }
      },
      addMusic (url) {
        this.$getMusicInfomation(url)
          .then(info => {
            let item = new PlaylistItem(url, info.title, info.artist, info.cover)
            if (this.list.find(x => x.url === item.url) === undefined) {
              this.list.push(item)
            }
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
        this.list.splice(index, 1)
        if (index === this.currentIndex) {
          this.changeToSelectedMusic(index)
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
        if (index < this.list.length) {
          this.currentIndex = index
          this.currentPlaying = this.list[this.currentIndex]
        } else {
          this.currentIndex = -1
          this.currentPlaying = new PlaylistItem('', '', '', null)
        }
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
  div.list-disable {
    color: #fff;
    padding: 10px 30px;
    border-radius: 0.5em;
  }
</style>
