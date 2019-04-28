<template>
  <div class="visualizer-container" ref="container">
    <canvas ref="canvas"></canvas>
  </div>
</template>

<script>
  export default {
    name: 'music-visualizer',
    props: {
      audioElement: {
        type: HTMLElement,
        default: null
      },
      width: {
        type: Number,
        default: 500
      },
      height: {
        type: Number,
        default: 200
      },
      responsive: {
        type: Boolean,
        default: false
      }
    },
    data () {
      return {
        ctx: null,
        canvas: null,
        audioAnalyser: null,
        audioContext: null,
        audioSrc: null,
        audioDataArray: new Uint8Array(256),
        barSize: {
          width: 1,
          height: 1
        }
      }
    },
    mounted () {
      this.canvas = this.$refs.canvas
      this.audioContext = new AudioContext()

      this.setSize()
      this.registerWindowResizeEvent()
      this.initCanvas()
      this.renderVisualization()
    },
    beforeDestroy: function () {
      window.removeEventListener('resize', this.setSize)
    },
    methods: {
      registerWindowResizeEvent () {
        window.addEventListener('resize', this.setSize)
      },
      /**
       * 設定畫布大小
       */
      setSize () {
        if (this.responsive) {
          var parentSize = this.getParentElementSize()
          this.$refs.container.style.height = parentSize.height + 'px'
          this.$refs.container.style.width = parentSize.width + 'px'
        } else {
          this.$refs.container.style.height = this.height + 'px'
          this.$refs.container.style.width = this.width + 'px'
        }
        this.canvas.height = this.$refs.container.style.height.replace(/px/g, '')
        this.canvas.width = this.$refs.container.style.width.replace(/px/g, '')
        this.reCalculateBarSize()
      },
      /**
       * 重新計算條狀的大小
       */
      reCalculateBarSize () {
        this.barSize.width = (this.canvas.width / this.audioDataArray.length) * 1.1
      },
      /**
       * 取得父元素的大小
       */
      getParentElementSize () {
        var styles = window.getComputedStyle(this.$el.parentElement)
        var vPadding = parseFloat(styles.paddingTop) + parseFloat(styles.paddingBottom)
        var hPadding = parseFloat(styles.paddingLeft) + parseFloat(styles.paddingRight)
        return {
          height: this.$el.parentElement.clientHeight - vPadding,
          width: this.$el.parentElement.clientWidth - hPadding
        }
      },
      /**
       * 初始化畫布
       */
      initCanvas () {
        this.ctx = this.canvas.getContext('2d')
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
      },
      /**
       * 更新視覺化顯示結果
       */
      renderVisualization () {
        requestAnimationFrame(this.renderVisualization)

        var offsetX = 0
        if (this.audioAnalyser) {
          this.audioAnalyser.getByteFrequencyData(this.audioDataArray)
        }

        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)

        this.ctx.shadowBlur = 20
        this.ctx.shadowColor = 'rgb(255, 255, 255)'
        this.ctx.fillStyle = 'rgb(255, 255, 255)'
        for (var i = 0; i < this.audioDataArray.length; i++) {
          this.barSize.height = this.audioDataArray[i] * (this.canvas.height / 768) + 1

          this.ctx.fillRect(offsetX, 30, this.barSize.width, this.barSize.height)

          offsetX += (this.barSize.width + 1.5)
        }
      },
      /**
       * 初始化音樂分析
       */
      initAnalyser () {
        this.audioAnalyser = this.audioContext.createAnalyser()
        this.audioSrc = this.audioContext.createMediaElementSource(this.audioElement)
        this.audioSrc.connect(this.audioAnalyser)
        this.audioAnalyser.fftSize = 512
        this.audioDataArray = new Uint8Array(this.audioAnalyser.frequencyBinCount)
        this.renderVisualization()
      }
    },
    watch: {
      audioElement: function (value) {
        this.initAnalyser()
      }
    }
  }
</script>

<style>
</style>
