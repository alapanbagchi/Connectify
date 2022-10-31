<script>
	import Header from "$lib/Header/Header.svelte";
import LoginForm from "$lib/Login/LoginForm.svelte";


</script>
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
			<p class="title">Sign In</p>
			<p class="description">Hey! It's good to see you back. Provide your credentials below to log in!</p>
		</div>
		<LoginForm />
	</div>
</section>

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
