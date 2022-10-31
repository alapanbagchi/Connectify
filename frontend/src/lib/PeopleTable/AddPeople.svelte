<script lang="ts">
	import { people as people_store, showPeople } from './people.store';
	import Input from '$lib/Input/Input.svelte';
	import { createForm } from 'svelte-forms-lib';
	import * as yup from 'yup';
	import DateInput from '$lib/Input/DateInput.svelte';
	import API from '../../utils/API';
	import { alert } from '$lib/Notifications/notifications';
	import { user } from '$lib/stores/user';
	import Button from '$lib/Input/Button.svelte';

	let isSubmitting = false
	let showError = false
	const { form, handleChange, errors, touched, handleSubmit } = createForm({
		initialValues: {
			fullName: '',
			dob: '',
			contact_frequency: '',
			notes: ''
		},
		onSubmit: (values) => {
			showError = true
			if(!$form.dob && !$form.contact_frequency) return
			isSubmitting = true
			try {
				API.post('/contact/add', values).then((res: any) => {
					$people_store = [...$people_store, res.data];
					$people_store.sort((a: any,b: any)=>{
						if(a.fullName.toUpperCase() < b.fullName.toUpperCase()) { return -1; }
						if(a.fullName.toUpperCase() > b.fullName.toUpperCase()) { return 1; }
						return 0;
					})
					$alert.title = 'Contact created successfully';
					$alert.type = 'SUCCESS';
					$alert.description = 'Your contact has been added to our databases and you will be notified about contacting them';
					$showPeople = false;
					isSubmitting = false

				})

			} catch (err) {
				$alert.title = 'Failed to create contact';
					$alert.type = 'ERROR';
					$alert.description = 'Your contact could not be created for some unexpected reason. Please try again later.';
				console.log(err);
				isSubmitting = false

			}
		},
		validationSchema: yup.object().shape({
			fullName: yup.string().required('Name is required'),
			dob: yup
				.string()	
				.test('is-valid-date', 'Date must be in the past', (value) => {
					if (value) {
						let date = new Date(new Date(value).setHours(0,0,0,0));
						const today = new Date(new Date().toLocaleString('en-US', {
							timeZone: $user.timezone
						}).split(',')[0])
						return date < today;
					}
					return true;
				})
				.test('is-valid-date', 'Date must be within the last 100 years', (value) => {
					if (value) {
						let date = new Date(new Date(value).setHours(0,0,0,0));
						const today = new Date(new Date().toLocaleString('en-US', {
							timeZone: $user.timezone
						}).split(',')[0])
						return date > new Date(today.setFullYear(today.getFullYear() - 100));
					}
					return true;
				})
				,
			contact_frequency: yup
				.string()
				.test('is-valid-number', 'Must be above 1', (value) => {
					//If thhe value is '' or undefined or null do nothing but if there is a value make sure that it is above 1 and make sure that it is a number
					if (value) {
						return parseInt(value) > 0;
					}
					return true;
				}),
			notes: yup.string()
		})

	})

</script>

<div class="wrapper">
	<div class="title">
		<p>Add Contacts</p>
		<span on:click={()=>$showPeople = false} on:keydown={()=>{}} class="material-symbols-rounded icons">close</span>
	</div>
	{#if !$form.dob && !$form.contact_frequency && showError }
		<p class="add_people_error">Either the date of birth or the contact frequency must be provided</p>
	{/if}
	<form on:submit={handleSubmit}>
		<Input
			name="fullName"
			value={$form.fullName}
			label="Full Name"
			placeholder="Enter the full name of the person"
			onChange={handleChange}
			error={$errors.fullName}
		/>
		<DateInput
			name="dob"
			label="Date of Birth"
			placeholder="Enter the date of birth"
			onChange={handleChange}
			value={$form.dob}
			error={$errors.dob}
		/>
		<Input
			name="contact_frequency"
			value={$form.contact_frequency}
			label="Contact Frequency(in days)"
			placeholder="After how many days should you contact this person?"
			onChange={handleChange}
			error={$errors.contact_frequency}
		/>
		<Input
			name="notes"
			label="Notes"
			value={$form.notes}
			placeholder="Add notes about this person"
			onChange={handleChange}
			error={$errors.notes}
		/>
		<Button disabled={isSubmitting}>
			Add Contact
		</Button>
	</form>
</div>

<style>
	.wrapper {
		width: fit-content;
		padding: 20px;
		background-color: var(--modal);
		width: 400px;
		border-radius: 7px;
	}
	.add_people_error{
		color: var(--error);
		font-size: 0.9rem;
		margin-bottom: 20px;
	}
	.title {
		font-size: 1rem;
		font-weight: 500;
		margin-bottom: 30px;
		display: flex;
		justify-content: space-between;
		align-items: center;
	}
	.icons{
		font-size: 1.1rem;
		cursor: pointer;
	}
	form {
		display: flex;
		flex-direction: column;
		gap: 20px;
	}
	@media only screen and (max-width: 600px) {
		.wrapper {
			width: 100%;
		}
	}
</style>
