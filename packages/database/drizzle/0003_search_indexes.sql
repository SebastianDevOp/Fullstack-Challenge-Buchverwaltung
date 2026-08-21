-- Custom SQL migration file, put your code below! --
CREATE EXTENSION IF NOT EXISTS pg_trgm;--> statement-breakpoint
CREATE INDEX books_title_upper_trgm ON books USING gin (upper(title) gin_trgm_ops);--> statement-breakpoint
CREATE INDEX authors_name_upper_trgm ON authors USING gin (upper(name) gin_trgm_ops);--> statement-breakpoint
CREATE INDEX books_author_id_idx ON books (author_id);