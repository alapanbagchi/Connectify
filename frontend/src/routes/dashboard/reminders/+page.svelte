<script lang="ts">
	import { alert } from '$lib/Notifications/notifications';
	import Spinner from '$lib/Spinner/Spinner.svelte';
	import EditTodo from '$lib/TodoList/EditTodo.svelte';
	import { currentTodo, showEditTodo, todoStore } from '$lib/TodoList/todo.store';
	import TodoInput from '$lib/TodoList/TodoInput.svelte';
	import { onMount } from 'svelte';
	import API from '../../../utils/API';

	let isLoaded = false
	onMount(async () => {
		const result = await API.get('/todo/get', {});
		isLoaded = true
		$todoStore = result;
	});

	$: console.log($todoStore)


	const deleteTodo = async (date: string, id: number) => {
		try{
			$alert.title = 'Deleting To Do';
			$alert.type = 'INFO';
			$alert.description = 'Please wait while we delete your to do';
			const result = await API.delete('/todo/delete', { date, index: id } );
			console.log(id)
			$todoStore = result.data;
			$alert.title = 'To Do Deleted';
			$alert.type = 'SUCCESS';
			$alert.description = 'Your to do has been deleted';
		}catch(err){
			$alert.title = 'Error Deleting To Do';
			$alert.type = 'ERROR';
			$alert.description = 'Something unexpected happened while deleting your to do. Please try again later';
		}
	}

	const editTodo = async (todo: any, index: number) => {
		$currentTodo = {
			date: todo.date,
			todo: todo.task[index],
			index
		}
		$showEditTodo = true;
	}
</script>

<div class="wrapper">
	<div class="header">
		<h1>Reminders</h1>
	</div>
	<!-- <div class="controls">
		<TodoInput />
	</div> -->
	{#if isLoaded}
	<table>
		<thead>
			<tr>
				<th class="task">Task</th>
				<th class="date">Date</th>
				<th class="actions">Actions</th>
			</tr>
		</thead>
		<tbody>
			<TodoInput />
			{#if $todoStore}
				{#each $todoStore as item}
				<tr>
					{#each item.task as todo, index}
					<td data-label="Task" class="task">{todo}</td>
					<td data-label="Date" class="date">{new Date(item.date).toDateString()}</td>
					<td data-label="Actions" class="actions">
						<button on:click={() => editTodo(item, index)}>
							<span class="material-symbols-rounded icon">edit</span>
						</button>
						<button on:click={() => deleteTodo(item.date, index)}><span class="material-symbols-rounded icon delete">delete</span>
						</button>
					</td>
				{/each}
				</tr>
			{/each}
		{/if}
	</tbody>
</table>
{:else}
<div class="spinnerwrapper">
	<Spinner />
</div>
{/if}
{#if $showEditTodo}
<div class="edit">
	<EditTodo />
</div>
{/if}
</div>
<style>
	.header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-bottom: 28px;

	}
	.header h1{
		font-weight: 500;
		opacity: 0.9;
		font-size: 1.4rem;
	}
	.spinnerwrapper{
		display: flex;
		align-items: center;
		justify-content: center;
		height: 100%;
		min-height: calc(100vh - 300px);
		position: relative;
	}
	button {
		background-color: transparent;
		outline: none;
		border: none;
		color: white;
		border-radius: 7px;
		cursor: pointer;
	}
	.task{
		width: calc(100% - 30ch);
	}
	.date{
		width: 20ch;
	}
	.actions{
		width: 10ch;
		display: flex;
		gap: 20px;
		justify-content: space-between;
	}
	.action button span{
		font-size: 0.9rem;
	}
	table{
		width: 100%;
		height: calc(100vh - 200px);
		display: flex;
		flex-direction: column;
		overflow: auto;
		font-size: 0.9rem;
	}
	thead{
		width: 100%;
		display: flex;
		font-size: 0.9rem;
		border-radius: 7px;
		background-color: var(--border);
		border-top: 1px solid var(--border);
		border-bottom: 1px solid var(--border);
	}
	th{
		font-weight: 400;
	}
	tr{
		display: flex;
		align-items: center;
		width: 100%;
		padding: 10px 20px;
		text-align: left;
		border: 1px solid var(--border);
	}
	tbody tr{
		opacity: 0.8;
		transition: all 0.2s ease-in-out;
	}
	.btn_grp 
	tbody tr:hover{
		opacity: 1;
		transition: all 0.2s ease-in-out;
	}
	tr:nth-child(even){
		background-color: var(--surface);
	}
	.icon{
		font-size: 1.3rem;
	}
	.delete{
		color: var(--error);
	}
	.edit{
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100vh;
		background-color: rgba(0,0,0,0.5);
		display: flex;
		align-items: center;
		justify-content: center;
	}
	@media only screen and (max-width: 600px){
		.task{
			width: unset;
		}
		thead{
			display: none;
		}

		tr{
			flex-direction: column;
			position: relative;
			text-align: start;
			align-items: unset;
			gap: 20px;
		}
		.date{
			width: 100%;
		}
		.actions{
			width: 50%;
		}
		td{
			text-align: end;
			padding: 0 10px;
		}
		.actions{
			display: flex;
			width: 100%;
			gap: 10px;
			align-items: flex-end;	
		}
		td::before {
			position: absolute;
			content: attr(data-label);
			width: 50%;
			left: 0;
			font-size: 15px;
			font-weight: bold;
			text-align: left;
			padding-right: 40px;
  		}
	}
</style>
