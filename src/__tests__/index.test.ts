import request from "supertest";

import app from "../app";

describe("Test routes", () => {
    it("Get words should return empty array", async () => {
        const res = await request(app).get("/words");
        expect(res.body).toHaveLength(0);
    });

    it("Return status code 400 if word is empty", async () => {
        const res = await request(app).post("/add_synonyms").send({ text: "", synonym: "automobile" });
        expect(res.statusCode).toBe(400);
    });

    it("Return status code 400 if synonym is empty", async () => {
        const res = await request(app).post("/add_synonyms").send({ text: "car", synonym: "" });
        expect(res.statusCode).toBe(400);
    });

    it("Return status code 201 if word and synonym are passed", async () => {
        const res = await request(app).post("/add_synonyms").send({ text: "car", synonym: "automobile" });
        expect(res.statusCode).toBe(201);
    });

    it("After adding length should be 2", async () => {
        const res = await request(app).get("/words");
        expect(res.body).toHaveLength(2);
        expect(res.body).toEqual(["car", "automobile"]);
    });

    it("Get synonyms for word", async () => {
        const res = await request(app).get("/synonyms/car");
        expect(res.body.synonyms).toHaveLength(1);
        expect(res.body.synonyms).toEqual(["automobile"]);
    });

    it("Return status code 400 if word does not exist in array.", async () => {
        const res = await request(app).get("/synonyms/non_exist");
        expect(res.statusCode).toBe(404);
        expect(res.body.message).toBe("Not found");
    });

    it("Add a synonym for an existing word", async () => {
        const res = await request(app).post("/add_synonyms").send({ text: "car", synonym: "auto" });
        expect(res.statusCode).toBe(201);
    });

    it("Deleting a synonym that does not exist", async () => {
        const res = await request(app).delete("/synonyms/car/non_exist");
        expect(res.statusCode).toBe(404);
        expect(res.body.message).toBe("Not found");
    });

    it("Synonym deleted successfully", async () => {
        const res = await request(app).delete("/synonyms/car/auto");
        expect(res.statusCode).toBe(204);
    });

    it("Deleting a word that does not exist", async () => {
        const res = await request(app).delete("/words/non_exist");
        expect(res.statusCode).toBe(404);
    });

    it("Word deleted successfully", async () => {
        const res = await request(app).delete("/words/car");
        expect(res.statusCode).toBe(204);
    });
});
