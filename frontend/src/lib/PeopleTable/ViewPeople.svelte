<script lang="ts">
	import { currentPerson, people as people_store, showPeople, viewPeopleDetails } from './people.store';
</script>

<div class="wrapper">
	<div class="title">
        <p>Contact Information</p>
        <span on:click={()=>{$viewPeopleDetails = false}} on:keydown={()=>{}} class="material-symbols-rounded icons">
			close
		</span>
    </div>
	<div class="form">
		<div class="block">
			<div class="label">Name</div>
			<div class="input">{$currentPerson.fullName}</div>
		</div>
		<div class="block">
			<div class="label">Date of birth</div>
			<div class="input">{new Date($currentPerson.dob).toLocaleDateString()}</div>
		</div>
		<div class="block">
			<div class="label">When to contact</div>
			<div class="input">Every {$currentPerson.contact_frequency} weeks</div>
		</div>
		<div class="block">
			<div class="label">When to contact</div>
			<div class="input">Every {$currentPerson.contact_frequency} days</div>
		</div>
		<div class="block">
			<div class="label">Notes</div>
			<div class="input">{$currentPerson.notes}</div>
		</div>
	</div>
</div>

<style>
	.wrapper {
		width: fit-content;
		padding: 20px;
		background-color: var(--modal);
		width: 400px;
		border-radius: 7px;
		align-items: center;
	}
	.icons{
		cursor: pointer;
		font-size: 1.2rem;
	}
	.title {
		font-size: 1.1rem;
		font-weight: 500;
		margin-bottom: 30px;
		display: flex;
		justify-content: space-between;
		align-items: center;
	}
	.form {
		display: flex;
		flex-direction: column;
		gap: 20px;
	}
	
	.label {
		font-size: 0.9rem;
		font-weight: 500;
	}
	.input {
		font-size: 0.9rem;
		font-weight: 500;
		opacity: 0.7;
		margin-top: 8px;
	}
	@media only screen and (max-width: 600px) {
		.wrapper {
			width: 100%;
		}
	}
</style>
