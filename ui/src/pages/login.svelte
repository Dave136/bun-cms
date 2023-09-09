<script lang="ts">
  import AuthForm from "$lib/components/AuthForm.svelte";
  import AuthWrapper from "$lib/components/AuthWrapper.svelte";

  const title = "Iniciar sesión";
  const description =
    "Ingrese su correo electrónico a continuación para ingresar a su cuenta";
</script>

<AuthWrapper {title} {description}>
  <AuthForm />
</AuthWrapper>
