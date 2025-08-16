# Mock.Trade

# Tech Stack

- JavaScript runtime: bun
- UI: react
- UI framework: tailwind
- UI components: shadcn

## TODO

- Add unit and integration tests
  - test actual Kraken API calls
- UI
  - DateTime Picker
    - Match theme

## Setup

First, create an .env file based on [.env.sample](./.env.sample).

Then, place historic data at [/data](/data).

To install dependencies:

```bash
bun install
```

To start a development server:

```bash
bun dev
```

To run for production:

```bash
bun start
```

This project was created using `bun init` in bun v1.2.20. [Bun](https://bun.com) is a fast all-in-one JavaScript runtime.
