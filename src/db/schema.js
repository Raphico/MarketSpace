import { createId } from "@paralleldrive/cuid2";
import {
    boolean,
    decimal,
    integer,
    pgEnum,
    pgTable,
    real,
    text,
    timestamp,
    uniqueIndex,
    varchar,
} from "drizzle-orm/pg-core";

export const statusEnum = pgEnum("status", ["pending", "shipped", "delivered"]);
export const roleEnum = pgEnum("role", ["user", "admin"]);
export const strategyEnum = pgEnum("strategy", ["google", "email_password"]);

const timestamps = {
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").$onUpdate(() => new Date()),
};

export const users = pgTable(
    "users",
    {
        id: varchar("id", { length: 25 }).$default(createId).primaryKey(),
        username: varchar("username", { length: 50 }).notNull().unique(),
        firstName: varchar("first_name", { length: 50 }),
        lastName: varchar("last_name", { length: 50 }),
        email: varchar("email", { length: 255 }).notNull().unique(),
        isEmailVerified: boolean().notNull().default(false),
        password: varchar("password", { length: 255 }),
        image: text("image"),
        role: roleEnum("role").notNull().default("user"),
        stripeCustomerId: varchar("stripe_customer_id", {
            length: 255,
        }),
        strategy: strategyEnum("strategy").notNull().default("email_password"),
        emailVerificationToken: varchar("email_verification_token", {
            length: 64,
        }),
        passwordResetToken: varchar("password_reset_token", {
            length: 64,
        }),
        emailVerificationExpiry: timestamp("email_verification_expiry"),
        passwordResetExpiry: timestamp("password_reset_expiry"),
        ...timestamps,
    },
    (table) => [uniqueIndex("stripe_customer_idx").on(table.stripeCustomerId)]
);

export const stores = pgTable("stores", {
    id: varchar("id", { length: 25 }).$default(createId).primaryKey(),
    userId: varchar("user_id", { length: 25 })
        .notNull()
        .references(() => users.id),
    categoryId: varchar("category_id", { length: 25 })
        .notNull()
        .references(() => categories.id),
    stripeAccountId: varchar("stripe_account_id", {
        length: 255,
    }).notNull(),
    name: varchar("name", { length: 255 }).notNull(),
    description: text("description"),
    banner: text("banner"),
    logo: text("logo"),
    isActive: boolean("is_active").default(true),
    ...timestamps,
});

export const addresses = pgTable("addresses", {
    id: varchar("id", { length: 25 }).$default(createId).primaryKey(),
    address: varchar("address", { length: 255 }),
    city: varchar("city", { length: 100 }),
    state: varchar("state", { length: 100 }),
    country: varchar("country", { length: 50 }),
    zipCode: varchar("zip_code", { length: 10 }),
    ...timestamps,
});

export const cartItems = pgTable("cart_items", {
    id: varchar("id", { length: 25 }).$default(createId).primaryKey(),
    productId: varchar("product_id", { length: 25 })
        .notNull()
        .references(() => products.id),
    cartId: varchar("cart_id", { length: 25 })
        .notNull()
        .references(() => carts.id),
    quantity: integer("quantity").notNull(),
    ...timestamps,
});

export const carts = pgTable("carts", {
    id: varchar("id", { length: 25 }).$default(createId).primaryKey(),
    userId: varchar("user_id", { length: 25 })
        .notNull()
        .references(() => users.id),
    ...timestamps,
});

export const categories = pgTable("categories", {
    id: varchar("id", { length: 25 }).$default(createId).primaryKey(),
    name: varchar("name", { length: 255 }).unique(),
    ...timestamps,
});

export const orderItems = pgTable("order_items", {
    id: varchar("id", { length: 25 }).$default(createId).primaryKey(),
    orderId: varchar("order_id", { length: 25 })
        .notNull()
        .references(() => orders.id),
    productId: varchar("product_id", { length: 25 })
        .notNull()
        .references(() => products.id),
    price: decimal("price", { precision: 10, scale: 2 }).notNull(),
    quantity: integer("quantity").notNull(),
    ...timestamps,
});

export const orders = pgTable("orders", {
    id: varchar("id", { length: 25 }).$default(createId).primaryKey(),
    buyerId: varchar("buyer_id", { length: 25 })
        .notNull()
        .references(() => users.id),
    addressId: varchar("address_id", { length: 25 })
        .notNull()
        .references(() => addresses.id),
    amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
    stripePaymentIntentId: varchar("stripe_payment_intent_id", {
        length: 255,
    }).notNull(),
    stripePaymentIntentStatus: boolean(
        "stripe_payment_intent_status"
    ).notNull(),
    status: statusEnum("status").default("pending"),
    ...timestamps,
});

export const payments = pgTable("payments", {
    id: varchar("id", { length: 25 }).$default(createId).primaryKey(),
    orderId: varchar("order_id", { length: 25 })
        .notNull()
        .references(() => orders.id),
    stripeAccountId: varchar("stripe_account_id", {
        length: 255,
    }).notNull(),
    ...timestamps,
});

export const products = pgTable("products", {
    id: varchar("id", { length: 25 }).$default(createId).primaryKey(),
    storeId: varchar("store_id", { length: 25 })
        .notNull()
        .references(() => stores.id),
    categoryId: varchar("category_id", { length: 25 })
        .notNull()
        .references(() => categories.id),
    name: varchar("name", { length: 150 }).notNull(),
    description: text("description").notNull(),
    image: text("image").notNull(),
    price: decimal("price", { precision: 10, scale: 2 }).notNull(),
    originalPrice: decimal("original_price", {
        precision: 10,
        scale: 2,
    }),
    quantity: integer("quantity").notNull(),
    ...timestamps,
});

export const reviews = pgTable("reviews", {
    id: varchar("id", { length: 25 }).$default(createId).primaryKey(),
    userId: varchar("user_id", { length: 25 })
        .notNull()
        .references(() => users.id),
    productId: varchar("product_id", { length: 25 })
        .notNull()
        .references(() => products.id),
    review: text("review").notNull(),
    rating: real("rating").notNull().default(0),
    ...timestamps,
});

export const storeFees = pgTable("store_fees", {
    id: varchar("id", { length: 25 }).$default(createId).primaryKey(),
    storeId: varchar("store_id", { length: 25 })
        .notNull()
        .references(() => stores.id),
    paymentId: varchar("payment_id", { length: 25 })
        .notNull()
        .references(() => payments.id),
    stripePaymentIntentId: varchar("stripe_payment_intent_id", {
        length: 255,
    }).notNull(),
    stripePaymentIntentStatus: boolean(
        "stripe_payment_intent_status"
    ).notNull(),
    fee: decimal("fee", { precision: 10, scale: 2 }).notNull(),
    ...timestamps,
});
