<template>
	<div class="thread-list push-top">
		<h2 class="list-title">Threads</h2>
		<div
			v-for="thread in threads"
			:key="thread.id"
			class="thread">
			<div>
				<p>
					<router-link :to="{ name: 'ThreadView', params: { id: thread.id } }">{{ thread.title }}</router-link>
				</p>
				<p class="text-faded text-xsmall">
					By
					<a href="#">{{ userById(thread.userId).name }}</a>
					created
					<AppDate :timestamp="thread.publishedAt" />
				</p>
			</div>
			<div class="activity">
				<p class="replies-count">{{ thread.repliesCount }} replies</p>
				<img
					class="avatar-medium"
					:src="userById(thread.userId).avatar"
					alt="" />
				<div>
					<p class="text-xsmall">
						<a href="#">{{ userById(thread.userId).name }}</a>
					</p>
					<p class="text-xsmall text-faded">
						<AppDate :timestamp="thread.publishedAt" />
					</p>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	import { findById } from '../helpers/index'

	export default {
		props: {
			threads: Array,
		},

		methods: {
			userById(userId) {
				return findById(this.$store.state.users.items, userId) || {}
			},
		},
	}
</script>

<style scoped></style>
