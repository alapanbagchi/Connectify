<script lang="ts">
	import Input from '$lib/Input/Input.svelte';
	import API from '../../utils/API';
	import { createForm } from 'svelte-forms-lib';
	import * as yup from 'yup';
	import { alert } from '$lib/Notifications/notifications';
    let linkSent = false;
	let isSubmitting = false;
	const { form, handleChange, errors, touched, handleSubmit } = createForm({
		initialValues: {
			email: ''
		},
		validationSchema: yup.object().shape({
			email: yup
				.string()
				.required('Email is required')
				.email('Please provide a valid email address'),
		}),

		onSubmit: async (values) => {
			try {
				isSubmitting = true
				const forgotPassword = await API.post('/user/forgot_password', values);
				if (forgotPassword) {
					$alert.title = 'Password reset link sent';
					$alert.description = 'Please check your email for the link to reset your password.';
					$alert.type = 'SUCCESS';
				}
				linkSent = true;
			} catch (err: any) {
				if(!err.response.data) {
					$alert.title = 'Error Occoured';
					$alert.description = 'Oops! Something went wrong. Please try again in a while';
					$alert.type = 'ERROR';
				}
				switch (err.response.data.msg) {
					case 'USER_NOT_FOUND':
						$alert.title = 'User Not Found';
						$alert.description = 'The email you entered is not registered with us. Please try again with a different email.';
						$alert.type = 'ERROR';
						break;
					default:
						$alert.title = 'Error Occoured';
						$alert.description = 'Oops! Something went wrong. Please try again in a while';
						$alert.type = 'ERROR';
						break;
				}
				isSubmitting = false

			}
		}
	});
</script>

<form on:submit={handleSubmit} class="wrapper">
	<Input
		name="email"
		value={$form.email}
		error={$errors.email}
		label="Email Address"
		onChange={handleChange}
		placeholder="alapanbagchi.dev@gmail.com"
		type="email"
	/>
	<button type="submit" class="btn btn-primary" disabled={isSubmitting}> 
		{#if isSubmitting && !linkSent} 
			<img width="16px" src="/icons/loader.svg" alt="">
		{:else if !isSubmitting && !linkSent}
			Forgot Password
		{:else}
			Link Sent
		{/if}
	</button>
</form>

<style>
	form{
		position: relative;
	}

	.wrapper {
		display: flex;
		flex-direction: column;
		width: 100%;
		gap: 10px;
	}
	button {
		color: #ffffff;
		font-size: 14px;
		padding: 12px 25px;
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
