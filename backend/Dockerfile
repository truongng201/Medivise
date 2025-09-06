## base image
FROM python:3.12-slim AS compile-image

## install system dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    libpq-dev \
    curl \
    && rm -rf /var/lib/apt/lists/*

## virtualenv
ENV VIRTUAL_ENV=/opt/venv
RUN python -m venv $VIRTUAL_ENV
ENV PATH="$VIRTUAL_ENV/bin:$PATH"

## upgrade pip & install pip-tools
RUN pip install --upgrade pip setuptools wheel pip-tools

## add and install requirements
COPY requirements.txt requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

## build-image
FROM python:3.12-slim AS runtime-image

## install runtime dependencies (only what's needed at runtime)
RUN apt-get update && apt-get install -y --no-install-recommends \
    curl \
    && rm -rf /var/lib/apt/lists/*

## copy Python dependencies from build image
COPY --from=compile-image /opt/venv /opt/venv

## SET ARGUMENTS TO ENVIRONMENT VARIABLES
ARG APP_VERSION \
    ENV
ENV APP_VERSION=${APP_VERSION}
ENV ENV=${ENV}
ENV PYTHONPATH=/usr/src/app

## set working directory
WORKDIR /usr/src/app

## add user
RUN addgroup --system dev && adduser --system --ingroup dev dev
RUN mkdir -p /usr/src/app && \
    chown -R dev:dev /usr/src/app

# switch to non-root user
USER dev

## copy application code
COPY . /usr/src/app

## set environment variables
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1
ENV PATH="/opt/venv/bin:$PATH"

## run app
CMD ["uvicorn", "main:app", "--port", "8000", "--host", "0.0.0.0"]
