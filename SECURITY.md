# SecureOX Security Features

## Implemented Features

### 1. Encryption/Decryption of OCR-Extracted Text
- Extract text from images using OCR
- Encrypt extracted text with user-provided passphrase
- Decrypt encrypted text using the same passphrase
- Visual indicators show encryption state
- Copy functionality for both encrypted and decrypted text

### 2. Secure Key Handling
- **PBKDF2 Key Derivation Function**: Uses 100,000 iterations for strong key stretching
- **Ephemeral Keys**: Encryption keys are derived on-demand and never stored persistently
- **AES-256-GCM Encryption**: Industry-standard authenticated encryption algorithm
- **Random Salt & IV**: Each encryption operation uses unique random values
- **Zero Storage**: Keys exist only in memory during operations and are immediately discarded
- **Minimum Passphrase Length**: Enforces 8-character minimum for security

### 3. Operational Logging (Metadata Only)

The application logs operational metadata to the Supabase database for audit and monitoring purposes.

**What is logged:**
- `request_id`: Unique identifier for tracking related operations
- `operation_type`: Type of operation (encrypt, decrypt, ocr, file-protect, file-unlock)
- `latency_ms`: Operation duration in milliseconds
- `ocr_confidence`: OCR confidence score (0-100) when applicable
- `status`: Success or error status
- `error_code`: Error code for failed operations
- `created_at`: Timestamp of the operation

**What is NEVER logged:**
- Plaintext content
- Passphrases or passwords
- Ciphertext or encrypted data
- Encryption keys or derived keys
- File contents or file data
- Personal identifiable information (PII)

**Request ID Tracking:**
Request IDs enable correlation of related operations. For example:
1. User performs OCR extraction (request_id: abc123)
2. User encrypts the extracted text (same request_id: abc123)
3. Later, user decrypts the text (same request_id: abc123)

This allows tracking the full lifecycle of data without logging sensitive information.

### 4. HTTPS-Based Communication

**Development:**
- Vite dev server runs on HTTP (localhost only, safe for development)
- To enable HTTPS in development: `vite --https`

**Production:**
- Application MUST be deployed to HTTPS-enabled hosting
- All Supabase API calls automatically use HTTPS
- Security headers configured in `public/_headers` file

**Security Headers (Configured for Production):**
- `Strict-Transport-Security`: Forces HTTPS for 1 year
- `X-Content-Type-Options`: Prevents MIME type sniffing
- `X-Frame-Options`: Prevents clickjacking
- `X-XSS-Protection`: Enables browser XSS protection
- `Content-Security-Policy`: Restricts resource loading
- `Referrer-Policy`: Controls referrer information
- `Permissions-Policy`: Restricts browser features

**Data Protection in Transit:**
- All client-server communication uses HTTPS in production
- Supabase connection uses TLS encryption
- Encryption keys are never transmitted over the network
- Sensitive data is encrypted client-side before storage

### 5. Database Security

**Row Level Security (RLS):**
All tables have RLS enabled to control data access at the database level.

**Protected Files Table:**
- Public access for demo purposes (users need passwords to unlock files)
- In production, implement user authentication and ownership checks

**Operation Logs Table:**
- Public write access for logging (no sensitive data logged)
- Public read access for monitoring dashboards
- Indexes on request_id, created_at, and operation_type for efficient queries

## Security Best Practices

1. **Never Log Sensitive Data**: The logging system has strict controls to prevent logging sensitive information
2. **Ephemeral Keys**: Encryption keys are derived per-operation and never persisted
3. **Strong Key Derivation**: PBKDF2 with 100,000 iterations protects against brute force attacks
4. **HTTPS Required**: All production deployments must use HTTPS
5. **Security Headers**: Configured headers protect against common web vulnerabilities
6. **Client-Side Encryption**: Data is encrypted before leaving the browser

## Deployment Checklist

- [ ] Deploy to HTTPS-enabled hosting (Vercel, Netlify, etc.)
- [ ] Verify security headers are applied (check browser dev tools)
- [ ] Confirm all API requests use HTTPS
- [ ] Test encryption/decryption functionality
- [ ] Verify operational logs contain no sensitive data
- [ ] Review RLS policies if adding user authentication
- [ ] Monitor operation logs for errors and performance

## Future Enhancements (Phase 3+)

- User authentication and authorization
- User-specific encryption key management
- Cloud storage integration with encrypted file storage
- Advanced logging dashboard with analytics
- Multi-factor authentication
- Session management and timeout controls
- Rate limiting and abuse prevention
