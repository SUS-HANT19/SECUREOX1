# SecureOX - Testing Guide with Dummy Data

This guide provides step-by-step instructions to test all features of the SecureOX prototype with dummy data.

## Prerequisites

Start the development server:
```bash
npm run dev
```

Then open your browser to the local development URL (typically http://localhost:5173)

---

## Test Scenario 1: Landing Page & Navigation

### Steps:
1. **Landing Page**
   - Verify the OX shield logo appears at the top center
   - Verify the heading "SecureOX" is displayed
   - Verify the tagline "Lock it. Hide it. Protect it."
   - Verify three buttons are visible: "Get Started", "Request a Demo", and "About Us" (top right)

2. **Navigate to About Us**
   - Click the "About Us" button in the top-right corner
   - Verify you're taken to a comprehensive About page
   - Scroll through all sections: Who We Are, What We Believe, Why the Ox, etc.
   - Click "Back to Home" button
   - Verify you return to the landing page

---

## Test Scenario 2: Request Demo Flow

### Steps:
1. From the Landing page, click **"Request a Demo"**
2. Fill out the demo request form with dummy data:
   - **Company Name:** TechCorp Solutions
   - **Your Name:** John Anderson
   - **Email:** john.anderson@techcorp.com
   - **Phone:** +1 (555) 123-4567
   - **Company Size:** 50-200 employees
   - **Message:** We're interested in implementing SecureOX for our enterprise security needs. We handle sensitive financial data and need robust encryption solutions.

3. Click **"Submit Request"**
4. Verify success message appears
5. Click "Back to Home" to return

---

## Test Scenario 3: User Registration & Authentication Flow

### Steps:
1. From the Landing page, click **"Get Started"**
2. On the Auth page, click **"Sign Up"** tab
3. Fill in registration details:
   - **Email:** testuser@secureox.demo
   - **Password:** SecurePass123!
   - **Confirm Password:** SecurePass123!

4. Click **"Sign Up"**
5. You'll be taken to the Phone Verification page
6. Enter dummy phone number: **+1 (555) 987-6543**
7. Click **"Send Code"**
8. Enter verification code: **123456** (or whatever code is generated/displayed)
9. Click **"Verify"**
10. You should now be in the Dashboard

---

## Test Scenario 4: Text Encryption Feature

### Steps:
1. After logging in, you'll be on the Dashboard
2. Click the **"Text Encryption"** tab
3. Test encrypting sensitive text:

#### Test Case A: Encrypt Credit Card Information
- **Original Text:**
  ```
  Credit Card: 4532-1234-5678-9010
  CVV: 123
  Exp: 12/25
  Cardholder: Jane Doe
  ```
- Click **"Encrypt Text"**
- Verify encrypted output appears (should be unreadable ciphertext)
- Copy the encrypted text
- Click **"Decrypt Text"** tab
- Paste the encrypted text
- Click **"Decrypt Text"**
- Verify original text is restored

#### Test Case B: Encrypt Personal Information
- **Original Text:**
  ```
  SSN: 123-45-6789
  DOB: 01/15/1985
  Address: 123 Main Street, Anytown, CA 90210
  ```
- Follow same encryption/decryption process
- Verify it works correctly

#### Test Case C: Encrypt Confidential Message
- **Original Text:**
  ```
  CONFIDENTIAL: Project Phoenix launch date is March 15, 2026.
  Budget approved: $2.5M
  Team lead: Sarah Mitchell
  ```
- Test encryption and decryption

---

## Test Scenario 5: Image OCR (Text Extraction from Images)

### Steps:
1. Click the **"Read text from image"** tab
2. Test with different types of images:

#### Test Case A: Upload Document Image
- Upload an image containing typed text (e.g., screenshot of a document, receipt, or printed text)
- Click **"Extract Text"** or the upload button
- Wait for processing
- Verify extracted text appears in the text area below
- Verify the text is readable and accurate

#### Test Case B: Upload Handwritten Text (if available)
- Upload an image with clear handwriting
- Process the image
- Check accuracy of extraction

#### Test Case C: Upload Screenshot with Text
- Take a screenshot of any text on your screen
- Upload it to the OCR feature
- Verify text extraction works

---

## Test Scenario 6: Full User Journey

Complete end-to-end flow:

1. **Start:** Landing Page
2. **Navigate:** Click "About Us" → Read content → Return
3. **Register:** Click "Get Started" → Sign up with new credentials
4. **Verify:** Complete phone verification
5. **Dashboard:** Access all three tabs (About, Encryption, OCR)
6. **Encrypt:** Encrypt a secret message
7. **Decrypt:** Decrypt the same message
8. **OCR:** Upload and extract text from an image
9. **Logout:** Click back button to return to landing

---

## Expected Results Summary

### Navigation
- ✅ All buttons work correctly
- ✅ Page transitions are smooth
- ✅ Back buttons return to correct pages

### Authentication
- ✅ Sign up creates new user
- ✅ Login works with existing credentials
- ✅ Phone verification is required before dashboard access

### Text Encryption
- ✅ Text encrypts to unreadable ciphertext
- ✅ Encrypted text decrypts back to original
- ✅ Large text blocks work correctly
- ✅ Special characters are preserved

### Image OCR
- ✅ Images upload successfully
- ✅ Text extraction is accurate
- ✅ Processing time is reasonable
- ✅ Extracted text can be copied

### Database
- ✅ Demo requests are stored
- ✅ User data persists
- ✅ Operation logs are created

---

## Recording Tips

When recording your demo video:

1. **Start with Landing Page** - Show the logo and main features
2. **Navigate slowly** - Give viewers time to see each section
3. **Highlight key features:**
   - The new OX shield logo
   - About Us navigation
   - Authentication flow
   - Text encryption/decryption
   - Image OCR extraction
4. **Use clear dummy data** - Make it easy to read on screen
5. **Show success states** - Demonstrate each feature works correctly
6. **Keep it concise** - 3-5 minutes is ideal

---

## Troubleshooting

If you encounter issues:

1. **Auth not working:** Check Supabase connection in .env file
2. **OCR not processing:** Ensure image is clear and contains readable text
3. **Encryption fails:** Verify the encryption library is loaded
4. **Page won't load:** Check browser console for errors

---

## Demo Data Quick Reference

**Email:** testuser@secureox.demo
**Password:** SecurePass123!
**Phone:** +1 (555) 987-6543
**Verification Code:** 123456

**Sample Text to Encrypt:**
```
CONFIDENTIAL INFORMATION
Account: ACC-2024-789
Access Code: XR7-99P-KL4
Valid Until: 2026-12-31
```

**Company Info for Demo Request:**
- Company: TechCorp Solutions
- Name: John Anderson
- Email: john.anderson@techcorp.com
- Phone: +1 (555) 123-4567

---

Good luck with your testing and recording!
