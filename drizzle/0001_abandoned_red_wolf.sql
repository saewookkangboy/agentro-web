CREATE TABLE `audit_logs` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`action` varchar(120) NOT NULL,
	`entity` varchar(80) NOT NULL,
	`entityId` int,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `audit_logs_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `faqs` (
	`id` int AUTO_INCREMENT NOT NULL,
	`question` text NOT NULL,
	`answer` text NOT NULL,
	`isPublished` int NOT NULL DEFAULT 1,
	`sortOrder` int NOT NULL DEFAULT 0,
	CONSTRAINT `faqs_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `instructor_items` (
	`id` int AUTO_INCREMENT NOT NULL,
	`instructorId` int NOT NULL,
	`type` varchar(48) NOT NULL,
	`title` varchar(220) NOT NULL,
	`description` text NOT NULL,
	`sortOrder` int NOT NULL DEFAULT 0,
	CONSTRAINT `instructor_items_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `instructors` (
	`id` int AUTO_INCREMENT NOT NULL,
	`slug` varchar(160) NOT NULL,
	`name` varchar(160) NOT NULL,
	`role` varchar(160) NOT NULL,
	`intro` text NOT NULL,
	`bio` text NOT NULL,
	`photoUrl` text,
	`credentials` text NOT NULL,
	`tracks` text NOT NULL,
	`isPublished` int NOT NULL DEFAULT 1,
	`sortOrder` int NOT NULL DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `instructors_id` PRIMARY KEY(`id`),
	CONSTRAINT `instructors_slug_unique` UNIQUE(`slug`)
);
--> statement-breakpoint
CREATE TABLE `program_steps` (
	`id` int AUTO_INCREMENT NOT NULL,
	`programId` int NOT NULL,
	`stepNumber` int NOT NULL,
	`title` varchar(180) NOT NULL,
	`description` text NOT NULL,
	CONSTRAINT `program_steps_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `programs` (
	`id` int AUTO_INCREMENT NOT NULL,
	`slug` varchar(160) NOT NULL,
	`track` varchar(80) NOT NULL,
	`title` varchar(220) NOT NULL,
	`promise` text NOT NULL,
	`description` text NOT NULL,
	`price` varchar(80) NOT NULL,
	`schedule` varchar(160) NOT NULL,
	`deliveryMode` varchar(80) NOT NULL,
	`status` varchar(32) NOT NULL DEFAULT 'open',
	`outcomes` text NOT NULL,
	`isPublished` int NOT NULL DEFAULT 1,
	`sortOrder` int NOT NULL DEFAULT 0,
	CONSTRAINT `programs_id` PRIMARY KEY(`id`),
	CONSTRAINT `programs_slug_unique` UNIQUE(`slug`)
);
--> statement-breakpoint
CREATE TABLE `site_settings` (
	`id` int AUTO_INCREMENT NOT NULL,
	`key` varchar(96) NOT NULL,
	`value` text NOT NULL,
	`updatedBy` int,
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `site_settings_id` PRIMARY KEY(`id`),
	CONSTRAINT `site_settings_key_unique` UNIQUE(`key`)
);
--> statement-breakpoint
CREATE TABLE `webinar_applicants` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(120) NOT NULL,
	`email` varchar(320) NOT NULL,
	`role` varchar(120),
	`status` varchar(40) NOT NULL DEFAULT 'new',
	`consent` int NOT NULL DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `webinar_applicants_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `webinar_settings` (
	`id` int AUTO_INCREMENT NOT NULL,
	`title` varchar(220) NOT NULL,
	`subtitle` text NOT NULL,
	`dateLabel` varchar(120) NOT NULL,
	`benefits` text NOT NULL,
	`applicantCount` int NOT NULL DEFAULT 0,
	`isOpen` int NOT NULL DEFAULT 1,
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `webinar_settings_id` PRIMARY KEY(`id`)
);
