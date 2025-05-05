## Installation

1. Clone the repository
2. Install dependencies:

  ```bash
  npm install
  # or
  yarn install
```

## Environment Setup

1. Copy the example environment file:
```bash
cp .env.example .env
```

2. Update the `.env` file with your credentials:

- `RATP_API_KEY`: Your RATP API key

## Development Tools

### [Biome](http://biomejs.dev/)

This project uses Biome for code formatting and linting. It's automatically run before commits via Hooksmith.

To manually run Biome:
```bash
npx biome check src/
```

### [Hooksmith](https://github.com/tomPlanche/hooksmith) (optional)

Git hooks are managed by Hooksmith. Pre-commit hooks will run:

- Biome checks
- TypeScript type checking

Install via:

```bash
cargo install hooksmith && hooksmith install
```
