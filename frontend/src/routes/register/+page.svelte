<script>
	import Header from "$lib/Header/Header.svelte";
import RegisterForm from "$lib/Register/RegisterForm.svelte";


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
			<p class="title">Create an <span class="primary_color">Account</span></p>
			<p class="description">
				Welcome to Eyeconit, your one stop destination for eye catcing icons that can be used in
				your code easily. Sign up by providing us your details below
			</p>
		</div>
		<RegisterForm />
	</div>
</section>

<style>
	section {
		display: flex;
	}

	.form_wrapper {
		width: 50%;
		height: 100vh;
		padding: 70px 100px;
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
	.primary_color {
		color: var(--primary);
	}
	.description {
		margin: 25px 0;
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
