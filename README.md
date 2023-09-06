# Alfagames API

Alfagames API, with persist data on mongoDB

### Features

This API allows register an admin user, this user can do operations on `Consoles` and `Games`

For this moment we can:

- Register / Login
- Consoles CRUD
- Games CRUD

### Getting started

This project its developed using [deno](https://deno.land), [hono](https://hono.dev), and [mongoose](https://mongoosejs.com/)

- You need to [install deno](https://deno.land/manual@v1.36.4/getting_started/installation).
- Also need to install [Docker](https://docs.docker.com/engine/install/).

After that, you need to up the docker compose services using the following command:

```console
docker compose up -d
```

And run deno script with:

```console
deno tasks dev
```

You'll see the server running on `http://localhost:5000`

### Author

- [Github | David](https://github.com/Dave136)


### License

You can see it [here](./LICENSE)