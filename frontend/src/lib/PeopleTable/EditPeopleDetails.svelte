<script lang="ts">
	import {
		currentPerson,
		editPeopleDetails,
		people as people_store,
		showPeople
	} from './people.store';

	


	import Input from '$lib/Input/Input.svelte';
	import { createForm } from 'svelte-forms-lib';
	import * as yup from 'yup';
	import DateInput from '$lib/Input/DateInput.svelte';
	import API from '../../utils/API';
	import { alert } from '$lib/Notifications/notifications';
	import { user } from '$lib/stores/user';
	import Button from '$lib/Input/Button.svelte';
	//Get date in yyyy-mm-dd format
	function formatDate(date: Date) {
		let month = '' + (date.getMonth() + 1),
			day = '' + date.getDate(),
			year = date.getFullYear();

		if (month.length < 2) month = '0' + month;
		if (day.length < 2) day = '0' + day;

		return [year, month, day].join('-');
	}
	let isSubmitting = false
	let showError = false
	const { form, handleChange, errors, touched, handleSubmit } = createForm({
		initialValues: {
			fullName: $currentPerson.fullName,
			dob: $currentPerson.dob === '' || $currentPerson.dob === null || $currentPerson.dob === undefined ? '' : formatDate(new Date($currentPerson.dob)),
			contact_frequency: $currentPerson.contact_frequency,
			notes: $currentPerson.notes
		},
		onSubmit: (values) => {
			showError = true
			if(!$form.dob && !$form.contact_frequency) return
			isSubmitting = true
			console.log(values)
			try {
				API.patch(`/contact/update/${$currentPerson._id}`, values).then((res: any) => {
					//Update the store with the new values using rest operator
					$people_store = $people_store.map((p: any) => {
						if (p._id === $currentPerson._id) {
							return { ...p, ...values };
						}
						return p;
					});
					$people_store.sort((a: any,b: any)=>{
						if(a.fullName.toUpperCase() < b.fullName.toUpperCase()) { return -1; }
						if(a.fullName.toUpperCase() > b.fullName.toUpperCase()) { return 1; }
						return 0;
					})
					$alert.title = 'Contact updated successfully';
					$alert.type = 'SUCCESS';
					$alert.description = 'Your contact has been updated in our databases and you will be notified about contacting them';
					$editPeopleDetails = false;
					isSubmitting = false
				})

			} catch (err) {
				$alert.title = 'Failed to create contact';
					$alert.type = 'ERROR';
					$alert.description = 'Your contact could not be updated for some unexpected reason. Please try again later.';
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
		<p>Edit Contacts</p>
		<span on:click={() => ($editPeopleDetails = false)} on:keydown={()=>{}} class="material-symbols-rounded icons">close</span>
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
			placeholder="After how many weeks should you contact this person?"
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
			Edit Contact
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
		font-size: 1.1rem;
		font-weight: 500;
		margin-bottom: 30px;
		display: flex;
		justify-content: space-between;
		align-items: center;
	}
	form {
		display: flex;
		flex-direction: column;
		gap: 20px;
	}
	.icons{
		font-size: 1.1rem;
		cursor: pointer;
	}
	@media only screen and (max-width: 600px) {
		.wrapper {
			width: 100%;
		}
	}
</style>
