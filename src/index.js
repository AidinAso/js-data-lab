import { Command } from "commander";

import { loadSales } from "./dataLoader.js";

import {
    getTopSales,
    searchSales,
    analyzeCategories
} from "./analytics.js";

import {
    generateReport,
    displayReport,
    saveReport
} from "./report.js";

import chalk from "chalk";

const program = new Command();

program
    .name("js-data-lab")
    .description("Sales Data Analysis CLI")
    .version("1.0.0");

program
    .command("report")
    .description("Generate and display the full sales report")
    .action(async () => {
        const sales = await loadSales("data/sales.csv");

        const report = generateReport(sales);

        displayReport(report);

        await saveReport(report);
    });

program
    .command("top")
    .description("Show top sales by revenue")
    .option("-l, --limit <number>", "Number of sales to display", "5")
    .action(async (options) => {
        const limit = Number(options.limit);

        if (!Number.isInteger(limit) || limit <= 0) {
            console.error(chalk.red("Error: Limit must be a positive integer."));
            process.exitCode = 1;
            return;
        }

        const sales = await loadSales("data/sales.csv");

        const topSales = getTopSales(sales, limit);

        console.log("\n========== TOP SALES ==========\n");

        console.table(topSales);
    });
program
    .command("search")
    .description("Search sales by product")
    .requiredOption("-p, --product <name>", "Product name")
    .action(async (options) => {
        const sales = await loadSales("data/sales.csv");

        const results = searchSales(sales, options.product);

        console.log("\n========== SEARCH RESULTS ==========\n");

        console.table(results);
    });

program
    .command("category <name>")
    .description("Show sales summary for a category")
    .action(async (name) => {
        const sales = await loadSales("data/sales.csv");

        const categories = analyzeCategories(sales);

        const result = categories.find(
            (category) =>
                category.category.toLowerCase() === name.toLowerCase()
        );

        console.log("\n========== CATEGORY SUMMARY ==========\n");

        if (result) {
            console.table([result]);
        } else {
            console.log("Category not found.");
        }
    });

try {
    await program.parseAsync(process.argv);
} catch (error) {
    console.error(chalk.red(`Error: ${error.message}`));
    process.exitCode = 1;
}