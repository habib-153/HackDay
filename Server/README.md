# HackDay Server

A Node.js/Express server with TypeScript, MongoDB, and JWT authentication.

## Project Structure

```
Server/
├── src/
│   ├── app/
│   │   ├── builder/         # Query builder utilities
│   │   ├── config/          # Environment configuration
│   │   ├── errors/          # Error handling utilities
│   │   ├── interfaces/      # TypeScript interfaces
│   │   ├── middlewares/     # Express middlewares
│   │   ├── modules/         # Feature modules
│   │   │   └── Auth/        # Authentication module
│   │   ├── routes/          # Route configuration
│   │   └── utils/           # Utility functions
│   ├── app.ts               # Express app setup
│   └── server.ts            # Server entry point
├── .env.example             # Environment variables template
├── package.json
└── tsconfig.json
```

## Features

- ✅ TypeScript for type safety
- ✅ Express.js web framework
- ✅ MongoDB with Mongoose ODM
- ✅ JWT authentication (access & refresh tokens)
- ✅ Zod validation
- ✅ Global error handling
- ✅ Query builder for advanced filtering
- ✅ Modular architecture

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- MongoDB (local or cloud)

### Installation

1. Install dependencies:
```bash
npm install
```

2. Create `.env` file:
```bash
cp .env.example .env
```

3. Update `.env` with your configuration:
```env
NODE_ENV=development
PORT=5000
DATABASE_URL=mongodb://localhost:27017/hackday
JWT_ACCESS_SECRET=your_secret_here
JWT_REFRESH_SECRET=your_refresh_secret_here
JWT_ACCESS_EXPIRES_IN=1d
JWT_REFRESH_EXPIRES_IN=365d
BCRYPT_SALT_ROUNDS=12
```

### Development

Run the development server:
```bash
npm run dev
```

### Build

Build for production:
```bash
npm run build
```

### Production

Start production server:
```bash
npm start
```

## API Endpoints

### Authentication

#### Register User

**Endpoint:** `POST /api/v1/auth/register`

**Description:** Register a new user account

**Request Body:**
```json
{
  "name": "string (required, min 2 characters)",
  "email": "string (required, valid email format)",
  "password": "string (required, min 6 characters)",
  "role": "string (optional, 'user' | 'admin', defaults to 'user')"
}
```

**Success Response (201 Created):**
```json
{
  "success": true,
  "message": "User registered successfully!",
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Error Responses:**

*409 Conflict - Email already exists:*
```json
{
  "success": false,
  "message": "User with this email already exists!",
  "errorSources": [...],
  "stack": "..."
}
```

*400 Bad Request - Validation error:*
```json
{
  "success": false,
  "message": "Validation error",
  "errorSources": [
    {
      "path": "body.email",
      "message": "Invalid email format"
    }
  ]
}
```

**Example:**
```bash
curl -X POST http://localhost:5000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123"
  }'
```

---

#### Login User

**Endpoint:** `POST /api/v1/auth/login`

**Description:** Authenticate user and receive access token

**Request Body:**
```json
{
  "email": "string (required, valid email format)",
  "password": "string (required)"
}
```

**Success Response (200 OK):**
```json
{
  "success": true,
  "message": "User logged in successfully!",
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Note:** Refresh token is automatically set as an httpOnly cookie in the response headers.

**Error Responses:**

*404 Not Found - User doesn't exist:*
```json
{
  "success": false,
  "message": "User not found!",
  "errorSources": [...],
  "stack": "..."
}
```

*403 Forbidden - Wrong password:*
```json
{
  "success": false,
  "message": "Password does not match!",
  "errorSources": [...],
  "stack": "..."
}
```

*400 Bad Request - Validation error:*
```json
{
  "success": false,
  "message": "Validation error",
  "errorSources": [
    {
      "path": "body.email",
      "message": "Email is required."
    }
  ]
}
```

**Example:**
```bash
curl -X POST http://localhost:5000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

---

#### Other Auth Endpoints

- `POST /api/v1/auth/change-password` - Change password (requires auth)
- `POST /api/v1/auth/refresh-token` - Refresh access token

## User Module

The User module includes:
- **user.interface.ts** - TypeScript interfaces for User model
- **user.model.ts** - Mongoose schema with password hashing

## Auth Module

The Auth module includes:
- **auth.interface.ts** - TypeScript interfaces
- **auth.validation.ts** - Zod validation schemas
- **auth.controller.ts** - Request handlers
- **auth.service.ts** - Business logic
- **auth.route.ts** - Route definitions
- **auth.utils.ts** - JWT utilities

## Security Features

- **Password Hashing:** Automatic bcrypt hashing with configurable salt rounds
- **JWT Tokens:** Separate access and refresh tokens with configurable expiration
- **HttpOnly Cookies:** Refresh tokens stored securely to prevent XSS attacks
- **Email Uniqueness:** Database constraint prevents duplicate registrations
- **Password Privacy:** Password field excluded from queries by default

## Adding New Modules

To add a new module:

1. Create a folder in `src/app/modules/YourModule/`
2. Add the following files:
   - `yourmodule.interface.ts`
   - `yourmodule.validation.ts`
   - `yourmodule.model.ts`
   - `yourmodule.controller.ts`
   - `yourmodule.service.ts`
   - `yourmodule.route.ts`
3. Register the route in `src/app/routes/index.ts`

## Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build TypeScript to JavaScript
- `npm start` - Start production server
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint errors
- `npm run format` - Format code with Prettier

## License

ISC
