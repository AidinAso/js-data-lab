import { loadSales } from "../src/dataLoader.js";

async function checkFile(filePath) {
    try {
        const sales = await loadSales(filePath);

        console.log("Success:", sales.length, "records loaded");
    } catch (error) {
        console.log("Error:", error.message);
    }
}

await checkFile("data/sales.csv");

await checkFile("data/missing.csv");