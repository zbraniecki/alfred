export SHELL := /bin/bash
export PATH  := $(CURDIR)/node_modules/.bin:$(PATH)

export MONGO_URL   := mongodb://localhost:27017/alfred
export PORT        := 4001
export ALFRED_URL  := irc.mozilla.org
export ALFRED_NAME := alfred

SERVICES := api bot www
SUCCESS  := \033[32;01m✓\033[0m

build: $(SERVICES)

.PHONY: $(SERVICES)
$(SERVICES):
	@$(MAKE) -s -C $@
	@echo -e " $(SUCCESS) $@ built"

clean:
	@rm -rf dist/*
	@echo -e " $(SUCCESS) dist/ clean"

run-api:
	$(MAKE) -s -C api run

run-bot:
	$(MAKE) -s -C bot run

run-www:
	$(MAKE) -s -C www run
