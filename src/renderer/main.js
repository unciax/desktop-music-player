import Vue from 'vue'

import App from './App'
import MusicInfomation from './plugin/musicInfomation'
import '@savoygu/vue-material-design-icons/src/icons'

/* Register component with one of 2 methods */
import Icon from '@savoygu/vue-material-design-icons/src/components/Icon'

// globally (in your main .js file)
Vue.component('icon', Icon)

Vue.config.productionTip = false

/* Plugin */
Vue.use(MusicInfomation)

/* eslint-disable no-new */
new Vue({
  components: { App },
  template: '<App/>'
}).$mount('#app')
