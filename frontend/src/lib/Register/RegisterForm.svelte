<script lang="ts">
	import Input from '$lib/Input/Input.svelte';
	import { createForm } from 'svelte-forms-lib';
	import * as yup from 'yup';
	import DateInput from '$lib/Input/DateInput.svelte';
	import API from '../../utils/API';
	import { alert } from '$lib/Notifications/notifications';
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import Dropdown from '$lib/Input/Dropdown.svelte';
	import { timezones } from '../../utils/timezones';
	onMount(async () => {
		try {
			const loggedIn = await API.get('/user/me', {});
			if (loggedIn) {
                goto('/dashboard');
			}
		} catch (err: any) {
			console.log(err);
		}
	});
	let isSubmitting = false
	const { form, handleChange, errors, touched, handleSubmit } = createForm({
		initialValues: {
			fullName: '',
			email: '',
			dob: '',
			timezone:Intl.DateTimeFormat().resolvedOptions().timeZone,
			password: '',
			confirmPassword: ''
		},
		onSubmit: async (values) => {
			try {
				isSubmitting = true
				const canRegister = await API.post('/user/canRegister', values);
				if (canRegister) {
					const response = await API.post('/user/register', values);
					isSubmitting = false
					if (response) {
						$alert.title = 'Registration Successful';
						$alert.description = 'You have been successfully registered. Please login to continue.';
						$alert.type = 'SUCCESS';
						setTimeout(() => {
							window.location.href = '/login';
						}, 3000);
					}
				}
				isSubmitting = false
			} catch (err: any) {
				if (!err.response.data) {
					$alert.title = 'Login Failed';
					$alert.description = 'Oops! Something went wrong. Please try again in a while';
					$alert.type = 'ERROR';
				}
				if (err.response.data.msg == 'USER_EXISTS') {
					$alert.title = 'Registration Failed';
					$alert.description = 'This email is already registered with us. Try logging in instead';
					$alert.type = 'ERROR';
				} else {
					$alert.title = 'Registration Failed';
					$alert.description = 'Something went wrong. Please try again later';
					$alert.type = 'ERROR';
				}
				isSubmitting = false
			}
		},
		validationSchema: yup.object().shape({
			fullName: yup.string().required('Name is required'),
			email: yup.string().email('Email is invalid').required('Email is required'),
			dob: yup
				.string()
				.required('Date is required')
				.matches(/^\d{4}-\d{2}-\d{2}$/, 'Date is invalid'),
			timezone: yup.string().required('Timezone is required').oneOf(timezones),
			password: yup
				.string()
				.required('Password is required')
				.min(10, 'Password must be at least 10 characters')
				.max(50, 'Password must be at most 50 characters')
				.matches(/(?=.*[A-Z])/, 'Password must contain one uppercase letter')
				.matches(/(?=.*[a-z])/, 'Password must contain one lowercase letter')
				.matches(/(?=.*[0-9])/, 'Password must contain one number')
				.matches(/(?=.*[!@#$%_^&*])/, 'Password must contain one special character'),
			confirmPassword: yup
				.string()
				.required('Confirm password is required')
				.oneOf([yup.ref('password'), null], 'Passwords must match'),
		})
	});
</script>

<div class="wrapper">
	<form on:submit={handleSubmit}>
		<Input
			name="fullName"
			value={$form.fullName}
			label="Full Name"
			placeholder="Enter the full name of the person"
			onChange={handleChange}
			error={$errors.fullName}
		/>
		<Input
			name="email"
			value={$form.email}
			label="Email"
			placeholder="johndoe@gmail.com"
			onChange={handleChange}
			error={$errors.email}
		/>
		<DateInput
			name="dob"
			label="Date of Birth"
			placeholder="Enter the date of birth"
			onChange={handleChange}
			value={$form.dob}
			error={$errors.dob}
		/>
		<Dropdown label="Timezone" options={timezones} name="timezone" value={$form.timezone} onChange={handleChange} />
		<Input
			name="password"
			value={$form.password}
			label="Password"
			placeholder="Enter your password"
			type="password"
			onChange={handleChange}
			error={$errors.password}
		/>
		<Input
			name="confirmPassword"
			label="Confirm Password"
			value={$form.confirmPassword}
			placeholder="Confirm Password"
			onChange={handleChange}
			type="password"
			error={$errors.confirmPassword}
		/>
		<button type="submit" class="btn btn-primary" disabled={isSubmitting}> 
			{#if isSubmitting} 
				<img width="16px" src="/icons/loader.svg" alt="">
			{:else}
				Register
			{/if}
		</button>
	</form>
</div>

<style>
	.wrapper {
		display: flex;
		flex-direction: column;
		width: 100%;
	}
	button {
		color: #ffffff;
		font-size: 14px;
		padding: 12px 25px;
		width: 100%;
		display: flex;
		border: 2px solid var(--primary);
		background-color: var(--primary);
		justify-content: center;
		align-items: center;
		border-radius: 7px;
		cursor: pointer;
		transition: all 0.3s ease-in-out;
		font-weight: 500;
	}
	form{
		display: flex;
		flex-direction: column;
		width: 100%;
		gap: 15px;
	}
	button:hover {
		background-color: transparent !important;
		color: black;
		transition: all 0.3s ease-in-out;
	}
	button:active {
		transform: scale(0.95);
		transition: all 0.3s ease-in-out;
	}
	button:disabled {
		background-color: #e0e0e0;
		color: #9e9e9e;
		cursor: not-allowed;
	}
</style>
