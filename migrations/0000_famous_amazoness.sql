CREATE TABLE "bible_verses" (
	"id" serial PRIMARY KEY NOT NULL,
	"book" text NOT NULL,
	"chapter" integer NOT NULL,
	"verse" integer NOT NULL,
	"content" text NOT NULL,
	"testament" text NOT NULL,
	"language" text DEFAULT 'english' NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "bookmarks" (
	"id" serial PRIMARY KEY NOT NULL,
	"content_type" text NOT NULL,
	"content_id" integer NOT NULL,
	"user_id" text DEFAULT 'default' NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "documents" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"content" text NOT NULL,
	"type" text NOT NULL,
	"author" text,
	"article_count" integer,
	"language" text DEFAULT 'english' NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "prayers" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"content" text NOT NULL,
	"category" text,
	"latin" text,
	"language" text DEFAULT 'english' NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "questions" (
	"id" serial PRIMARY KEY NOT NULL,
	"question" text NOT NULL,
	"answer" text NOT NULL,
	"full_answer" text,
	"category" text,
	"language" text DEFAULT 'english' NOT NULL,
	"created_at" timestamp DEFAULT now()
);
