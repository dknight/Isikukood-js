DEST := ./dest
ESBUILD := ./node_modules/.bin/esbuild
ESLINT := ./node_modules/.bin/eslint
JEST := ./node_modules/.bin/jest

all: build lint test

isikukood:
	$(ESBUILD) isikukood.js --global-name=ik --format=iife\
		--footer:js="window.Isikukood=ik.Isikukood;"\
		--outfile=$(DEST)/isikukood.js

isikukood.min.js:
	$(ESBUILD) $(DEST)/isikukood.js --minify --sourcemap\
		--banner:js='// isikukood.js, https://github.com/dknight/Isikukood-js'\
		--outfile=$(DEST)/isikukood.min.js

isikukood.mjs:
	$(ESBUILD) isikukood.js --format=esm\
		--outfile=$(DEST)/isikukood.mjs

isikukood.cjs.js:
	$(ESBUILD) isikukood.js --format=cjs\
		--outfile=$(DEST)/isikukood.cjs.js

build: isikukood isikukood.min.js isikukood.mjs isikukood.cjs.js

lint:
	$(ESLINT) isikukood.js

test:
	$(call lint)
	$(JEST)

