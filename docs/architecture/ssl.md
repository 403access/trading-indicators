# SSL

Create SSL certificate for localhost and store it in `/data/ssl`.

```sh
openssl req -x509 -newkey rsa:4096 -keyout ./data/ssl/key.pem -out ./data/ssl/cert.pem \
  -days 365 -nodes -subj "/CN=localhost"
```

`bun` is loading those SSL related files on startup and use them when serving via the web server. See [main.ts](./src/apps/backend/main.ts).