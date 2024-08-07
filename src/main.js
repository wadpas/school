import { createApp } from 'vue'
import '../src/assets/style.css'
import App from './App.vue'
import router from './router'
import store from './store'
import AppDate from './components/AppDate.vue'
import PostList from './components/PostList.vue'
import PostEditor from './components/PostEditor.vue'
import ForumView from './views/ForumView.vue'
import ThreadCreate from './views/ThreadCreate.vue'
import ThreadList from './components/ThreadList.vue'
import ForumList from './components/ForumList.vue'
import TheNavbar from './components/TheNavbar.vue'
import ProfileCard from './components/ProfileCard.vue'
import ProfileCardEditor from './components/ProfileCardEditor.vue'
import ThreadEditor from './components/ThreadEditor.vue'
import firebaseConfig from './config/firebase'
import firebase from 'firebase/app'
import FontAwesome from './plugins/FontAwesome'

firebase.initializeApp(firebaseConfig)
firebase.auth().onAuthStateChanged((user) => {
	if (user) {
		store.dispatch('fetchAuthUser')
	}
})

createApp(App)
	.use(store)
	.use(router)
	.use(FontAwesome)
	.component('AppDate', AppDate)
	.component('PostList', PostList)
	.component('PostEditor', PostEditor)
	.component('ForumView', ForumView)
	.component('ThreadCreate', ThreadCreate)
	.component('ThreadList', ThreadList)
	.component('ForumList', ForumList)
	.component('TheNavbar', TheNavbar)
	.component('ProfileCard', ProfileCard)
	.component('ProfileCardEditor', ProfileCardEditor)
	.component('ThreadEditor', ThreadEditor)
	.mount('#app')
