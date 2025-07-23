# Catholic Faith Defender

A web application for exploring and learning about Catholic faith, featuring Q&A, prayers, and Bible verses in multiple languages.

## Features

- **Multi-language Support**: Content available in English, Cebuano, and Tagalog
- **Q&A Section**: Common questions about Catholic faith with detailed answers
- **Prayers**: Collection of Catholic prayers
- **Bible Verses**: Searchable Bible verses
- **Documents**: Catholic documents and teachings

## Prerequisites

- Node.js (v18 or higher)
- PostgreSQL (v14 or higher)
- npm (recommended)

## Getting Started

### 1. Clone the Repository

```bash
git clone [repository-url]
cd CatholicFaithDefender
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Setup

1. Create a `.env` file in the root directory:
   ```bash
   cp .env.example .env
   ```

2. The application comes with a `.env.development` | `.env.production` | `.env.test` file that contains default database settings. You can modify it if needed:
   ```env
   # Server
   PORT=5001

   # Database
   DATABASE_URL=postgres://postgres:postgres@localhost:5432/cfd
   DB_TYPE="postgres"
   PGHOST=localhost
   PGUSER=postgres
   PGPASSWORD="postgres"
   PGPORT=5432
   PGDATABASE=cfd

   # Next.js Auth
   NEXTAUTH_SECRET=your-nextauth-secret-local
   NEXTAUTH_URL=http://localhost:5001

   # Environment
   NODE_ENV=development | production | test

   ```

### 4. Database Setup

1. Make sure PostgreSQL is running
2. Create a new database (if it doesn't exist):
   ```bash
   createdb -U postgres cfd
   ```

### 5. Run Migrations

```bash
# Push database schema
npm run db:push:dev
```

## Development

### Start Development Server

```bash
# Start the development server
npm run dev
```

The application will be available at `http://localhost:3000`

### 6. Seed the Database

```bash
# Run the seed script
npx tsx -r dotenv/config server/seed.ts dotenv_config_path=.env.development
```

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run check` - Type-check the codebase
- `npm run test` - Run tests
- `npm run db:push:dev` - Push database schema
- `npm run db:push:prod` - Push database schema
- `npm run db:push:test` - Push database schema

## Project Structure

```
├── client/           # Frontend React application
├── server/           # Backend server
├── shared/           # Shared code between client and server
├── migrations/       # Database migration files
└── public/           # Static assets
```

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | - |
| `NODE_ENV` | Application environment | `development` |

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For support, please open an issue in the repository or contact the maintainers.
