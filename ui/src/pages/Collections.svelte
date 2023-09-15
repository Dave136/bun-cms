<script lang="ts">
  import CollectionsSidebar from "$lib/components/collections/CollectionsSidebar.svelte";
  import MainPanel from "$lib/components/collections/MainPanel.svelte";
  import { activeCollection } from "$lib/store/collections";

  $: console.log($activeCollection);

  // $: pageTitle = $activeCollection.name || "Collections";
</script>

<CollectionsSidebar />
<MainPanel />
