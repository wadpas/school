<template>
	<div
		v-for="post in posts"
		:key="post.id"
		class="post">
		<div class="user-info">
			<a
				href="#"
				class="user-name">
				{{ userById(post.userId).name }}
			</a>
			<a href="#">
				<img
					class="avatar-large"
					:src="userById(post.userId).avatar"
					alt="" />
			</a>

			<p class="desktop-only text-small">107 posts</p>
		</div>

		<div class="post-content">
			<div>
				<p>
					{{ post.text }}
				</p>
			</div>
		</div>

		<div class="post-date text-faded">
			<AppDate :timestamp="post.publishedAt" />
		</div>
	</div>
</template>

<script>
	export default {
		props: {
			posts: Array,
		},

		methods: {
			userById(userId) {
				return this.$store.state.users.find((user) => user.id === userId)
			},
		},
	}
</script>

<style scoped></style>
