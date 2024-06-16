DO $$ BEGIN
 CREATE TYPE "public"."expenses_categories" AS ENUM('housing', 'transport', 'groceries', 'food', 'personal-care', 'entertainment', 'others');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DROP INDEX IF EXISTS "user_id_idx";--> statement-breakpoint
DROP INDEX IF EXISTS "email_idx";--> statement-breakpoint
ALTER TABLE "expenses" ADD COLUMN "category" "expenses_categories" DEFAULT 'others' NOT NULL;--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "user_id_idx" ON "user_details" USING btree (user_id);--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "email_idx" ON "users" USING btree (email);