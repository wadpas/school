import { Form, Field, ErrorMessage, defineRule, configure } from 'vee-validate'
import { required, email, min } from '@vee-validate/rules'
import { localize } from '@vee-validate/i18n'
import firebase from 'firebase'

export default (app) => {
	defineRule('required', required)
	defineRule('email', email)
	defineRule('min', min)
	defineRule('unique', async (value, args) => {
		let collection, field
		if (Array.isArray(args)) {
			;[collection, field] = args
		} else {
			collection = args.collection
			field = args.field
		}
		const querySnapshot = await firebase.firestore().collection(collection).where(field, '==', value).get()
		return querySnapshot.empty
	})

	configure({
		generateMessage: localize('en', {
			messages: {
				required: '{field} field is required',
				email: '{field} must be a valid email',
				min: '{field} field must be at least 0:{min} characters',
				unique: '{field} is already taken',
			},
		}),
	})

	app.component('VeeForm', Form)
	app.component('VeeField', Field)
	app.component('VeeErrorMessage', ErrorMessage)
}
