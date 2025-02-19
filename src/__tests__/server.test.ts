describe("Nuestro primer test", () => {
    it("Debe revisar que 1 + 1 sean 2", () => {
        expect(1 + 1).toBe(2)
    })
    it("Debe sumar 1 + 1 y no dar 3", () => {
        expect(1 + 1).not.toBe(3)
    })
})