import firebase from 'firebase'
import { findById, upsert, docToResource, makeAppendChildToParentMutation } from '../../helpers'

export default {
	namespaced: true,
	state: {
		items: [],
	},
	getters: {
		thread: (state, getters, rootState) => {
			return (id) => {
				const thread = findById(state.items, id)
				if (!thread) return {}
				return {
					...thread,
					get author() {
						return findById(rootState.users.items, thread.userId)
					},
					get repliesCount() {
						return thread.posts?.length - 1 || 0
					},
					get contributorsCount() {
						return thread.contributors?.length || 0
					},
				}
			}
		},
	},
	actions: {
		async createThread({ commit, state, dispatch, rootState }, { text, title, forumId }) {
			const userId = rootState.auth.authId
			const publishedAt = firebase.firestore.FieldValue.serverTimestamp()
			const threadRef = firebase.firestore().collection('threads').doc()
			const thread = { forumId, title, publishedAt, userId, id: threadRef.id }
			const userRef = firebase.firestore().collection('users').doc(userId)
			const forumRef = firebase.firestore().collection('forums').doc(forumId)
			const batch = firebase.firestore().batch()
			console.log(userRef)

			batch.set(threadRef, thread)
			batch.update(userRef, {
				threads: firebase.firestore.FieldValue.arrayUnion(threadRef.id),
			})
			batch.update(forumRef, {
				threads: firebase.firestore.FieldValue.arrayUnion(threadRef.id),
			})
			await batch.commit()
			const newThread = await threadRef.get()
			commit('setItem', { resource: 'threads', item: { ...newThread.data(), id: newThread.id } }, { root: true })
			commit('users/appendThreadToUser', { parentId: userId, childId: threadRef.id }, { root: true })
			commit('forums/appendThreadToForum', { parentId: forumId, childId: threadRef.id }, { root: true })
			await dispatch('posts/createPost', { text, threadId: threadRef.id }, { root: true })
			return thread
		},
		async updateThread({ commit, state, rootState }, { title, text, id }) {
			const thread = findById(state.items, id)
			const post = findById(rootState.posts.items, thread.posts[0])
			let newThread = { ...thread, title }
			let newPost = { ...post, text }
			const threadRef = firebase.firestore().collection('threads').doc(id)
			const postRef = firebase.firestore().collection('posts').doc(post.id)
			const batch = firebase.firestore().batch()
			batch.update(threadRef, newThread)
			batch.update(postRef, newPost)
			await batch.commit()
			newThread = await threadRef.get()
			newPost = await postRef.get()
			commit('setItem', { resource: 'threads', item: newThread }, { root: true })
			commit('setItem', { resource: 'users', item: newPost }, { root: true })
			return docToResource(newThread)
		},
		fetchThread: ({ dispatch }, { id }) => dispatch('fetchItem', { resource: 'threads', id }, { root: true }),
		fetchThreads: ({ dispatch }, { ids }) => dispatch('fetchItems', { resource: 'threads', ids }, { root: true }),
	},
	mutations: {
		appendPostToThread: makeAppendChildToParentMutation({ parent: 'threads', child: 'posts' }),
		appendContributorToThread: makeAppendChildToParentMutation({ parent: 'threads', child: 'contributors' }),
	},
	modules: {},
}
