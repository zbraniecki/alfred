export SHELL := /bin/bash
export PATH  := $(CURDIR)/node_modules/.bin:$(PATH)

MONGO_URL = 'mongodb://localhost:27017/alfred'
PORT ?= 4002

build:
	babel --presets es2015-loose --out-dir dist src

run: build
	MONGO_URL=$(MONGO_URL) PORT=$(PORT) node dist/index.js
