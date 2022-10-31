<script lang="ts">
	import { page } from "$app/stores";


    $: pageName = $page.url.pathname.split('/')[1]
    $: links = [{name: 'Home', href: '/'}]
    $: if(pageName === 'register'){
        links = [{
            name: 'Login',
            href: '/login'
        }]
    } else if(pageName === 'login'){
        links = [{
            name: 'Register',
            href: '/register'
        }]
    } else {
        links = [{
            name: 'Login',
            href: '/login'
        }, {
            name: 'Register',
            href: '/register'
        }]
    }
</script>
<div class="wrapper">
    <div class="logo">
        <a href="/">
            Connectify
        </a>
    </div>
    <div class="menu">
        <ul>
            {#each links as link}
                <li>
                    <a href={link.href}>
                        {link.name}
                    </a>
                </li>
            {/each}
        </ul>
    </div>
</div>

<style>
    ul{
        list-style: none;
        display: flex;
        align-items: center;
        gap: 1rem;
    }
.wrapper {
    position: absolute;
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 1rem;
    height: 3rem;
    background-color: transparent;
    box-shadow: 0 0 0.5rem rgba(0, 0, 0, 0.1);
}

.logo {
    font-size: 1.2rem;
    font-weight: 600;
}


</style>