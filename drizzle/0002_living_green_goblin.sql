CREATE TYPE "public"."strategy" AS ENUM('google', 'email_password');--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "strategy" "strategy" DEFAULT 'email_password' NOT NULL;