<template>
  <div class="row item" @mouseover="currentHover = true" @mouseleave="currentHover = false">
    <div class="col-1" @click="emitClick">
      <icon name="volume_up" v-show="index === watchIndex"></icon>
    </div>
    <div class="col-10" @click="emitClick">
      {{ item.title }}
    </div>
    <div class="col-1" @click="emitDestory">
      <icon name="delete" v-show="currentHover"></icon>
    </div>
  </div> 
</template>

<script>
  import PlaylistItem from '@/model/PlaylistItem'

  export default {
    name: 'list-item',
    props: {
      index: {
        type: Number,
        default: 0
      },
      watchIndex: {
        type: Number,
        default: 0
      },
      item: {
        type: PlaylistItem,
        default: null
      },
      fn: {
        type: Function
      }
    },
    data () {
      return {
        currentHover: false
      }
    },
    mounted () {
    },
    methods: {
      emitClick () {
        this.$emit('click', this.fn)
      },
      emitDestory () {
        this.$emit('destory')
      }
    },
    watch: {
    }
  }
</script>

<style scoped>
  .item {
    color: #fff;
    padding: 10px 25px;
    border-radius: 0.5em;
  }
  .item:hover {
    background: rgba(0, 0, 0, .1);
    cursor: pointer;
  }
</style>
