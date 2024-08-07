import { createStore } from 'vuex'
import getters from './getters'
import mutations from './mutations'
import actions from './actions'

export default createStore({
	state: {
		categories: [],
		forums: [],
		threads: [],
		posts: [],
		users: [],
		authId: null,
		unsubscribes: [],
	},
	getters,
	mutations,
	actions,
})
