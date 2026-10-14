import { describe, it, expect } from "vitest";
import { loadSales } from "../src/dataLoader.js";

describe("Data Loader Tests", () => {

    it("1. should load a valid CSV file", async () => {
        const sales = await loadSales("data/sales.csv");

        expect(sales).toHaveLength(30);
    });

    it("2. should throw an error for a missing file", async () => {
        await expect(
            loadSales("data/missing.csv")
        ).rejects.toThrow("CSV file not found");
    });

    it("3. should reject an empty CSV file", async () => {
        const filePath = "tests/empty.csv";

        const { writeFile, unlink } = await import("node:fs/promises");

        await writeFile(filePath, "");

        try {
            await expect(
                loadSales(filePath)
            ).rejects.toThrow("CSV file is empty");
        } finally {
            await unlink(filePath);
        }
    });

    it("4. should reject invalid numeric values", async () => {
        const filePath = "tests/invalid.csv";

        const { writeFile, unlink } = await import("node:fs/promises");

        const csvData =
            "id,product,category,quantity,unitPrice,date\n" +
            "1,Laptop,Electronics,abc,500,2026-10-01";

        await writeFile(filePath, csvData);

        try {
            await expect(
                loadSales(filePath)
            ).rejects.toThrow("Invalid quantity or unitPrice");
        } finally {
            await unlink(filePath);
        }
    });

});
