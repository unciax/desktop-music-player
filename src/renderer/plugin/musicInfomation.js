export default {
  install (Vue, options) {
    Vue.prototype.$getMusicInfomation = (src) => {
      return new Promise((resolve, reject) => {
        let tagLib = require('music-metadata')
        tagLib.parseFile(decodeURI(src.replace('file:/', '')))
          .then(metadata => {
            let info = metadata.common
            let title = info.title ? info.title : decodeURI(src.substring(src.lastIndexOf('/') + 1, src.length))
            let artist = info.artist ? info.artist : 'No Artist'
            let cover = info.picture ? 'data:image/jpeg;base64,' + info.picture[0].data.toString('base64') : null
            let result = {
              musicTitle: title,
              musicArtist: artist,
              musicCover: cover
            }
            resolve(result)
          })
          .catch(err => {
            reject(err)
          })
      })
    }
  }
}
