<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import toast from "svelte-french-toast";
  import { createForm } from "felte";
  import * as yup from "yup";
  import { validator } from "@felte/validator-yup";
  import { Button } from "$lib/components/ui/button";
  import { Input } from "$lib/components/ui/input";
  import { Label } from "$lib/components/ui/label";
  import { cn } from "$lib/utils";
  import auth from "$lib/services/auth";
  import type { ApiError } from "$lib/types";
  import { fade } from "svelte/transition";

  const dispatch = createEventDispatcher();

  let className: string | undefined | null = undefined;
  export { className as class };

  let isLoading = false;
  let name = "";
  let lastname = "";
  let email = "";
  let password = "";
  let passwordConfirm = "";

  const PASSWORD_REGEX =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/gm;

  const schema = yup.object({
    name: yup.string().required("El campo es requerido"),
    lastname: yup.string().required("El campo es requerido"),
    email: yup.string().required().email("El campo es requerido"),
    password: yup
      .string()
      .required("El campo es requerido")
      .matches(
        PASSWORD_REGEX,
        "La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula y un número"
      ),
    passwordConfirm: yup
      .string()
      .required("El campo es requerido")
      .oneOf([yup.ref("password")], "Las contraseñas no coinciden"),
  });

  const { form, errors } = createForm({
    onSubmit,
    onError: (err) => {
      console.log("errors: ", err);
      toast.error("Ocurrió un error, intente de nuevo");
    },
    extend: [validator({ schema })],
  });

  async function onSubmit(values: any) {
    try {
      isLoading = true;
      const codes = await auth.registerAdmin(values);

      toast.success("Usuario admin registrado");

      dispatch("submit", { codes });
    } catch (err) {
      let error = err as ApiError;
      if (error.status === 401) {
        return toast.error("Credenciales incorrectas");
      }

      toast.error("Ocurrió un error, intente de nuevo");
    } finally {
      isLoading = false;
      password = "";
    }
  }
</script>

<div class={cn("grid gap-6", className)} {...$$restProps}>
  <form use:form transition:fade>
    <div class="grid gap-2">
      <div class="grid grid-cols-2 gap-4 mb-2">
        <div class="grid gap-1">
          <Label class="mb-2" for="nombre">Nombre</Label>
          <Input
            id="nombre"
            name="name"
            placeholder="john"
            class={cn({
              "ring-2 ring-offset-2 ring-red-500 focus:ring-red-500":
                $errors?.name?.length,
            })}
            type="text"
            autocapitalize="none"
            autocomplete="off"
            autocorrect="off"
            minlength={3}
            maxlength={30}
            pattern="([A-Za-z])\w+"
            required
            bind:value={name}
            disabled={isLoading}
          />
          <Label class="mt-1 text-xs text-red-500"
            >{$errors?.name?.length ? $errors.name[0] : ""}</Label
          >
        </div>
        <div class="grid gap-1">
          <Label class="mb-2" for="lastname">Apellido</Label>
          <Input
            id="lastname"
            name="lastname"
            placeholder="doe"
            class={cn({
              "ring-2 ring-offset-2 ring-red-500 focus:ring-red-500":
                $errors?.lastname?.length,
            })}
            type="text"
            autocapitalize="none"
            autocomplete="off"
            autocorrect="off"
            minlength={3}
            maxlength={30}
            bind:value={lastname}
            disabled={isLoading}
          />
          <Label class="mt-1 text-xs text-red-500"
            >{$errors?.lastname?.length ? $errors.lastname[0] : ""}</Label
          >
        </div>
      </div>
      <div class="grid gap-1 mb-2">
        <Label class="mb-2" for="email">Email</Label>
        <Input
          id="email"
          name="email"
          placeholder="name@example.com"
          class={cn({
            "ring-2 ring-offset-2 ring-red-500 focus:ring-red-500":
              $errors?.email?.length,
          })}
          type="email"
          autocapitalize="none"
          autocomplete="email"
          autocorrect="off"
          bind:value={email}
          disabled={isLoading}
        />
        <Label class="mt-1 text-xs text-red-500"
          >{$errors?.email?.length ? $errors.email[0] : ""}</Label
        >
      </div>
      <div class="grid gap-1 mb-2">
        <Label class="mb-2" for="password">Contraseña</Label>
        <Input
          id="password"
          name="password"
          placeholder="**********"
          class={cn({
            "ring-2 ring-offset-2 ring-red-500 focus:ring-red-500":
              $errors?.password?.length,
          })}
          type="password"
          autocapitalize="none"
          autocomplete="off"
          autocorrect="off"
          minlength={8}
          disabled={isLoading}
          bind:value={password}
        />
        <Label class="mt-1 text-xs text-red-500"
          >{$errors?.password?.length ? $errors.password[0] : ""}</Label
        >
      </div>
      <div class="grid gap-1 mb-2">
        <Label class="mb-2" for="passwordConfirm">Confirmar contraseña</Label>
        <Input
          id="passwordConfirm"
          name="passwordConfirm"
          class={cn({
            "ring-2 ring-offset-2 ring-red-500 focus:ring-red-500":
              $errors?.passwordConfirm?.length,
          })}
          placeholder="**********"
          type="password"
          autocapitalize="none"
          autocomplete="off"
          autocorrect="off"
          minlength={8}
          disabled={isLoading}
          bind:value={passwordConfirm}
        />
        <Label class="mt-1 text-xs text-red-500"
          >{$errors?.passwordConfirm?.length
            ? $errors.passwordConfirm[0]
            : ""}</Label
        >
      </div>
      <Button disabled={isLoading}>
        {#if isLoading}
          <span class="i-ph-circle-notch-bold text-lg animate-spin mr-2" />
        {/if}
        Registrar e iniciar sesión
      </Button>
    </div>
  </form>
</div>
