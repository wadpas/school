<template>
	<div class="flex-grid justify-center">
		<div class="col-2">
			<VeeForm
				@submit="register"
				class="card card-form">
				<h1 class="text-center">Register</h1>

				<div class="form-group">
					<label for="name">Full Name</label>
					<VeeField
						name="name"
						id="name"
						v-model="form.name"
						type="text"
						class="form-input"
						rules="required" />
					<VeeErrorMessage
						name="name"
						class="form-error" />
				</div>

				<div class="form-group">
					<label for="username">Username</label>
					<VeeField
						name="username"
						id="username"
						v-model="form.username"
						type="text"
						class="form-input"
						rules="required|unique:users,username" />
					<VeeErrorMessage
						name="username"
						class="form-error" />
				</div>

				<div class="form-group">
					<label for="email">Email</label>
					<VeeField
						name="email"
						id="email"
						v-model="form.email"
						type="email"
						class="form-input"
						rules="required|email|unique:users,email" />
					<VeeErrorMessage
						name="email"
						class="form-error" />
				</div>

				<div class="form-group">
					<label for="password">Password</label>
					<VeeField
						name="password"
						label="Password"
						id="password"
						v-model="form.password"
						type="password"
						class="form-input"
						rules="required|min:8" />
					<VeeErrorMessage
						name="password"
						class="form-error" />
				</div>

				<div class="form-group">
					<label for="avatar">
						Avatar
						<div v-if="avatarPreview">
							<img
								:src="avatarPreview"
								class="avatar-xlarge" />
						</div>
					</label>
					<VeeField
						name="avatar"
						v-show="!avatarPreview"
						id="avatar"
						type="file"
						class="form-input"
						@change="handleImageUpload"
						accept="image/*" />
				</div>

				<div class="form-actions">
					<button
						type="submit"
						class="btn-blue btn-block">
						Register
					</button>
				</div>

				<div class="form-actions text-right">
					<router-link :to="{ name: 'SingInView' }">Login</router-link>
				</div>
			</VeeForm>
			<div class="text-center push-top">
				<button
					@click="registerWithGoogle"
					class="btn-red btn-xsmall">
					<i class="fa fa-google fa-btn"></i>
					Sign up with Google
				</button>
			</div>
		</div>
	</div>
</template>

<script>
	export default {
		data() {
			return {
				avatarPreview: null,
				form: {
					name: '',
					username: '',
					email: '',
					password: '',
					avatar: '',
				},
			}
		},
		methods: {
			async register() {
				await this.$store.dispatch('auth/registerUserWithEmailAndPassword', this.form)
				this.$router.push('/')
			},
			async registerWithGoogle() {
				await this.$store.dispatch('auth/signInWithGoogle')
				this.$router.push('/')
			},
			handleImageUpload(e) {
				this.form.avatar = e.target.files[0]
				const reader = new FileReader()
				reader.onload = (event) => {
					this.avatarPreview = event.target.result
				}
				reader.readAsDataURL(this.form.avatar)
			},
		},
		created() {
			this.$emit('ready')
		},
	}
</script>
