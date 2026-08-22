CREATE TABLE `enquiries` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`company` text DEFAULT '' NOT NULL,
	`phone` text NOT NULL,
	`email` text NOT NULL,
	`machine` text DEFAULT '' NOT NULL,
	`requirement` text NOT NULL,
	`created_at` text NOT NULL,
	`read` integer DEFAULT false NOT NULL,
	`resolved` integer DEFAULT false NOT NULL
);
--> statement-breakpoint
CREATE TABLE `machines` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`caption` text NOT NULL,
	`description` text NOT NULL,
	`available` integer DEFAULT true NOT NULL,
	`image` text NOT NULL,
	`gallery_json` text DEFAULT '[]' NOT NULL,
	`specs_json` text DEFAULT '[]' NOT NULL,
	`sort_order` integer NOT NULL,
	`updated_at` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `site_settings` (
	`id` integer PRIMARY KEY NOT NULL,
	`business_name` text NOT NULL,
	`address` text NOT NULL,
	`phone` text NOT NULL,
	`email` text NOT NULL,
	`whatsapp` text NOT NULL,
	`gst` text NOT NULL,
	`marquee_enabled` integer DEFAULT true NOT NULL,
	`marquee_speed` text DEFAULT 'normal' NOT NULL,
	`proof_points_json` text DEFAULT '[]' NOT NULL,
	`updated_at` text NOT NULL
);
