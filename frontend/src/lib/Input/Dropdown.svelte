<script lang="ts">
    export let options: string[]
    export let name: string
    export let value: string
    export let onChange= (e: Event) => {}
    export let label: string
</script>

<label for="">{label}</label>
<select {name} {value} on:change={onChange}>
    {#each options as option}
        <option selected={option===Intl.DateTimeFormat().resolvedOptions().timeZone?true:false} value={option}>{option}</option>
    {/each}
</select>

<style>
    select {
        width: 100%;
        padding: 10px;
        background-color: #00000010;
        border-radius: 5px;
        margin-bottom: 10px;
        cursor: pointer;
    }

    label {
        font-size: 14px;
        font-weight: 600;
        margin-bottom: 5px;
    }

    select:focus {
        outline: none;
    }

    select:invalid {
        color: gray;
    }
    option{
        padding: 10px;
    }
</style>