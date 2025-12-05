SRC := ./src
FILE='isikukood.ts'
DIST := ./dist
DOCS := ./docs
ESBUILD := npx esbuild
JEST := npx jest

all: test build

isikukood:
	$(ESBUILD) $(SRC)/$(FILE) --global-name=ik --format=iife \
		--footer:js="window.Isikukood=Isikukood.default;" \
		--global-name=Isikukood \
		--outfile=$(DIST)/isikukood.js

isikukood.min.js:
	$(ESBUILD) $(DIST)/isikukood.js --minify --sourcemap \
		--banner:js='// isikukood.js, https://github.com/dknight/Isikukood-js' \
		--outfile=$(DIST)/isikukood.min.js

isikukood.esm.js:
	$(ESBUILD) $(SRC)/$(FILE) --format=esm \
		--outfile=$(DIST)/isikukood.esm.js

isikukood.esm.min.js:
	$(ESBUILD) $(DIST)/isikukood.esm.js --minify --sourcemap \
		--banner:js='// isikukood.esm.js, https://github.com/dknight/Isikukood-js' \
		--outfile=$(DIST)/isikukood.esm.min.js

build: isikukood isikukood.min.js isikukood.esm.js isikukood.esm.min.js
	cp $(DIST)/isikukood.esm.js $(DOCS)

test:
	$(JEST)

