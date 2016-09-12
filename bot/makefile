export SHELL := /bin/bash
export PATH  := $(CURDIR)/node_modules/.bin:$(PATH)

MONGO_URL   = 'mongodb://localhost:27017/alfred'
ALFRED_URL  = 'irc.mozilla.org'
ALFRED_NAME = 'alfred'

build:
	babel --presets es2015-loose --out-dir dist src

run: build
	MONGO_URL=$(MONGO_URL) \
	ALFRED_URL=$(ALFRED_URL) \
	ALFRED_NAME=$(ALFRED_NAME) \
	    node dist/index.js
