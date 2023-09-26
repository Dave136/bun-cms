<script lang="ts">
  import {
    createTable,
    Subscribe,
    Render,
    createRender,
  } from "svelte-headless-table";
  import {
    addSortBy,
    addPagination,
    addTableFilter,
    addSelectedRows,
    addHiddenColumns,
  } from "svelte-headless-table/plugins";
  import * as Table from "$lib/components/ui/table";
  import Actions from "../ui/data-table/data-table-actions.svelte";
  import { Button } from "$lib/components/ui/button";
  import * as DropdownMenu from "$lib/components/ui/dropdown-menu";
  import { cn } from "$lib/utils";
  import { Input } from "$lib/components/ui/input";
  import DataTableCheckbox from "../ui/data-table/data-table-checkbox.svelte";
  import { createEventDispatcher, onMount } from "svelte";
  import toast from "svelte-french-toast";
  import { fade } from "svelte/transition";
  import { loadVideoConsoles, videoConsole } from "$lib/store/video-consoles";

  const dispatch = createEventDispatcher();

  let isLoading = false;

  const table = createTable(videoConsole, {
    sort: addSortBy({ disableMultiSort: true }),
    page: addPagination(),
    filter: addTableFilter({
      fn: ({ filterValue, value }) => value.includes(filterValue),
    }),
    select: addSelectedRows(),
    hide: addHiddenColumns(),
  });

  const columns = table.createColumns([
    table.column({
      header: (_, { pluginStates }) => {
        const { allPageRowsSelected } = pluginStates.select;
        return createRender(DataTableCheckbox, {
          checked: allPageRowsSelected,
        });
      },
      accessor: "_id",
      cell: ({ row }, { pluginStates }) => {
        const { getRowState } = pluginStates.select;
        const { isSelected } = getRowState(row);

        return createRender(DataTableCheckbox, {
          checked: isSelected,
        });
      },
      plugins: {
        sort: {
          disable: true,
        },
        filter: {
          exclude: true,
        },
      },
    }),
    table.column({
      header: "Nombre",
      accessor: "name",
      plugins: {
        filter: {
          getFilterValue(value) {
            return value.toLowerCase();
          },
        },
      },
    }),
    table.column({
      header: "Fecha de creación",
      accessor: "createdAt",
      cell: ({ value }) => value.toLowerCase(),
      // plugins: {
      //   filter: {
      //     getFilterValue(value) {
      //       return value.toLowerCase();
      //     },
      //   },
      // },
    }),
    table.column({
      header: "Fecha de actualización",
      accessor: "updatedAt",
      cell: ({ value }) => {
        // const formatted = new Intl.NumberFormat("en-US", {
        //   style: "currency",
        //   currency: "USD",
        // }).format(value);
        // return formatted;
        return value;
      },
      // plugins: {
      //   sort: {
      //     disable: true,
      //   },
      //   filter: {
      //     exclude: true,
      //   },
      // },
    }),
    table.column({
      header: "",
      accessor: ({ _id }) => _id,
      cell: (item) => {
        return createRender(Actions, { id: item.value })
          .on("update", () => {
            dispatch("update", {
              id: item.value,
            });
          })
          .on("delete", () => {
            dispatch("remove", {
              id: item.value,
            });
          });
      },
      plugins: {
        sort: {
          disable: true,
        },
      },
    }),
  ]);

  const {
    headerRows,
    pageRows,
    tableAttrs,
    tableBodyAttrs,
    flatColumns,
    pluginStates,
    rows,
  } = table.createViewModel(columns);

  const { sortKeys } = pluginStates.sort;

  const { hiddenColumnIds } = pluginStates.hide;
  const ids = flatColumns.map((c) => c.id);
  let hideForId = Object.fromEntries(ids.map((id) => [id, true]));

  $: $hiddenColumnIds = Object.entries(hideForId)
    .filter(([, hide]) => !hide)
    .map(([id]) => id);

  const { hasNextPage, hasPreviousPage, pageIndex } = pluginStates.page;
  const { filterValue } = pluginStates.filter;

  const { selectedDataIds } = pluginStates.select;

  const hideableCols = ["createdAt", "updatedAt"];

  onMount(async () => {
    try {
      isLoading = true;
      loadVideoConsoles();
    } catch (error) {
      toast.error("Hubo un error al cargar los datos");
    } finally {
      isLoading = false;
    }
  });
</script>

<div class="w-full">
  <div class="flex items-center py-4 justify-between">
    <Input
      class="max-w-sm"
      placeholder="Filtrar..."
      type="text"
      bind:value={$filterValue}
    />
    <div class="flex items-center gap-4">
      <Button variant="secondary" on:click={() => dispatch("add")}>
        <div class="i-ph-plus mr-2" />
        Agregar
      </Button>
      <DropdownMenu.Root>
        <DropdownMenu.Trigger asChild let:builder>
          <Button variant="outline" class="ml-auto" builders={[builder]}>
            Columns <div class="i-ph-caret-down ml-2 h-4 w-4" />
          </Button>
        </DropdownMenu.Trigger>
        <DropdownMenu.Content>
          {#each flatColumns as col}
            {#if hideableCols.includes(col.id)}
              <DropdownMenu.CheckboxItem bind:checked={hideForId[col.id]}>
                {col.header}
              </DropdownMenu.CheckboxItem>
            {/if}
          {/each}
        </DropdownMenu.Content>
      </DropdownMenu.Root>
    </div>
  </div>
  <div class="rounded-md border" in:fade>
    <Table.Root {...$tableAttrs}>
      <Table.Header>
        {#each $headerRows as headerRow}
          <Subscribe rowAttrs={headerRow.attrs()}>
            <Table.Row>
              {#each headerRow.cells as cell (cell.id)}
                <Subscribe
                  attrs={cell.attrs()}
                  let:attrs
                  props={cell.props()}
                  let:props
                >
                  <Table.Head
                    {...attrs}
                    class={cn("[&:has([role=checkbox])]:pl-3")}
                  >
                    {#if cell.id === "amount"}
                      <div class="text-right font-medium">
                        <Render of={cell.render()} />
                      </div>
                    {:else if cell.id === "email"}
                      <Button variant="ghost" on:click={props.sort.toggle}>
                        <Render of={cell.render()} />
                        <div
                          class={cn(
                            "i-ph-arrows-down-up ml-2 h-4 w-4",
                            $sortKeys[0]?.id === cell.id && "text-foreground"
                          )}
                        />
                      </Button>
                    {:else}
                      <Render of={cell.render()} />
                    {/if}
                  </Table.Head>
                </Subscribe>
              {/each}
            </Table.Row>
          </Subscribe>
        {/each}
      </Table.Header>
      <Table.Body {...$tableBodyAttrs}>
        {#if $pageRows.length}
          {#each $pageRows as row (row.id)}
            <Subscribe rowAttrs={row.attrs()} let:rowAttrs>
              <Table.Row
                {...rowAttrs}
                data-state={$selectedDataIds[row.id] && "selected"}
              >
                {#each row.cells as cell (cell.id)}
                  <Subscribe attrs={cell.attrs()} let:attrs>
                    <Table.Cell
                      class="[&:has([role=checkbox])]:pl-3"
                      {...attrs}
                    >
                      {#if cell.id === "amount"}
                        <div class="text-right font-medium">
                          <Render of={cell.render()} />
                        </div>
                      {:else if cell.id === "status"}
                        <div class="capitalize">
                          <Render of={cell.render()} />
                        </div>
                      {:else}
                        <Render of={cell.render()} />
                      {/if}
                    </Table.Cell>
                  </Subscribe>
                {/each}
              </Table.Row>
            </Subscribe>
          {/each}
        {:else}
          <Table.Row>
            <Table.Cell colspan={5}>
              <p class="text-center">No hay registros</p>
            </Table.Cell>
          </Table.Row>
        {/if}
      </Table.Body>
    </Table.Root>
  </div>
  <div class="flex items-center justify-end space-x-2 py-4">
    <div class="flex-1 text-sm text-muted-foreground">
      {Object.keys($selectedDataIds).length} de{" "}
      {$rows.length} fila(s) seleccionadas.
    </div>
    <Button
      variant="outline"
      size="sm"
      on:click={() => ($pageIndex = $pageIndex - 1)}
      disabled={!$hasPreviousPage}>Anterior</Button
    >
    <Button
      variant="outline"
      size="sm"
      disabled={!$hasNextPage}
      on:click={() => ($pageIndex = $pageIndex + 1)}>Siguiente</Button
    >
  </div>
</div>
