import { writable, type Writable } from "svelte/store";

export const people: any = writable([
])

export const showPeople: any = writable(false)
export const viewPeopleDetails: any = writable(false)
export const editPeopleDetails: any = writable(false)

export const currentPerson: any = writable(
    
)

export const peopleSearchTerm: Writable<string> = writable("")