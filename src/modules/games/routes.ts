import { Hono } from "hono";
import * as gamesService from "./service.ts";
import httpResponse from "../../utils/http-response.ts";
import { GameWithIDNotFound } from "./error.ts";
import { verifyJWT } from "../../middlewares.ts";

const route = new Hono();

route.get("/", async (c) => {
  try {
    const result = await gamesService.getAll();
    return httpResponse.ok(c, {
      data: result ?? [],
    });
  } catch (error) {
    console.error(error);
    return httpResponse.internalServerError(c, error);
  }
});

route.get("/:id", async (c) => {
  try {
    const id = c.req.param("id");

    if (!id) {
      return httpResponse.badRequest(c, "Missing ID");
    }

    const result = await gamesService.findById(id);

    return httpResponse.created(c, {
      data: result,
    });
  } catch (error) {
    if (error instanceof GameWithIDNotFound) {
      return httpResponse.badRequestWithError(c, error.message);
    }

    return httpResponse.internalServerError(c, error);
  }
});

route.post("/", verifyJWT, async (c) => {
  try {
    const body = await c.req.json();
    await gamesService.create(body);

    return httpResponse.created(c, {
      message: "Created",
    });
  } catch (error) {
    console.log(error);
    return httpResponse.internalServerError(c, error);
  }
});

route.put("/:id", verifyJWT, async (c) => {
  try {
    const id = c.req.param("id");
    const body = await c.req.json();
    await gamesService.update(id, body);

    return httpResponse.ok(c, {
      message: "Updated",
    });
  } catch (error) {
    if (error instanceof GameWithIDNotFound) {
      return httpResponse.badRequestWithError(c, error.message);
    }

    return httpResponse.internalServerError(c, error);
  }
});

route.delete("/:id", verifyJWT, async (c) => {
  try {
    const id = c.req.param("id");

    if (!id) {
      return httpResponse.badRequest(c, "Missing ID");
    }

    await gamesService.remove(id);

    return httpResponse.ok(c, {
      deleted: true,
    });
  } catch (error) {
    if (error instanceof GameWithIDNotFound) {
      return httpResponse.badRequestWithError(c, error.message);
    }

    return httpResponse.internalServerError(c, error);
  }
});

export default route;
