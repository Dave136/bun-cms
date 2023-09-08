<script lang="ts">
  import { replace } from "svelte-spa-router";
  import { authenticated } from "$lib/store";
  import { onMount } from "svelte";

  let createAdmin = false;

  function init() {
    createAdmin = false;

    // check if admin user exist
    // createAdmin = true;

    if ($authenticated) {
      replace("/collections");
    } else {
      localStorage.removeItem("ag-token");
      replace("/login");
    }
  }

  onMount(() => {
    init();
  });
</script>

<div class="bg-background min-h-screen">
  <!-- TODO: show form to create an admin -->
</div>
