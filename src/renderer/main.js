import Vue from 'vue'

import App from './App'
import MusicInfomation from './plugin/musicInfomation'
import { library } from '@fortawesome/fontawesome-svg-core'
import { fas } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

Vue.config.productionTip = false

/* FontAwesome Icon Initial */
library.add(fas)
Vue.component('font-awesome-icon', FontAwesomeIcon)

/* Plugin */
Vue.use(MusicInfomation)

/* eslint-disable no-new */
new Vue({
  components: { App },
  template: '<App/>'
}).$mount('#app')
