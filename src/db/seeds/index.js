import { seedAdmin } from "./admin.seed.js";
import { seedCategories } from "./categories.seed.js";

async function seed() {
    const start = Date.now();
    console.log("⏳ Running seed...");

    await seedAdmin();

    await seedCategories();

    const end = Date.now();
    console.log(`✅ Seed completed in ${end - start}ms`);
    process.exit(0);
}

seed().catch((error) => {
    console.error("❌ Seed failed");
    console.error(error);
    process.exit(1);
});
