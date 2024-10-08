import firebase from 'firebase'

export default {
	namespaced: true,
	state: {
		authId: null,
		authUserUnsubscribe: null,
		authObserverUnsubscribe: null,
	},
	getters: {
		authUser: (state, getters, rootState, rootGetters) => {
			return rootGetters['users/user'](state.authId)
		},
	},
	actions: {
		initAuthentication({ dispatch, commit, state }) {
			if (state.authObserverUnsubscribe) state.authObserverUnsubscribe
			return new Promise((resolve, reject) => {
				const unsubscribe = firebase.auth().onAuthStateChanged(async (user) => {
					this.dispatch('auth/unsubscribeAuthUserSnapshot')
					if (user) {
						await this.dispatch('auth/fetchAuthUser')
						resolve(user)
					} else {
						resolve(null)
					}
				})
				commit('setAuthObserverUnsubscribe', unsubscribe)
			})
		},

		async registerUserWithEmailAndPassword({ dispatch }, { avatar = null, email, name, username, password }) {
			const result = await firebase.auth().createUserWithEmailAndPassword(email, password)
			avatar = await dispatch('uploadAvatar', { authId: result.user.uid, file: avatar })
			await dispatch('users/createUser', { id: result.user.uid, email, name, username, avatar }, { root: true })
		},

		async uploadAvatar({ state }, { authId, file }) {
			if (!file) return null
			authId = authId || state.authId
			const storageBucket = firebase.storage().ref().child(`uploads/${authId}/images/${Date.now()}-${file.name}`)
			const snapshot = await storageBucket.put(file)
			const url = await snapshot.ref.getDownloadURL()
			return url
		},

		async signInWithUserWithEmailAndPassword(context, { email, password }) {
			return firebase.auth().signInWithEmailAndPassword(email, password)
		},

		async signInWithGoogle({ dispatch }) {
			const provider = new firebase.auth.GoogleAuthProvider()
			const response = await firebase.auth().signInWithPopup(provider)
			const user = response.user
			const userRef = await firebase.firestore().collection('users').doc(user.uid)
			const userDoc = await userRef.get()
			if (!userDoc.exists) {
				return dispatch('createUser', {
					id: user.uid,
					email: user.email,
					name: user.displayName,
					username: user.email.split('@')[0],
					avatar: user.photoURL,
				})
			}
		},

		async signOut({ commit }) {
			await firebase.auth().signOut()
			commit('setAuthId', null)
		},

		fetchAuthUser: async ({ dispatch, state, commit }) => {
			const userId = firebase.auth().currentUser?.uid
			if (!userId) return
			await dispatch(
				'fetchItem',
				{
					resource: 'users',
					id: userId,
					handleUnsubscribe: (unsubscribe) => {
						commit('setAuthUserUnsubscribe', unsubscribe)
					},
				},
				{ root: true }
			)
			commit('setAuthId', userId)
		},

		async fetchAuthUsersPosts({ commit, state }, { startAfter }) {
			const posts = await firebase
				.firestore()
				.collection('posts')
				.orderBy('publishedAt', 'desc')
				.limit(10)
				.where('userId', '==', state.authId)
				.get()
			posts.forEach((post) => {
				commit('setItem', { resource: 'posts', item: post.data() }, { root: true })
			})
		},

		async unsubscribeAuthUserSnapshot({ state, commit }) {
			if (state.authUserUnsubscribe) {
				state.authUserUnsubscribe()
				commit('setAuthUserUnsubscribe', null)
			}
		},
	},
	mutations: {
		setAuthId(state, id) {
			state.authId = id
		},
		setAuthUserUnsubscribe(state, unsubscribe) {
			state.authUserUnsubscribe = unsubscribe
		},
		setAuthObserverUnsubscribe(state, unsubscribe) {
			state.authObserverUnsubscribe = unsubscribe
		},
	},
}
