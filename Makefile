.PHONY: build install clean test demoplayer

PREFIX ?= /usr/local
ENGINE_DIR ?= ../trinity-engine
BINDIR ?= $(PREFIX)/bin
VERSION ?= $(shell git describe --tags --always --dirty 2>/dev/null || echo "dev")

build:
	go build -ldflags "-X main.version=$(VERSION)" -o bin/trinity ./cmd/trinity
	rm -rf web/dist/
	npm --prefix web run build

install: build
	install -d $(DESTDIR)$(BINDIR)
	install -m 755 bin/trinity $(DESTDIR)$(BINDIR)/

clean:
	rm -rf bin/
	rm -rf web/dist/

demoplayer:
	$(MAKE) -C $(ENGINE_DIR) demoplayer
	rm -rf web/public/demo
	cp -r $(ENGINE_DIR)/dist/demo web/public/demo

test:
	go test ./...
