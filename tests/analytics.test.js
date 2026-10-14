import { describe, it, expect } from "vitest";

import {
    calculateRevenue,
    calculateTotalRevenue,
    getTopSales,
    analyzeCategories,
    findBestProduct,
    analyzeDailySales,
    searchSales
} from "../src/analytics.js";

const sales = [
    {
        id: "1",
        product: "Laptop",
        category: "Electronics",
        quantity: "2",
        unitPrice: "500",
        date: "2026-10-01"
    },
    {
        id: "2",
        product: "Mouse",
        category: "Accessories",
        quantity: "5",
        unitPrice: "20",
        date: "2026-10-01"
    },
    {
        id: "3",
        product: "Laptop",
        category: "Electronics",
        quantity: "1",
        unitPrice: "500",
        date: "2026-10-03"
    },
    {
        id: "4",
        product: "Keyboard",
        category: "Accessories",
        quantity: "2",
        unitPrice: "50",
        date: "2026-10-03"
    }
];

describe("Sales Analytics Tests", () => {

    it("1. should calculate revenue correctly", () => {
        const result = calculateRevenue(sales[0]);

        expect(result).toBe(1000);
    });

    it("2. should calculate total revenue correctly", () => {
        const result = calculateTotalRevenue(sales);

        expect(result).toBe(1700);
    });

    it("3. should return zero revenue for empty sales", () => {
        const result = calculateTotalRevenue([]);

        expect(result).toBe(0);
    });

    it("4. should return top sales in descending order", () => {
        const result = getTopSales(sales, 2);

        expect(result).toHaveLength(2);
        expect(result[0].id).toBe("1");
        expect(result[1].id).toBe("3");
    });

    it("5. should not modify the original sales array", () => {
        const originalSales = [...sales];

        getTopSales(sales, 2);

        expect(sales).toEqual(originalSales);
    });

    it("6. should analyze categories correctly", () => {
        const result = analyzeCategories(sales);

        const electronics = result.find(
            (item) => item.category === "Electronics"
        );

        expect(electronics.salesCount).toBe(2);
        expect(electronics.totalQuantity).toBe(3);
        expect(electronics.totalRevenue).toBe(1500);
    });

    it("7. should find the best product by revenue", () => {
        const result = findBestProduct(sales);

        expect(result.product).toBe("Laptop");
        expect(result.totalRevenue).toBe(1500);
    });

    it("8. should analyze daily sales correctly", () => {
        const result = analyzeDailySales(sales);

        expect(result.bestDay.date).toBe("2026-10-01");
        expect(result.bestDay.totalRevenue).toBe(1100);

        expect(result.worstDay.date).toBe("2026-10-02");
        expect(result.worstDay.totalRevenue).toBe(0);

        expect(result.averageDailyRevenue).toBeCloseTo(1700 / 3);
    });

    it("9. should search products case-insensitively", () => {
        const result = searchSales(sales, "lApToP");

        expect(result).toHaveLength(2);
    });

    it("10. should return an empty array for unknown products", () => {
        const result = searchSales(sales, "Unknown");

        expect(result).toEqual([]);
    });

});