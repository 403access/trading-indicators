# Auth

- Vendor / Provider: Zitadel
- Documentation: https://zitadel.com/docs/self-hosting/deploy/compose

Download the docker compose example configuration.

```sh
wget https://raw.githubusercontent.com/zitadel/zitadel/main/docs/docs/self-hosting/deploy/docker-compose.yaml
```

or via curl ...

```sh
curl https://raw.githubusercontent.com/zitadel/zitadel/main/docs/docs/self-hosting/deploy/docker-compose.yaml -o docker-compose.yaml
```

Now, run via docker compose.

```sh
# Make sure you have the latest image versions
docker compose pull

# Run the PostgreSQL database, the Zitadel API and the Zitadel login.
docker compose up
```

User account

- user: `zitadel-admin@zitadel.localhost`
- password: `Password1!`