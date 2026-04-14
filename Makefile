PYTHON ?= python3

.PHONY: preprocess train evaluate ml-api backend-dev frontend-dev

preprocess:
	cd cvd-ai-python && $(PYTHON) src/data_preprocess.py

train:
	cd cvd-ai-python && $(PYTHON) src/train.py

evaluate:
	cd cvd-ai-python && $(PYTHON) src/evaluate.py

ml-api:
	cd cvd-ai-python && $(PYTHON) run_server.py

backend-dev:
	cd cvd-backend && npm run dev

frontend-dev:
	cd cvd-frontend && npm run dev

