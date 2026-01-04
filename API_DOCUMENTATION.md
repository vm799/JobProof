# BoardingPass API Documentation

**Version:** v1  
**Base URL:** `https://api.getboardingpass.app/v1`

## Authentication

All API requests require authentication using an API key in the header:

```bash
curl -H "X-API-Key: bp_your_api_key_here" \
  https://api.getboardingpass.app/v1/clients
```

## Rate Limits

- **Standard:** 1,000 requests per hour
- **Premium:** 10,000 requests per hour
- **Enterprise:** Unlimited

## Endpoints

### Clients

#### List Clients
```
GET /v1/clients
```

**Parameters:**
- `page` (integer): Page number (default: 1)
- `limit` (integer): Results per page (max: 100, default: 20)
- `search` (string): Search by name or email

**Response:**
```json
{
  "data": [
    {
      "id": "uuid",
      "name": "John Doe",
      "email": "john@example.com",
      "created_at": "2026-01-01T00:00:00Z"
    }
  ],
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 100,
    "total_pages": 5
  }
}
```

#### Create Client
```
POST /v1/clients
```

**Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com"
}
```

**Response:** `201 Created`
```json
{
  "data": {
    "id": "uuid",
    "name": "John Doe",
    "email": "john@example.com",
    "created_at": "2026-01-01T00:00:00Z"
  }
}
```

### Onboardings

#### Create Onboarding
```
POST /v1/onboardings
```

**Body:**
```json
{
  "client_id": "uuid",
  "flow_id": "uuid"
}
```

**Response:** `201 Created`

### Webhooks

BoardingPass can send webhooks to your URL when events occur.

#### Available Events
- `client.created`
- `client.updated`
- `onboarding.started`
- `onboarding.completed`
- `step.completed`
- `file.uploaded`

#### Webhook Payload
```json
{
  "event": "onboarding.completed",
  "data": {
    "id": "uuid",
    "client_id": "uuid",
    "status": "completed"
  },
  "timestamp": "2026-01-01T00:00:00Z",
  "workspace_id": "uuid"
}
```

#### Webhook Security

Verify webhook signatures using HMAC SHA-256:

```javascript
const crypto = require('crypto');

function verifyWebhook(payload, signature, secret) {
  const hmac = crypto.createHmac('sha256', secret);
  const digest = hmac.update(payload).digest('hex');
  return digest === signature;
}

// Check the X-BoardingPass-Signature header
const isValid = verifyWebhook(
  req.body,
  req.headers['x-boardingpass-signature'],
  'your_webhook_secret'
);
```

## Error Codes

| Code | Description |
|------|-------------|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request |
| 401 | Unauthorized |
| 403 | Forbidden |
| 404 | Not Found |
| 429 | Rate Limit Exceeded |
| 500 | Internal Server Error |

## SDKs

Official SDKs available for:
- JavaScript/TypeScript
- Python
- Ruby
- PHP

See https://github.com/boardingpass/sdks
