.DEFAULT_GOAL := help
SHELL := /usr/bin/env bash

.PHONY: setup
setup: ## Install dependencies
	npm install

.PHONY: dev
dev: ## Start the local dev server
	npm run dev

.PHONY: test
test: ## Run the test suite
	npm run test

.PHONY: check
check: ## typecheck + tests + build — the same pipeline CI runs as "Required quality"
	npm ci --no-audit --no-fund
	npx tsc --noEmit
	npm test
	NEXT_PUBLIC_SUPABASE_URL=http://localhost:54321 NEXT_PUBLIC_SUPABASE_ANON_KEY=placeholder NEXT_PUBLIC_SITE_URL=http://localhost:3000 npm run build

.PHONY: help
help: ## List available targets
	@grep -hE '^[a-zA-Z0-9_-]+:.*?## ' $(MAKEFILE_LIST) \
	  | awk 'BEGIN {FS = ":.*?## "}; {printf "  %-10s %s\n", $$1, $$2}'
