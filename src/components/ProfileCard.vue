<template>
	<div class="profile-card">
		<p class="text-center">
			<img
				:src="user.avatar"
				:alt="`${user.name} profile picture`"
				class="avatar-xlarge" />
		</p>

		<h1 class="title">{{ user.username }}</h1>

		<p class="text-lead">{{ user.name }}</p>

		<p class="text-justify">{{ user.bio || 'No bio specified' }}</p>

		<span class="online">{{ user.name }} is online</span>

		<div class="stats">
			<span>{{ user.postsCount }} posts</span>
			<span>{{ user.threadsCount }} threads</span>
		</div>

		<hr />

		<p
			v-if="user.website"
			class="text-large text-center">
			<i class="fa fa-globe"></i>
			<a :href="user.website">{{ user.website }}</a>
		</p>
	</div>
	<div>
		<p class="text-xsmall text-faded text-center">Member since june 2003, last visited 4 hours ago</p>

		<div class="text-center">
			<hr />
			<router-link
				:to="{ name: 'ProfileEditView' }"
				class="btn-green btn-small">
				Edit Profile
			</router-link>
		</div>
	</div>
</template>

<script>
	export default {
		props: {
			user: {
				type: Object,
				required: true,
			},
		},
	}
</script>

<style lang="scss" scoped></style>
