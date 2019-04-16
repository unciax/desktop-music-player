import Vue from 'vue'

import App from './App'
import MusicInfomation from './plugin/musicInfomation'

Vue.config.productionTip = false

Vue.use(MusicInfomation)

/* eslint-disable no-new */
new Vue({
  components: { App },
  template: '<App/>'
}).$mount('#app')
