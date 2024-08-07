import { findById, upsert } from '../helpers'

export default {
	authUser: (state, getters) => {
		return getters.user(state.authId)
	},
	user: (state) => {
		return (id) => {
			const user = findById(state.users, id)
			if (!user) return {}
			return {
				...user,
				get posts() {
					return state.posts.filter((post) => post.userId === user.id)
				},
				get postsCount() {
					return user.postsCount || 0
				},
				get threads() {
					return state.threads.filter((thread) => thread.userId === user.id)
				},
				get threadsCount() {
					return user.threads?.length || 0
				},
			}
		}
	},
	thread: (state) => {
		return (id) => {
			const thread = findById(state.threads, id)
			if (!thread) return {}
			return {
				...thread,
				get author() {
					return findById(state.users, thread.userId)
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
	forum: (state) => {
		return (id) => {
			const forum = findById(state.forums, id)
			return {
				...forum,
			}
		}
	},
}
