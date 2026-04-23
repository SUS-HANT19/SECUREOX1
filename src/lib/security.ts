/**
 * HTTPS and Security Configuration
 *
 * CRITICAL SECURITY REQUIREMENTS:
 *
 * 1. HTTPS Communication:
 *    - All production deployments MUST use HTTPS
 *    - TLS 1.2 or higher is required
 *    - Valid SSL/TLS certificates must be configured
 *    - HTTP requests should be redirected to HTTPS
 *
 * 2. Security Headers (should be configured at server/CDN level):
 *    - Strict-Transport-Security: max-age=31536000; includeSubDomains
 *    - X-Content-Type-Options: nosniff
 *    - X-Frame-Options: DENY
 *    - X-XSS-Protection: 1; mode=block
 *    - Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'
 *    - Referrer-Policy: strict-origin-when-cross-origin
 *
 * 3. Data Protection in Transit:
 *    - All API calls to Supabase use HTTPS
 *    - Encryption keys are never transmitted over the network
 *    - Sensitive data is encrypted before transmission
 *
 * 4. Development vs Production:
 *    - Development: Vite dev server uses HTTP by default (localhost only)
 *    - Production: Must be deployed to HTTPS-enabled hosting (Vercel, Netlify, etc.)
 */

/**
 * Validates that the application is running over HTTPS in production
 * @returns true if running in dev mode or over HTTPS
 */
export function isSecureContext(): boolean {
  // Allow HTTP in development
  if (import.meta.env.DEV) {
    return true;
  }

  // In production, require HTTPS
  return window.isSecureContext && window.location.protocol === 'https:';
}

/**
 * Security headers that should be configured at the server/CDN level
 * These are provided for reference and documentation purposes
 */
export const RECOMMENDED_SECURITY_HEADERS = {
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-XSS-Protection': '1; mode=block',
  'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; connect-src 'self' https://*.supabase.co;",
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'geolocation=(), microphone=(), camera=()'
};

/**
 * Checks if the current context is secure and logs a warning if not
 */
export function enforceSecureContext(): void {
  if (!isSecureContext()) {
    console.error(
      'SECURITY WARNING: Application is running in an insecure context. ' +
      'HTTPS is required for production deployments to protect data in transit.'
    );
  }
}

export function checkSubresourceIntegrity(): boolean {
  if (import.meta.env.DEV) {
    return true;
  }

  const scripts = document.querySelectorAll('script[src]');
  const links = document.querySelectorAll('link[rel="stylesheet"][href]');

  const externalResources = [...scripts, ...links].filter((element) => {
    const src = element.getAttribute('src') || element.getAttribute('href');
    return src && (src.startsWith('http://') || src.startsWith('https://'));
  });

  const hasIntegrity = externalResources.every((element) => {
    return element.hasAttribute('integrity') && element.hasAttribute('crossorigin');
  });

  if (!hasIntegrity && externalResources.length > 0) {
    console.warn(
      'SECURITY WARNING: Some external resources are loaded without Subresource Integrity (SRI). ' +
      'This could allow tampering with external resources.'
    );
  }

  return hasIntegrity;
}

export function preventClickjacking(): void {
  if (window.self !== window.top) {
    if (import.meta.env.PROD) {
      console.error('SECURITY WARNING: Page is being loaded in an iframe, which may indicate a clickjacking attempt.');
      document.body.style.display = 'none';
      window.top?.location.replace(window.self.location.href);
    }
  }
}

export function clearSensitiveDataOnUnload(): void {
  window.addEventListener('beforeunload', () => {
    try {
      sessionStorage.clear();

      const sensitiveInputs = document.querySelectorAll('input[type="password"], input[data-sensitive="true"]');
      sensitiveInputs.forEach((input) => {
        if (input instanceof HTMLInputElement) {
          input.value = '';
        }
      });
    } catch (error) {
      console.error('Failed to clear sensitive data:', error);
    }
  });
}

export function initializeSecurity(): void {
  enforceSecureContext();
  preventClickjacking();
  checkSubresourceIntegrity();
  clearSensitiveDataOnUnload();

  if (import.meta.env.DEV) {
    console.log('Security checks initialized (Development Mode)');
  }
}
