# FormPulse Backend API

A comprehensive Node.js/Express backend for FormPulse - the AI-powered form builder platform.

## 🚀 Features

### Core Features
- **User Authentication & Authorization** - JWT-based auth with refresh tokens
- **Form Management** - CRUD operations for forms with advanced features
- **Response Handling** - Public form submissions and private response management
- **Real-time Analytics** - Form performance tracking and insights
- **AI Integration** - OpenAI and Google AI for form generation and analysis
- **File Storage** - Cloudinary integration for file uploads
- **Payment Processing** - Stripe integration for subscriptions
- **Email Service** - Transactional emails with templates
- **Webhook System** - Real-time notifications and integrations

### Advanced Features
- **Rate Limiting** - Configurable rate limits for different endpoints
- **Comprehensive Logging** - Winston-based structured logging
- **Database Management** - Prisma ORM with PostgreSQL
- **Caching** - Redis for performance optimization
- **Security** - Helmet, CORS, input validation, and more
- **API Documentation** - Auto-generated OpenAPI documentation
- **Health Checks** - Application monitoring endpoints
- **Docker Support** - Containerized deployment

## 🛠 Tech Stack

- **Runtime**: Node.js 18+
- **Framework**: Express.js
- **Database**: PostgreSQL with Prisma ORM
- **Cache**: Redis
- **Authentication**: JWT tokens
- **AI Services**: OpenAI GPT-4, Google Gemini
- **Email**: Nodemailer with SMTP
- **File Storage**: Cloudinary
- **Payments**: Stripe
- **Logging**: Winston
- **Validation**: Zod
- **Testing**: Jest
- **Documentation**: OpenAPI/Swagger

## 📋 Prerequisites

- Node.js 18 or higher
- PostgreSQL 12 or higher
- Redis 6 or higher
- OpenAI API key
- Google AI API key
- Stripe account (for payments)
- Cloudinary account (for file storage)
- SMTP credentials (for emails)

## 🔧 Installation

### 1. Clone and Install Dependencies

```bash
git clone <repository-url>
cd backend
npm install
```

### 2. Environment Configuration

Copy the example environment file and configure:

```bash
cp .env.example .env
```

Edit `.env` with your configuration:

```env
# Database
DATABASE_URL=postgresql://username:password@localhost:5432/formpulse_db

# JWT Secrets
JWT_SECRET=your-super-secret-jwt-key
JWT_REFRESH_SECRET=your-super-secret-refresh-key

# AI Services
OPENAI_API_KEY=your-openai-api-key
GOOGLE_AI_API_KEY=your-google-ai-api-key

# Email Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# Stripe
STRIPE_SECRET_KEY=sk_test_your-stripe-secret-key
STRIPE_WEBHOOK_SECRET=whsec_your-stripe-webhook-secret

# Cloudinary
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

### 3. Database Setup

```bash
# Generate Prisma client
npx prisma generate

# Run database migrations
npx prisma migrate dev

# Seed the database (optional)
npm run db:seed
```

### 4. Start Development Server

```bash
npm run dev
```

The API will be available at `http://localhost:3001`

## 🐳 Docker Development

### Using Docker Compose (Recommended)

```bash
# Start all services (API, PostgreSQL, Redis, MailHog)
docker-compose up -d

# View logs
docker-compose logs -f api

# Stop services
docker-compose down
```

### Manual Docker Build

```bash
# Build image
docker build -t formpulse-api .

# Run container
docker run -p 3001:3001 --env-file .env formpulse-api
```

## 📚 API Documentation

### Authentication Endpoints

```
POST /api/auth/register       - Register new user
POST /api/auth/login          - Login user
POST /api/auth/refresh        - Refresh access token
POST /api/auth/forgot-password - Request password reset
POST /api/auth/reset-password - Reset password
POST /api/auth/verify-email   - Verify email address
```

### Form Management

```
GET    /api/forms             - Get user's forms
POST   /api/forms             - Create new form
GET    /api/forms/:id         - Get specific form
PUT    /api/forms/:id         - Update form
DELETE /api/forms/:id         - Delete form
POST   /api/forms/:id/publish - Publish form
POST   /api/forms/:id/duplicate - Duplicate form
```

### Response Management

```
POST /api/responses/submit       - Submit form response (public)
GET  /api/responses/form/:formId - Get form responses
GET  /api/responses/:id          - Get specific response
PUT  /api/responses/:id          - Update response
DELETE /api/responses/:id        - Delete response
POST /api/responses/export/:formId - Export responses
```

### AI Features

```
POST /api/ai/generate-form        - Generate form from prompt
POST /api/ai/generate-from-image  - Generate form from image
POST /api/ai/generate-from-pdf    - Generate form from PDF
POST /api/ai/generate-from-url    - Generate form from URL
POST /api/ai/suggest-questions    - Get question suggestions
POST /api/ai/analyze-responses    - Analyze form responses
POST /api/ai/optimize-form        - Get optimization suggestions
POST /api/ai/auto-grade          - Auto-grade quiz responses
GET  /api/ai/usage               - Get AI usage statistics
```

### Analytics

```
GET /api/analytics/dashboard     - Get dashboard analytics
GET /api/analytics/forms/:id     - Get form-specific analytics
GET /api/analytics/real-time     - Get real-time metrics
```

### User Management

```
GET    /api/users/profile        - Get user profile
PUT    /api/users/profile        - Update user profile
DELETE /api/users/account        - Delete user account
GET    /api/users/usage          - Get usage statistics
```

### Integrations

```
GET    /api/integrations         - Get user integrations
POST   /api/integrations         - Create integration
PUT    /api/integrations/:id     - Update integration
DELETE /api/integrations/:id     - Delete integration
POST   /api/integrations/:id/test - Test integration
```

### Webhooks

```
POST /api/webhooks/:formId       - Receive webhook (public)
GET  /api/webhooks/form/:formId  - Get form webhooks
POST /api/webhooks/form/:formId  - Create webhook
PUT  /api/webhooks/:id           - Update webhook
DELETE /api/webhooks/:id         - Delete webhook
```

## 🔒 Authentication

The API uses JWT tokens for authentication:

1. **Access Token**: Short-lived (7 days) for API access
2. **Refresh Token**: Long-lived (30 days) for token renewal

### Using the API

Include the access token in the Authorization header:

```bash
curl -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
     https://api.formpulse.com/api/forms
```

### API Keys

For server-to-server communication, use API keys:

```bash
curl -H "X-API-Key: YOUR_API_KEY" \
     https://api.formpulse.com/api/forms
```

## 📊 Rate Limiting

Default rate limits:

- **General API**: 100 requests per 15 minutes
- **Authentication**: 10 requests per 15 minutes  
- **AI Endpoints**: 50 requests per hour
- **File Uploads**: 20 requests per hour

Rate limit headers are included in responses:

```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1640995200
```

## 🧪 Testing

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run specific test file
npm test -- auth.test.js
```

## 📝 Logging

Logs are written to:

- `logs/error.log` - Error logs only
- `logs/combined.log` - All logs
- `logs/exceptions.log` - Uncaught exceptions
- Console output (development only)

Log levels: `error`, `warn`, `info`, `http`, `debug`

## 🚀 Deployment

### Environment Variables

Required for production:

```env
NODE_ENV=production
DATABASE_URL=postgresql://...
JWT_SECRET=strong-production-secret
REDIS_URL=redis://...
```

### Using Docker

```bash
# Build production image
docker build --target production -t formpulse-api:latest .

# Run production container
docker run -d \
  --name formpulse-api \
  -p 3001:3001 \
  --env-file .env.production \
  formpulse-api:latest
```

### Database Migrations

```bash
# Run migrations in production
npx prisma migrate deploy

# Generate Prisma client
npx prisma generate
```

### Health Checks

Monitor application health:

```bash
curl http://localhost:3001/health
```

Response:
```json
{
  "status": "OK",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "uptime": 3600,
  "environment": "production"
}
```

## 🔧 Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NODE_ENV` | Environment (development/production) | development |
| `PORT` | Server port | 3001 |
| `DATABASE_URL` | PostgreSQL connection string | - |
| `REDIS_URL` | Redis connection string | redis://localhost:6379 |
| `JWT_SECRET` | JWT signing secret | - |
| `JWT_EXPIRES_IN` | JWT expiration time | 7d |
| `OPENAI_API_KEY` | OpenAI API key | - |
| `GOOGLE_AI_API_KEY` | Google AI API key | - |
| `STRIPE_SECRET_KEY` | Stripe secret key | - |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name | - |
| `SMTP_HOST` | SMTP server host | - |
| `SMTP_PORT` | SMTP server port | 587 |
| `LOG_LEVEL` | Logging level | info |

### Database Schema

The application uses Prisma with PostgreSQL. Key models:

- **User** - User accounts and profiles
- **Form** - Form definitions and settings
- **Response** - Form submissions
- **Analytics** - Usage and performance metrics
- **Integration** - Third-party integrations
- **Webhook** - Webhook configurations
- **ApiKey** - API key management

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/new-feature`
3. Make changes and add tests
4. Run tests: `npm test`
5. Commit changes: `git commit -am 'Add new feature'`
6. Push to branch: `git push origin feature/new-feature`
7. Submit a pull request

### Code Style

- Use TypeScript for all new code
- Follow ESLint configuration
- Add JSDoc comments for public functions
- Write tests for new features
- Update documentation as needed

## 🐛 Troubleshooting

### Common Issues

**Database Connection Errors**
```bash
# Check PostgreSQL is running
pg_isready -h localhost -p 5432

# Test connection
psql postgresql://username:password@localhost:5432/formpulse_db
```

**Redis Connection Errors**
```bash
# Check Redis is running
redis-cli ping

# Should return PONG
```

**JWT Token Errors**
- Ensure `JWT_SECRET` is set and matches between services
- Check token expiration times
- Verify token format in Authorization header

**AI Service Errors**
- Verify API keys are valid and have sufficient credits
- Check rate limits for AI services
- Ensure proper error handling for AI failures

### Debug Mode

Enable debug logging:

```bash
LOG_LEVEL=debug npm run dev
```

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Documentation**: [https://docs.formpulse.com](https://docs.formpulse.com)
- **Issues**: [GitHub Issues](https://github.com/formpulse/backend/issues)
- **Email**: support@formpulse.com
- **Discord**: [FormPulse Community](https://discord.gg/formpulse)

---

Built with ❤️ by the FormPulse Team 