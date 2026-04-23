# SecureOX User Testing Guide

Welcome to SecureOX! This guide will help you create a test account and explore the application.

## Getting Started

### 1. Access the Application
Navigate to the SecureOX landing page in your web browser.

### 2. Create a New Account

**Step 1: Registration**
1. Click the "Get Started" button on the landing page
2. On the authentication page, click "Sign Up" tab
3. Enter your email address
4. Create a secure password (minimum 6 characters)
5. Click "Sign Up"

**Step 2: Phone Verification**
1. After successful registration, you'll be redirected to the phone verification page
2. Enter your 10-digit phone number (format: 1234567890)
3. Click "Verify Phone Number"
4. You'll receive a verification code (Note: In test mode, you can use any 6-digit code)
5. Enter the 6-digit verification code
6. Click "Verify Code"

### 3. Access the Dashboard
Once verified, you'll be automatically logged into the SecureOX dashboard.

## Using the Application

### Available Features

**Text Encryption Tool**
- Encrypt sensitive text messages
- Decrypt previously encrypted messages
- Copy encrypted text to clipboard

**Image OCR Tool**
- Upload images containing text
- Extract text from images automatically
- Supports JPG, PNG, and GIF formats
- Maximum file size: 5MB

**Interactive Chatbot**
- Get help with using the application
- Available on both landing page and dashboard
- Click the chat icon in the bottom-right corner

### Security Features

**Auto Sign-Out**
- The application automatically signs you out after 60 seconds of inactivity
- You'll see a warning message 5 seconds before automatic sign-out
- Move your mouse, type, or scroll to reset the timer

**Manual Sign-Out**
- Click the "Sign Out" button in the top-right corner of the dashboard
- This immediately logs you out and returns you to the landing page

## Login Instructions (Returning Users)

1. Click "Get Started" from the landing page
2. Make sure you're on the "Sign In" tab
3. Enter your registered email address
4. Enter your password
5. Click "Sign In"
6. Complete phone verification if prompted
7. Access your dashboard

## Test Account Creation

### For Multiple Testers

Each tester should:
1. Use their own unique email address
2. Create a unique password
3. Provide their own phone number for verification

### Test Scenarios to Try

1. **Registration Flow**
   - Test with valid email formats
   - Test password requirements
   - Complete phone verification

2. **Login Flow**
   - Test successful login
   - Test with incorrect credentials
   - Test password reset (if available)

3. **Text Encryption**
   - Encrypt a message
   - Copy encrypted text
   - Decrypt the same message
   - Verify the original text matches

4. **Image OCR**
   - Upload an image with clear text
   - Verify text extraction accuracy
   - Test different image formats
   - Test file size limits

5. **Session Management**
   - Test manual sign-out
   - Test auto sign-out after 60 seconds of inactivity
   - Verify you're returned to landing page after sign-out

6. **Security Testing**
   - Try accessing dashboard without logging in
   - Test session persistence across page refreshes
   - Verify data is secure and private to your account

## Troubleshooting

**Can't register?**
- Ensure your email format is valid
- Password must be at least 6 characters
- Check if the email is already registered

**Phone verification failing?**
- Ensure phone number is exactly 10 digits
- No spaces, dashes, or special characters
- Use format: 1234567890

**Can't upload image?**
- File must be JPG, PNG, or GIF
- Maximum file size is 5MB
- Ensure image contains readable text

**Signed out unexpectedly?**
- This is the auto sign-out security feature
- Move your mouse or interact with the page to stay active
- Sign in again to continue

## Feedback

When testing, please note:
- Any bugs or unexpected behavior
- UI/UX issues or suggestions
- Performance concerns
- Security observations
- Feature requests

## Support

For questions or issues during testing, please contact the development team.

---

**Security Note**: This is a test environment. While the application uses real security measures, please avoid using highly sensitive personal information during testing.
