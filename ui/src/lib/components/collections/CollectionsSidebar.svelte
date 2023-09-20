<script lang="ts">
  import { api } from "$lib/config/redaxios";
  import { activeCollection, collections } from "$lib/store/collections";
  import { cn } from "$lib/utils";
  import { onMount } from "svelte";
  import { link, replace, loc } from "svelte-spa-router";

  $: id = $loc.querystring?.replace("id=", "");

  onMount(() => {
    const collectionsGroup = [
      { name: "consoles", icon: "i-ph-monitor" },
      { name: "games", icon: "i-ph-game-controller" },
    ];

    const promises = collectionsGroup.map(({ name }) => api(`/${name}`));
    Promise.all(promises).then((response) => {
      let items: Record<string, string>[] = [];
      response.forEach((res) => {
        items.push(res.data.data);
      });
      $collections = collectionsGroup.map((group, index) => {
        return {
          name: group.name,
          icon: group.icon,
          data: items[index],
        };
      });
    });

    if (!$activeCollection?.name) {
      $activeCollection = $collections[0];
      replace("/collections?id=consoles");
      return;
    }
  });
</script>

{#if $collections.length}
  <aside>
    <div
      class="min-h-full bg-secondary/80 flex flex-col min-w-[14rem] pt-4 px-4 gap-4"
    >
      {#each $collections as collection (collection.name)}
        <a
          href="/collections?id={collection.name}"
          class={cn(
            "p-3 pr-8 flex items-center gap-2 transition ease hover:bg-secondary",
            id === collection.name && "bg-secondary"
          )}
          title={collection.name}
          use:link
        >
          <span class="{collection.icon} text-lg" />
          <span>{collection.name}</span>
        </a>
      {/each}
    </div>
  </aside>
{/if}
