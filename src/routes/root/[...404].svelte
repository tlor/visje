<script context="module">
    export const load = ({ route }) => ({
        status: 404,
        error: '[Visje] Page could not be found.',
        props: { url: route.url },
    })
</script>

<script>
    export let url
</script>

<!-- routify:meta inline=false -->

<!-- This file was created by Routify.
     To customize the error page, create a catchall page 
     in the root of your project. Eg. [...404].svelte -->
<div class="four04">
    <h1>404 - Page Not Found</h1>
    <p>
        The page <code>{url}</code> could not be found. Please check the URL or go back to
        the <a href="/">homepage</a>.
    </p>
</div>

<style>
    div {
        display: flex;
        align-items: center;
        flex-direction: column;
        text-align: center;
    }
    div.four04 > * {
        margin-top: 1em;
    }

    ul {
        padding: 0;
    }
    ul li {
        opacity: 75%;
        list-style-type: none;
        padding: 0;
        margin: 0;
    }
</style>
