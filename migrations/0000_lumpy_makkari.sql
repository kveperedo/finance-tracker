CREATE TABLE IF NOT EXISTS "expenses" (
	"id" serial PRIMARY KEY NOT NULL,
	"description" text,
	"amount" numeric(10, 2),
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp
);
