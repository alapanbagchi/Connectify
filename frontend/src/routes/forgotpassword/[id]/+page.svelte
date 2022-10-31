<script lang="ts">
	import { goto } from "$app/navigation";
	import { page } from "$app/stores";
	import EnterEmailForgotPassword from "$lib/Forgot Password/EnterEmailForgotPassword.svelte";
	import ResetPassword from "$lib/Forgot Password/ResetPassword.svelte";
	import Header from "$lib/Header/Header.svelte";
	import LoginForm from "$lib/Login/LoginForm.svelte";
	import API from "../../../utils/API";
	import { onMount } from "svelte";
	import Spinner from "$lib/Spinner/Spinner.svelte";

	let loaded = false
	onMount(async () => {
		try {
			//Logout
			const canReset = await API.post('/user/can_reset_password', {
                otp: $page.params.id
            });
			loaded = true
		} catch (err: any) {
            goto('../');
		}
	});

</script>

{#if loaded}
<Header />
<section>
	<div class="image_wrapper">
		<img
			src="https://images.unsplash.com/photo-1546525012-4f79313b6de6?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2969&q=80 2969w"
			alt=""
		/>
	</div>
	<div class="form_wrapper">
		<div class="page_description">
			<p class="title">Forgot Password</p>
			<p class="description">Forgot your password? No worries, just enter your email and we will send you a link to reset your password</p>
		</div>
		<ResetPassword />
	</div>
</section>
{:else}
<Spinner />
{/if}
<style>
	section {
		display: flex;
	}

	.form_wrapper {
		width: 50%;
		height: 100vh;
		padding: 120px 100px;
		margin-left: auto;
		margin-right: auto;
	}

	.image_wrapper {
		width: 50%;
		height: 100vh;
		overflow: hidden;
	}
	.image_wrapper img {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}
	.title {
		font-size: 1.6em;
		font-weight: 600;
	}
	.description {
		margin: 20px 0;
		line-height: 30px;
		font-size: 0.9em;
		opacity: 0.7;
		font-weight: 500;
	}
	@media screen and (max-width: 900px) {
		.image_wrapper {
			display: none;
		}
		.form_wrapper {
			width: 100%;
			padding: 100px 20px;
			max-width: none;
			min-width: unset;
		}
	}
</style>
 