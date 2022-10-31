<script>
	import Button from '$lib/Input/Button.svelte';
import AddPeople from '$lib/PeopleTable/AddPeople.svelte';
	import EditPeopleDetails from '$lib/PeopleTable/EditPeopleDetails.svelte';
	import { editPeopleDetails, showPeople, viewPeopleDetails } from '$lib/PeopleTable/people.store';
	import ViewPeople from '$lib/PeopleTable/ViewPeople.svelte';
	import ViewAndEditPeople from '$lib/PeopleTable/ViewPeople.svelte';
	import PeopleTable from '../../../lib/PeopleTable/PeopleTable.svelte';
</script>

<div class="header">
	<h1>Your Contacts</h1>
	<div class="actions">
		<Button onClick={()=>{$showPeople = true}} >
			Add New
		</Button>
	</div>
</div>
<PeopleTable />
{#if $showPeople}
	<div class="modal">
		<AddPeople />
	</div>
{/if}
{#if $viewPeopleDetails}
	<div class="modal">
		<ViewPeople />
	</div>
{/if}
{#if $editPeopleDetails}
	<div class="modal">
		<EditPeopleDetails />
	</div>
{/if}
<style>
	.header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-bottom: 20px;

	}
	.header h1{
		font-weight: 500;
		opacity: 0.9;
		font-size: 1.4rem;
	}
	
	.modal {
		width: 100vw;
		min-height: 100vh;
		position: absolute;
		background-color: #00000050;
		top: 0;
		left: 0;
		display: flex;
		justify-content: center;
		align-items: center;
	}
</style>
