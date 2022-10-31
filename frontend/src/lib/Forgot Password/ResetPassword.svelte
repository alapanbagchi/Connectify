<script lang="ts">
	import Input from '$lib/Input/Input.svelte';
	import API from '../../utils/API';
	import { createForm } from 'svelte-forms-lib';
	import * as yup from 'yup';
	import { alert } from '$lib/Notifications/notifications';
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import Spinner from '$lib/Spinner/Spinner.svelte';
    let linkSent = false;
    
	let isSubmitting = false;
	const { form, handleChange, errors, touched, handleSubmit } = createForm({
		initialValues: {
			password: '',
            confirmPassword: ''
		},
		validationSchema: yup.object().shape({
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
		}),

		onSubmit: async (values) => {
			try {
				isSubmitting = true
				const forgotPassword = await API.post('/user/reset_password', {
                    password: values.password,
                    confirmPassword: values.confirmPassword,
                    id: $page.params.id
                });
				if (forgotPassword) {
					$alert.title = 'Password reset successfully';
					$alert.description = 'Your password has been reset successfully';
					$alert.type = 'SUCCESS';
					linkSent = true;
				}
                goto('../../login');
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
	$: console.log($touched);
</script>

<form on:submit={handleSubmit} class="wrapper">
	<Input
		name="password"
		value={$form.password}
		error={$errors.password}
		label="Password"
		onChange={handleChange}
		placeholder="Enter your password"
		type="password"
	/>

    <Input
		name="confirmPassword"
		value={$form.confirmPassword}
		error={$errors.confirmPassword}
		label="Confirm Password"
		onChange={handleChange}
		placeholder="Confirm your password"
		type="password"
	/>
	<button type="submit" class="btn btn-primary" disabled={isSubmitting}> 
		{#if isSubmitting} 
			<img width="16px" src="/icons/loader.svg" alt="">
		{:else}
			Forgot Password
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
