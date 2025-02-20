import request from "supertest"
import server from "../../server"
import { response } from "express"

describe("POST /api/products", () => {

    it("Should display validation errors", async () => {

        const response = await request(server).post("/api/products").send({})

        // Se espera que
        expect(response.status).toBe(400)
        expect(response.body).toHaveProperty("errors")
        expect(response.body.errors).toHaveLength(4)

        // No se espera que
        expect(response.status).not.toBe(404)
        expect(response.body.errors).not.toHaveLength(2)
    })

    it("Should validate that the price is greater than 0", async () => {

        const response = await request(server).post("/api/products").send({
            name: "Monitor Curvo",
            price: 0
        })

        // Se espera que
        expect(response.status).toBe(400)
        expect(response.body).toHaveProperty("errors")
        expect(response.body.errors).toHaveLength(1)

        // No se espera que
        expect(response.status).not.toBe(404)
        expect(response.body.errors).not.toHaveLength(2)
    })

    it("Should validate that the price is a number and greater than 0", async () => {

        const response = await request(server).post("/api/products").send({
            name: "Monitor Curvo",
            price: "Hola"
        })

        // Se espera que
        expect(response.status).toBe(400)
        expect(response.body).toHaveProperty("errors")
        expect(response.body.errors).toHaveLength(2)

        // No se espera que
        expect(response.status).not.toBe(404)
        expect(response.body.errors).not.toHaveLength(4)
    })

    it("Should create a new product", async () => {
        const response = await request(server).post("/api/products").send({
            name: "Mouse - Testing",
            price: 140
        })

        // Se espera que
        expect(response.status).toBe(201)
        expect(response.body).toHaveProperty("data")

        // No se espera que
        expect(response.status).not.toBe(404)
        expect(response.status).not.toBe(200)
        expect(response.status).not.toHaveProperty("error")
    })

})

describe("GET /api/products", () => {
    it("Get a json response with products", async () => {
        const response = await request(server).get("/api/products")
        //se espera
        expect(response.status).toBe(200)
        expect(response.headers["content-type"]).toMatch(/json/)
        expect(response.body).toHaveProperty("data")
        expect(response.body.data).toHaveLength(1)


        //no se espera
        expect(response.body).not.toHaveProperty("errors")
        expect(response.status).not.toBe(404)
    })
})


describe('GET /api/products/:id', () => {

    it("should return a 404 response for a non-existent product", async () => {
        const productId = 20000
        const response = await request(server).get(`/api/products/${productId}`)


        expect(response.status).toBe(404)
        expect(response.body).toHaveProperty("error")
        expect(response.body.error).toBe("El producto no existe")
    })

    it("should check a valid id in the URL", async () => {
        const response = await request(server).get(`/api/products/not-valid-url`)

        expect(response.status).toBe(400)
        expect(response.body).toHaveProperty("errors")
        expect(response.body.errors).toHaveLength(1)
        expect(response.body.errors[0].msg).toBe("ID no valido")
    })

    it("GET a json response for a single product", async () => {
        const response = await request(server).get(`/api/products/1`)

        expect(response.status).toBe(200)
        expect(response.body).toHaveProperty("data")

    })

})


describe("PUT /api/products/:id", () => {

    it("should check a valid id in the URL", async () => {
        const response = await request(server).put(`/api/products/not-valid-url`).send({
            name: "Monitor - testing",
            price: 300,
            availability: true
        })

        expect(response.status).toBe(400)
        expect(response.body).toHaveProperty("errors")
        expect(response.body.errors).toHaveLength(1)
        expect(response.body.errors[0].msg).toBe("ID no valido")
    })

    it("should display validation error message when updating a product", async () => {
        const response = await request(server).put("/api/products/1").send({})

        expect(response.status).toBe(400)
        expect(response.body).toHaveProperty("errors")
        expect(response.body.errors).toBeTruthy()
        expect(response.body.errors).toHaveLength(5)

        expect(response.status).not.toBe(200)
        expect(response.body).not.toHaveProperty("data")
    })

    it("should validate that the price is greater than 0", async () => {
        const response = await request(server).put("/api/products/1").send({
            name: "MOnitor - testing",
            price: -300,
            availability: true
        })

        expect(response.status).toBe(400)
        expect(response.body).toHaveProperty("errors")
        expect(response.body.errors).toBeTruthy()
        expect(response.body.errors).toHaveLength(1)
        expect(response.body.errors[0].msg).toBe("Precio no valido")

        expect(response.status).not.toBe(200)
        expect(response.body).not.toHaveProperty("data")
    })

    it("should return a 404 response for a non-existent product", async () => {
        const productId = 2000
        const response = await request(server).put(`/api/products/${productId}`).send({
            name: "MOnitor - testing",
            price: 200,
            availability: true
        })

        expect(response.status).toBe(404)
        expect(response.body.error).toBe("El producto no existe")

        expect(response.status).not.toBe(200)
        expect(response.body).not.toHaveProperty("data")
    })

    it("should update an existing product with valid data", async () => {
        const response = await request(server).put(`/api/products/1`).send({
            name: "Monitor - testing",
            price: 200,
            availability: true
        })

        expect(response.status).toBe(200)
        expect(response.body).toHaveProperty("data")

        expect(response.status).not.toBe(400)
        expect(response.body).not.toHaveProperty("errors")
    })
})

describe("PATCH /api/products/:id", () => {
    it("should return a 404 response for a non-existing response", async () => {
        const productId = 2000
        const response = await request(server).patch(`/api/products/${productId}`)

        expect(response.status).toBe(404)
        expect(response.body.error).toBe("El producto no existe")


        expect(response.status).not.toBe(200)
        expect(response.body).not.toHaveProperty("data")
    })

    it("should update the product availability", async () => {
        const response = await request(server).patch("/api/products/1")

        expect(response.status).toBe(200)
        expect(response.body).toHaveProperty("data")
        expect(response.body.data.availability).toBe(false)

        expect(response.status).not.toBe(400)
        expect(response.status).not.toBe(404)
        expect(response.body).not.toHaveProperty("error")
    })
})

describe("DELETE /api/products/:id", () => {
    it("should check a valid ID", async () => {
        const response = await request(server).delete("/api/products/not-valid")

        expect(response.status).toBe(400)
        expect(response.body).toHaveProperty("errors")
        expect(response.body.errors[0].msg).toBe("ID no valido")
    })

    it("should return a 404 response for a non-existing product", async () => {
        const productId = 2000
        const response = await request(server).delete(`/api/products/${productId}`)

        expect(response.status).toBe(404)
        expect(response.body.error).toBe("El producto no existe")

        expect(response.status).not.toBe(200)
    })

    it("should delete a product", async () => {
        const response = await request(server).delete("/api/products/1")

        expect(response.status).toBe(200)
        expect(response.body.data).toBe("Producto Eleminado")

        expect(response.status).not.toBe(400)
        expect(response.status).not.toBe(404)
    })
})

