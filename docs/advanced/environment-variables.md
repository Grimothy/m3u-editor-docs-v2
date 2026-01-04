---
sidebar_position: 6
description: Environment variable reference for M3U Editor
tags:
  - Advanced
  - Configuration
  - Environment
title: Environment Variables
---

# Environment Variables

M3U Editor uses environment variables for configuration. These are typically set in the `.env` file in the root directory of your installation.

## Application Settings

### APP_KEY
- **Default**: Empty (automatically generated during installation)
- **Description**: Application encryption key. Generated automatically during installation with `php artisan key:generate`
- **Important**: Never share this key publicly

### APP_DEBUG
- **Default**: `false`
- **Description**: Enable debug mode for development
- **Options**: `true`, `false`
- **Warning**: Never set to `true` in production environments

### TZ
- **Default**: `UTC`
- **Description**: Default timezone for the application
- **Example**: `America/New_York`, `Europe/London`

### APP_URL
- **Default**: `http://localhost`
- **Description**: The base URL where your application is accessible
- **Example**: `https://m3u.example.com`

### APP_PORT
- **Default**: `36400`
- **Description**: Port number for the application (Docker environments)

## Localization

### APP_LOCALE
- **Default**: `en`
- **Description**: Default application locale

### APP_FALLBACK_LOCALE
- **Default**: `en`
- **Description**: Fallback locale when current locale is unavailable

### APP_FAKER_LOCALE
- **Default**: `en_US`
- **Description**: Locale for fake data generation (development/testing)

## Database Configuration

### DB_CONNECTION
- **Default**: `sqlite`
- **Description**: Database driver to use
- **Options**: `sqlite`, `pgsql`, `mysql`

### SQLite (Default)
SQLite requires no additional configuration and stores data in a local file.

### PostgreSQL Configuration

Enable PostgreSQL by uncommenting and setting these variables:

```env
ENABLE_POSTGRES=true
DB_CONNECTION=pgsql
PG_DATABASE=your_database_name
PG_USER=your_username
PG_PASSWORD=your_password
DB_HOST=127.0.0.1
DB_PORT=5433
```

#### PG_DATABASE
- **Description**: PostgreSQL database name

#### PG_USER
- **Description**: PostgreSQL username

#### PG_PASSWORD
- **Description**: PostgreSQL password

#### DB_HOST
- **Default**: `127.0.0.1`
- **Description**: PostgreSQL server host

#### DB_PORT
- **Default**: `5433`
- **Description**: PostgreSQL server port

## M3U Proxy Configuration

### M3U_PROXY_ENABLED
- **Default**: Commented out (uses embedded proxy)
- **Description**: Controls proxy mode
  - `true`: Use embedded proxy (runs in the same container)
  - `false` or `null`: Use external proxy service (separate container)
- **Note**: For most users, leaving this commented (default) is recommended

### M3U_PROXY_HOST
- **Default**: `127.0.0.1`
- **Description**: Host for embedded proxy
- **Note**: Only applies when `M3U_PROXY_ENABLED=true`

### M3U_PROXY_PORT
- **Default**: `8085`
- **Description**: Internal port for embedded proxy
- **Note**: Only applies when `M3U_PROXY_ENABLED=true`
