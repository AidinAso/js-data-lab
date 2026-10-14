import {
    calculateTotalRevenue,
    getTopSales,
    analyzeCategories,
    findBestProduct,
    analyzeDailySales
} from "./analytics.js";

import chalk from "chalk";
import Table from "cli-table3";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

export function generateReport(sales) {
    const dailyAnalysis = analyzeDailySales(sales);

    return {
        totalRecords: sales.length,
        totalRevenue: calculateTotalRevenue(sales),
        bestProduct: findBestProduct(sales),
        categorySummary: analyzeCategories(sales),
        dailySummary: dailyAnalysis.dailySummary,
        bestDay: dailyAnalysis.bestDay,
        worstDay: dailyAnalysis.worstDay,
        averageDailyRevenue: dailyAnalysis.averageDailyRevenue,
        topSales: getTopSales(sales, 5)
    };
}

export function displayReport(report) {
    console.log(chalk.blue.bold("\n========== SALES REPORT ==========\n"));
    console.log("Total Records:", report.totalRecords);
    console.log("Total Revenue:", report.totalRevenue);

    console.log("\nBest Product:");
    console.log("Product:", report.bestProduct?.product ?? "None");
    console.log("Quantity:", report.bestProduct?.totalQuantity ?? 0);
    console.log("Revenue:", report.bestProduct?.totalRevenue ?? 0);

    const categoryTable = new Table({
        head: ["Category", "Sales Count", "Quantity", "Revenue"]
    });

    for (const category of report.categorySummary) {
        categoryTable.push([
            category.category,
            category.salesCount,
            category.totalQuantity,
            category.totalRevenue
        ]);
    }

    console.log(chalk.yellow.bold("\n========== CATEGORY SUMMARY ==========\n"));
    console.log(categoryTable.toString());

    const dailyTable = new Table({
        head: ["Date", "Total Revenue"]
    });

    for (const day of report.dailySummary) {
        dailyTable.push([
            day.date,
            day.totalRevenue
        ]);
    }

    console.log(chalk.cyan.bold("\n========== DAILY SALES ==========\n"));
    console.log(dailyTable.toString());

    console.log("\nBest Sales Day:", report.bestDay?.date ?? "None");
    console.log("Best Day Revenue:", report.bestDay?.totalRevenue ?? 0);

    console.log("\nWorst Sales Day:", report.worstDay?.date ?? "None");
    console.log("Worst Day Revenue:", report.worstDay?.totalRevenue ?? 0);

    console.log("\nAverage Daily Revenue:", report.averageDailyRevenue);
}

export async function saveReport(report, filePath = "output/report.json") {
    const directory = path.dirname(filePath);

    await mkdir(directory, { recursive: true });

    const jsonData = JSON.stringify(report, null, 2);

    await writeFile(filePath, jsonData, "utf-8");

    console.log(chalk.green(`\nReport saved successfully to ${filePath}`));
}