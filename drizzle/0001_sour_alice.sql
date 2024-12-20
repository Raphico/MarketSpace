ALTER TABLE "stores" ALTER COLUMN "category_id" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "stores" ALTER COLUMN "stripe_account_id" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "stores" ALTER COLUMN "is_active" SET DEFAULT false;