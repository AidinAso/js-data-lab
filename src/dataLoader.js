import { readFile } from "node:fs/promises";
import { parse } from "csv-parse/sync";

export async function loadSales(filePath) {
    let csvData;

    try {
        csvData = await readFile(filePath, "utf-8");
    } catch (error) {
        if (error.code === "ENOENT") {
            throw new Error(`CSV file not found: ${filePath}`);
        }

        throw new Error(`Cannot read CSV file: ${error.message}`);
    }

    if (csvData.trim() === "") {
        throw new Error("CSV file is empty.");
    }

    let sales;

    try {
        sales = parse(csvData, {
            columns: true,
            skip_empty_lines: true
        });
    } catch (error) {
        throw new Error(`Invalid CSV format: ${error.message}`);
    }

    if (sales.length === 0) {
        throw new Error("CSV file contains no sales records.");
    }

    for (const sale of sales) {
        const quantity = Number(sale.quantity);
        const unitPrice = Number(sale.unitPrice);

        if (
            sale.quantity?.trim() === "" ||
            sale.unitPrice?.trim() === "" ||
            !Number.isFinite(quantity) ||
            !Number.isFinite(unitPrice) ||
            quantity <= 0 ||
            unitPrice < 0
        ) {
            throw new Error(
                `Invalid quantity or unitPrice in sale ID: ${sale.id}`
            );
        }
    }

    return sales;
}