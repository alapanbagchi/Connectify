<script lang="ts">
	import { user } from "$lib/stores/user";


	export let name: string;

	$: date = new Date().toLocaleString('en-US',{timeZone: $user.timezone})
	setInterval(() => {
		date = new Date().toLocaleString('en-US',{timeZone: $user.timezone})
	}, 1000);
</script>

<div class="wrapper">
	<div class="pfp">
		<img src="https://avatars.githubusercontent.com/u/6632127?v=4" alt="Profile" />
	</div>
	<div class="text">
		<p class="name">{name}</p>
		<p class="designation">{new Date(date).toDateString()} {new Date(date).toLocaleTimeString()}</p>
	</div>
</div>

<style>
	.wrapper {
		display: flex;
		align-items: center;
		justify-content: center;
		height: 100%;
		gap: 12px;
		font-size: 0.9rem;
		cursor: pointer;
		padding: 5px 0px 5px 15px;
		border-radius: 7px;
		white-space: nowrap;
	}
	.text{
		width: 20ch;
	}
	.pfp {
		width: 35px;
		height: 35px;
		border-radius: 7px;
		overflow: hidden;
	}
	.pfp img {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}
	.name {
		font-size: 0.9rem;
		opacity: 0.9;
		font-weight: 400;
	}
	.designation {
		opacity: 0.5;
		font-size: 0.8rem;
		font-weight: 400;
		margin-top: 3px;
	}
	@media (max-width: 900px) {
		.text {
			display: none;
		}
	}
</style>
