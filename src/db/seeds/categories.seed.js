import { db } from "../index.js";
import { categories } from "../schema.js";

export async function seedCategories() {
    const data = [
        "Fashion and apparel",
        "Furniture",
        "Toys and hobbies",
        "Beauty and personal care",
        "Electronics",
        "Food",
        "Beverages",
        "Household essentials",
        "Media",
        "Tobacco products",
        "Consumer-to-consumer",
        "Business-to-business",
        "Consumer electronics",
        "Apparel and Accessories",
        "Auto and Parts",
        "Health and beauty",
        "Outdoor",
        "Pet products",
        "Sports and fitness",
        "Stationery",
        "Books",
        "Business-to-government (B2G)",
        "Cosmetics",
        "Shoes",
    ];

    await db.delete(categories);
    console.log(`📝 Inserting ${data.length} categories`);
    await db
        .insert(categories)
        .values(data.map((category) => ({ name: category })));
}
