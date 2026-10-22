CREATE TABLE `preview_requests` (
	`id` text PRIMARY KEY NOT NULL,
	`client` text NOT NULL,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
CREATE INDEX `preview_client_time` ON `preview_requests` (`client`,`created_at`);--> statement-breakpoint
CREATE INDEX `preview_time` ON `preview_requests` (`created_at`);