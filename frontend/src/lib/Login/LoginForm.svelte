<script lang="ts">
	import Input from '$lib/Input/Input.svelte';
	import API from '../../utils/API';
	import { createForm } from 'svelte-forms-lib';
	import * as yup from 'yup';
	import { alert } from '$lib/Notifications/notifications';
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	onMount(async () => {
		try {
			const loggedIn = await API.get('/user/me', {});
			if (loggedIn) {
				if(loggedIn.verified) {
					goto('/dashboard');
				} else {
					goto('/verify');
				}
			}
		} catch (err: any) {
			console.log(err);
		}
	});
	let isSubmitting = false;
	const { form, handleChange, errors, touched, handleSubmit } = createForm({
		initialValues: {
			email: '',
			password: ''
		},
		validationSchema: yup.object().shape({
			email: yup
				.string()
				.required('Email is required')
				.email('Please provide a valid email address'),
			password: yup.string().required('Password is required')
		}),

		onSubmit: async (values) => {
			try {
				isSubmitting = true
				const login = await API.post('/user/login', values);
				isSubmitting = false
				if (login) {
					$alert.title = 'Login Successful';
					$alert.description = 'You have been successfully logged in.';
					$alert.type = 'SUCCESS';
					isSubmitting = true
					setTimeout(() => {
						goto('/dashboard');
					}, 3000);
				}
			} catch (err: any) {
				isSubmitting = false
				if (!err.response.data) {
					$alert.title = 'Login Failed';
					$alert.description = 'Oops! Something went wrong. Please try again in a while';
					$alert.type = 'ERROR';
				}
				switch (err.response.data.msg) {
					case 'USER_DOES_NOT_EXIST': {
						$alert.title = 'User does not exist';
						$alert.description = 'Please check your email address and try again.';
						$alert.type = 'ERROR';
						break;
					}
					case 'USER_ALREADY_LOGGED_IN': {
						$alert.title = 'You are already logged in';
						$alert.description = 'Please log out of your current session and try again.';
						$alert.type = 'ERROR';
						break;
					}
					case 'INVALID_PASSWORD': {
						$alert.title = 'Invalid Credentials';
						$alert.description = 'Please check your email and password and try again.';
						$alert.type = 'ERROR';
						break;
					}
					default: {
						$alert.title = 'Login Failed';
						$alert.description = err.response.data.message;
						$alert.type = 'ERROR';
					}
				}
			}
		}
	});
	$: console.log($touched);
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
	<div class="seperator" />
	<Input
		name="password"
		value={$form.password}
		error={$errors.password}
		label="Password"
		onChange={handleChange}
		placeholder="10+ characters, 1 uppercase character, 1 lowercase character, 1 number and 1 special symbol"
		type="password"
	/>
	<a href="forgotpassword" class="forgotpassword">Forgot Password</a>
	<div class="seperator" />
	<button type="submit" class="btn btn-primary" disabled={isSubmitting}> 
		{#if isSubmitting} 
			<img width="16px" src="/icons/loader.svg" alt="">
		{:else}
			Login
		{/if}
	</button>
</form>

<style>
	form{
		position: relative;
	}
	.forgotpassword{
		position: absolute;
		right: 0;
		top: 110px;
		font-size: 14px;
		color: var(--primary);
		cursor: pointer;
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
