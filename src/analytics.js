export function calculateRevenue(sale) {
    const quantity = Number(sale.quantity);
    const unitPrice = Number(sale.unitPrice);

    return quantity * unitPrice;
}

export function calculateTotalRevenue(sales) {
    let total = 0;

    for (const sale of sales) {
        total += calculateRevenue(sale);
    }

    return total;
}

export function getTopSales(sales, limit = 5) {
    const sortedSales = [...sales].sort((a, b) => {
        return calculateRevenue(b) - calculateRevenue(a);
    });

    return sortedSales.slice(0, limit);
}

export function analyzeCategories(sales) {
    const categories = new Map();

    for (const sale of sales) {
        const category = sale.category;

        if (!categories.has(category)) {
            categories.set(category, {
                category: category,
                salesCount: 0,
                totalQuantity: 0,
                totalRevenue: 0
            });
        }

        const categoryData = categories.get(category);

        categoryData.salesCount += 1;
        categoryData.totalQuantity += Number(sale.quantity);
        categoryData.totalRevenue += calculateRevenue(sale);
    }

    return Array.from(categories.values());
}

export function findBestProduct(sales) {
    const products = new Map();

    for (const sale of sales) {
        const product = sale.product;
        const revenue = calculateRevenue(sale);

        if (!products.has(product)) {
            products.set(product, {
                product: product,
                totalQuantity: 0,
                totalRevenue: 0
            });
        }

        const productData = products.get(product);

        productData.totalQuantity += Number(sale.quantity);
        productData.totalRevenue += revenue;
    }

    let bestProduct = null;

    for (const productData of products.values()) {
        if (bestProduct === null || productData.totalRevenue > bestProduct.totalRevenue) {
            bestProduct = productData;
        }
    }

    return bestProduct;
}

export function analyzeDailySales(sales) {
    if (sales.length === 0) {
        return {
            dailySummary: [],
            bestDay: null,
            worstDay: null,
            averageDailyRevenue: 0
        };
    }

    const dailySales = new Map();

    for (const sale of sales) {
        const date = sale.date;
        const revenue = calculateRevenue(sale);

        if (!dailySales.has(date)) {
            dailySales.set(date, 0);
        }

        dailySales.set(date, dailySales.get(date) + revenue);
    }

    const dates = [...dailySales.keys()].sort();

    const startDate = new Date(dates[0] + "T00:00:00Z");
    const endDate = new Date(dates[dates.length - 1] + "T00:00:00Z");

    const dailySummary = [];

    for (
        let current = new Date(startDate);
        current <= endDate;
        current.setUTCDate(current.getUTCDate() + 1)
    ) {
        const date = current.toISOString().slice(0, 10);

        dailySummary.push({
            date: date,
            totalRevenue: dailySales.get(date) ?? 0
        });
    }

    let bestDay = dailySummary[0];
    let worstDay = dailySummary[0];

    for (const day of dailySummary) {
        if (day.totalRevenue > bestDay.totalRevenue) {
            bestDay = day;
        }

        if (day.totalRevenue < worstDay.totalRevenue) {
            worstDay = day;
        }
    }

    const totalRevenue = calculateTotalRevenue(sales);

    const averageDailyRevenue = totalRevenue / dailySummary.length;

    return {
        dailySummary,
        bestDay,
        worstDay,
        averageDailyRevenue
    };
}

export function searchSales(sales, query= "") {
    const searchText = query.trim().toLowerCase();

    if (searchText === "") {
        return [];
    }

    return sales.filter(sale => {
        const product = sale.product.toLowerCase();
        const category = sale.category.toLowerCase();

        return (
            product.includes(searchText) 
            || category.includes(searchText)
        );
    });
}
