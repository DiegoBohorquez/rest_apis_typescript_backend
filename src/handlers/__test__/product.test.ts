import request from "supertest";
import server from "../../server";
import { response } from "express";

describe("POST /api/products", () => {
  it("should display validation errors", async () => {
    const res = await request(server).post("/api/products").send({});
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("errors");
    expect(res.body.errors).toHaveLength(4);
  });

  it("should create a new product", async () => {
    const res = await request(server).post("/api/products").send({
      name: "Mouse - Testing",
      price: 50,
    });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("data");

    expect(res.status).not.toBe(404);
    expect(res.status).not.toBe(200);
    expect(res.status).not.toHaveProperty("error");
  });

  it("should validate that the price is greater than 0", async () => {
    const res = await request(server).post("/api/products").send({
      name: "Mouse - Testing",
      price: 0,
    });

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("errors");
    expect(res.body.errors).toHaveLength(1);
  });
});

describe("GET /api/products", () => {
  it("should check if api/products url exists", async () => {
    const res = await request(server).get("/api/products");
    expect(res.status).toBe(200);

    expect(res.status).not.toBe(404);
  });

  it("should send back a json response with status 200", async () => {
    const res = await request(server).get("/api/products");
    expect(res.status).toBe(200);
    expect(res.headers["content-type"]).toMatch(/json/);
    res.body.data.forEach((product) => {
      expect(product).toEqual(
        expect.objectContaining({
          id: expect.any(Number),
          name: expect.any(String),
          price: expect.any(String),
          availability: expect.any(Boolean),
          createdAt: expect.any(String),
          updatedAt: expect.any(String),
        }),
      );
    });

    expect(res.status).not.toBe(404);
  });
});

describe("GET /api/products/:id", () => {
  it("should return a 404 response for a non-existent product", async () => {
    const productID = 2000;
    const res = await request(server).get(`/api/products/${productID}`);
    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty("error");
    expect(res.body.error).toBe("Product not found");
  });

  it("should check a valid ID in the URL", async () => {
    const res = await request(server).get("/api/products/not-valid-url");
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("errors");
    expect(res.body.errors).toHaveLength(1);
    expect(res.body.errors[0].msg).toBe("El ID no es valido");
  });

  it("should get a JSON response for a single product", async () => {
    const res = await request(server).get("/api/products/1");
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("data");
  });
});

describe("PUT /api/products/:id", () => {
  it("should check a valid ID in the URL", async () => {
    const res = await request(server)
      .put("/api/products/not-valid-url")
      .send({ name: "Monitor Curvo", price: 200, avaliability: true });
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("errors");
    expect(res.body.errors).toHaveLength(1);
    expect(res.body.errors[0].msg).toBe("El ID no es valido");
  });

  it("should display validation error messages when updating a product", async () => {
    const res = await request(server).put("/api/products/1").send({});

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("errors");
    expect(res.body.errors).toBeTruthy();
    expect(res.body.errors).toHaveLength(4);

    expect(res.status).not.toBe(200);
    expect(res.body).not.toHaveProperty("data");
  });

  it("should validate that the price is greater than 0", async () => {
    const res = await request(server).put("/api/products/1").send({
      name: "Monitor Curvo",
      price: 0,
      avaliability: true,
    });

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("errors");
    expect(res.body.errors).toBeTruthy();
    expect(res.body.errors).toHaveLength(1);
    expect(res.body.errors[0].msg).toBe("El precio debe ser mayor a 0");

    expect(res.status).not.toBe(200);
    expect(res.body).not.toHaveProperty("data");
  });

  it("should return a 404 response for a non-existent product", async () => {
    const productId = 2000;
    const res = await request(server).put(`/api/products/${productId}`).send({
      name: "Monitor Curvo",
      price: 300,
      avaliability: true,
    });

    expect(res.status).toBe(404);
    expect(res.body.error).toBe("Product not found");

    expect(res.status).not.toBe(200);
    expect(res.body).not.toHaveProperty("data");
  });
});

describe("PATCH /api/products/:id", () => {
  it("should return a 404 response for a non-existing product", async () => {
    const productId = 2000;
    const res = await request(server).patch(`/api/products/${productId}`);
    expect(res.status).toBe(404);
    expect(res.body.error).toBe("Product not found");

    expect(res.status).not.toBe(200);
    expect(res.body.error).not.toHaveProperty("data");
  });

  it("should update the product avaliability", async () => {
    const res = await request(server).patch("/api/products/1");
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("data");
    expect(res.body.data.availability).toBe(false);

    expect(response.status).not.toBe(404);
    expect(response.status).not.toBe(400);
  });
});

describe("DELETE /api/products/:id", () => {
  it("should check a valid ID", async () => {
    const res = await request(server).delete("/api/products/not-valid-url");
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("errors");
    expect(res.body.errors[0].msg).toBe("El ID no es valido");
  });

  it("should returnt a 404 response for a non-existent product", async () => {
    const productId = 2000;
    const res = await request(server).delete(`/api/products/${productId}`);

    expect(res.status).toBe(404);
    expect(res.body.error).toBe("Product not found");
  });

  it("should delete a product", async () => {
    const res = await request(server).delete("/api/products/1");

    expect(res.status).toBe(200);
    expect(res.body.data).toBe("Producto eliminado");
  });
});
