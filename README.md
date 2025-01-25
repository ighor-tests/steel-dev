# Proxy Server for Steel.dev

This is a basic proxy server project designed as a test for Steel.dev. The server supports HTTP traffic, basic authentication, and tracks bandwidth usage and most visited sites. It also provides metrics via a `/metrics` endpoint.

---

## Features
- Proxy HTTP requests.
- Basic authentication with username and password.
- Metrics tracking:
  - Bandwidth usage.
  - Most visited sites.
- API to retrieve metrics (`GET /metrics`).

---

## Requirements

Before running the project, ensure you have the following installed:
- Node.js (v18 or higher recommended)
- Yarn (or npm)

---

## Environment Variables

You must set the following environment variables before running the project:

| Variable        | Description                    | Default Value |
|-----------------|--------------------------------|---------------|
| `PROXY_PORT`    | The port where the proxy runs. | `8081`        |
| `PROXY_USER`    | Username for proxy access.     | `admin`       |
| `PROXY_PASS`    | Password for proxy access.     | `1234`        |

Create a `.env` file in the root directory of the project and define the variables as follows:

```env
PROXY_PORT=
PROXY_USER=
PROXY_PASSWORD=
```

---

## Instalation

1. Clone the repository to your local machine:
   ```bash
   git clone <repository-url>
   cd <repository-folder>
   ```
2. Install Dependencies
    ```bash
    yarn
    ```
    or

    ```bash
    npm install
    ```

---

## Usage

1. Start the project

### Development Mode
    yarn dev

### Production Mode
    yarn build
    node dist/index.js
    
    
2. Run the following commands to test the proxy:
    ```bash
        curl -x http://localhost:PROXY_PORT --proxy-user PROXY_USER:PROXY_PASSWORD -L http://www.google.com
    ```
    ```bash
        curl -x http://localhost:PROXY_PORT --proxy-user PROXY_USER:PROXY_PASSWORD -L http://www.facebook.com
    ```
    ```bash
        curl -x http://localhost:PROXY_PORT --proxy-user PROXY_USER:PROXY_PASSWORD -L http://www.x.com
    ```

3. Use `GET /metrics` to see the bandwidth usage and top visited sites

---
## Shutting Down

When shutting down the server gracefully (e.g., pressing `Ctrl+C` or `Command+C`), a final summary of the bandwidth usage and most visited sites will be logged to the console.