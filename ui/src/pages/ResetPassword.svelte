<script lang="ts">
  import toast from "svelte-french-toast";
  import { createForm } from "felte";
  import * as yup from "yup";
  import { validator } from "@felte/validator-yup";
  import { fade } from "svelte/transition";
  import { replace } from "svelte-spa-router";
  import { Button } from "$lib/components/ui/button";
  import { Input } from "$lib/components/ui/input";
  import { Label } from "$lib/components/ui/label";
  import { Checkbox } from "$lib/components/ui/checkbox";
  import { cn } from "$lib/utils";
  import FullPage from "$lib/components/base/FullPage.svelte";
  import { user } from "$lib/services";
  import type { ApiError } from "$lib/types";

  let className: string | undefined | null = undefined;
  export { className as class };

  let isLoading = false;
  let showPasswords = false;
  let newPassword = "";
  let newPasswordConfirm = "";

  const PASSWORD_REGEX =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/gm;

  type FormValues = {
    newPassword: string;
    newPasswordConfirm: string;
  };

  const schema = yup.object<FormValues>({
    newPassword: yup
      .string()
      .required("El campo es requerido")
      .matches(
        PASSWORD_REGEX,
        "La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula y un número"
      ),
    newPasswordConfirm: yup
      .string()
      .required("El campo es requerido")
      .oneOf([yup.ref("newPassword")], "Las contraseñas no coinciden"),
  });

  const { form, errors } = createForm<FormValues>({
    onSubmit,
    onError: (err) => {
      console.log("errors: ", err);
      toast.error("Ocurrió un error, intente de nuevo");
    },
    extend: [validator({ schema })],
  });

  async function onSubmit() {
    try {
      isLoading = true;
      const encodedEmail = localStorage.getItem("ag-user");

      if (!encodedEmail) {
        localStorage.removeItem("ag-user");
        return replace("/forgot-password");
      }

      const email = atob(encodedEmail);

      await user.resetPassword(email, newPassword);
      toast.success("Contraseña reestablecida");
      toast.custom("Inicie sesión");

      // This is not util anymore
      localStorage.removeItem("ag-user");
      replace("/");
    } catch (err) {
      let error = err as ApiError;

      if (error.status === 400) {
        replace("/forgot-password");
        toast.error("Debe reinicar el proceso de recuperación");
        return;
      }

      toast.error("Ocurrió un error, intente de nuevo");
    } finally {
      isLoading = false;
    }
  }
</script>

<FullPage>
  <div class={cn("grid gap-6", className)} {...$$restProps} in:fade>
    <form use:form transition:fade>
      <div class="grid gap-2">
        <div class="grid gap-1 mb-2">
          <Label class="mb-2" for="newPassword">Nueva contraseña</Label>
          <Input
            id="newPassword"
            placeholder="**********"
            name="newPassword"
            type={showPasswords ? "text" : "password"}
            class={cn({
              "ring-2 ring-offset-2 ring-red-500 focus:ring-red-500":
                $errors?.newPassword?.length,
            })}
            autocapitalize="none"
            autocomplete="off"
            autocorrect="off"
            disabled={isLoading}
            bind:value={newPassword}
          />
          <Label class="mt-1 text-xs text-red-500"
            >{$errors?.newPassword?.length ? $errors.newPassword[0] : ""}</Label
          >
        </div>
        <div class="grid gap-1 mb-2">
          <Label class="mb-2" for="newPasswordConfirm">
            Confirmar nueva contraseña
          </Label>
          <Input
            id="newPasswordConfirm"
            name="newPasswordConfirm"
            placeholder="**********"
            type={showPasswords ? "text" : "password"}
            class={cn({
              "ring-2 ring-offset-2 ring-red-500 focus:ring-red-500":
                $errors?.newPasswordConfirm?.length,
            })}
            autocapitalize="none"
            autocomplete="off"
            autocorrect="off"
            disabled={isLoading}
            bind:value={newPasswordConfirm}
          />
          <Label class="mt-1 text-xs text-red-500"
            >{$errors?.newPasswordConfirm?.length
              ? $errors.newPasswordConfirm[0]
              : ""}</Label
          >
        </div>
        <div class="flex items-center space-x-2 mb-2">
          <Checkbox
            id="showPasswords"
            bind:checked={showPasswords}
            aria-labelledby="show-passwords"
            disabled={isLoading}
          />
          <Label
            id="show-passwords"
            for="showPasswords"
            class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Mostrar contraseñas
          </Label>
        </div>
        <Button disabled={isLoading}>
          {#if isLoading}
            <span class="i-ph-circle-notch-bold text-lg animate-spin mr-2" />
          {/if}
          Reestablecer contraseña
        </Button>
      </div>
    </form>
  </div>
</FullPage>
