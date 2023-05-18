SRC := ./src
DIST := ./dist
ESBUILD := ./node_modules/.bin/esbuild
JEST := ./node_modules/.bin/jest
LINT := npx eslint .

all: test build

isikukood:
	$(ESBUILD) $(SRC)/isikukood.ts --global-name=ik --format=iife \
		--footer:js="window.Isikukood=Isikukood.default;" \
		--global-name=Isikukood \
		--outfile=$(DIST)/isikukood.js

isikukood.min.js:
	$(ESBUILD) $(DIST)/isikukood.js --minify --sourcemap \
		--banner:js='// isikukood.js, https://github.com/dknight/Isikukood-js' \
		--outfile=$(DIST)/isikukood.min.js

isikukood.esm.js:
	$(ESBUILD) $(SRC)/isikukood.ts --format=esm \
		--outfile=$(DIST)/isikukood.esm.js

isikukood.esm.min.js:
	$(ESBUILD) $(DIST)/isikukood.esm.js --minify --sourcemap \
		--banner:js='// isikukood.esm.js, https://github.com/dknight/Isikukood-js' \
		--outfile=$(DIST)/isikukood.esm.min.js

build: isikukood isikukood.min.js isikukood.esm.js isikukood.esm.min.js

lint:
	$(LINT)

test:
	$(LINT)
	$(JEST)

