<script lang="ts">
  import UserAuthForm from "$lib/components/AuthForm.svelte";
  import logoLight from "../assets/logo.png";
  import logoDark from "../assets/logo-dark.svg";
</script>

<div class="overflow-hidden container rounded-[0.5rem] bg-background mt-20">
  <div
    class="container relative hidden h-[800px] flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-1 lg:px-0"
  >
    <div class="lg:p-8">
      <div
        class="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]"
      >
        <div class="flex justify-center space-y-2 text-center">
          <img class="w-20 dark:hidden" src={logoDark} alt="" />
          <img class="w-20 hidden dark:block" src={logoLight} alt="" />
        </div>
        <div class="flex flex-col space-y-2 text-center">
          <h1 class="text-2xl font-semibold tracking-tight">Iniciar sesión</h1>
          <p class="text-sm text-muted-foreground">
            Ingrese su correo electrónico a continuación para ingresar a su
            cuenta
          </p>
        </div>
        <UserAuthForm />
      </div>
    </div>
  </div>
</div>
