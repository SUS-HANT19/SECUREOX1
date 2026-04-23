interface EnvConfig {
  VITE_SUPABASE_URL: string;
  VITE_SUPABASE_ANON_KEY: string;
}

class EnvironmentValidator {
  private validated = false;
  private config: EnvConfig | null = null;

  validate(): EnvConfig {
    if (this.validated && this.config) {
      return this.config;
    }

    const requiredVars = [
      'VITE_SUPABASE_URL',
      'VITE_SUPABASE_ANON_KEY'
    ] as const;

    const missing: string[] = [];
    const invalid: string[] = [];

    for (const varName of requiredVars) {
      const value = import.meta.env[varName];

      if (!value || typeof value !== 'string' || value.trim().length === 0) {
        missing.push(varName);
      } else if (varName === 'VITE_SUPABASE_URL') {
        try {
          const url = new URL(value);
          if (!url.protocol.startsWith('http')) {
            invalid.push(`${varName} (must be HTTP/HTTPS URL)`);
          }
        } catch {
          invalid.push(`${varName} (invalid URL format)`);
        }
      }
    }

    if (missing.length > 0 || invalid.length > 0) {
      const errorMessages = [];

      if (missing.length > 0) {
        errorMessages.push(`Missing required environment variables: ${missing.join(', ')}`);
      }

      if (invalid.length > 0) {
        errorMessages.push(`Invalid environment variables: ${invalid.join(', ')}`);
      }

      throw new Error(
        `Environment validation failed:\n${errorMessages.join('\n')}\n\n` +
        'Please ensure all required environment variables are set in your .env file.'
      );
    }

    this.config = {
      VITE_SUPABASE_URL: import.meta.env.VITE_SUPABASE_URL,
      VITE_SUPABASE_ANON_KEY: import.meta.env.VITE_SUPABASE_ANON_KEY
    };

    this.validated = true;

    return this.config;
  }

  isProduction(): boolean {
    return import.meta.env.PROD;
  }

  isDevelopment(): boolean {
    return import.meta.env.DEV;
  }

  getConfig(): EnvConfig | null {
    return this.config;
  }
}

export const envValidator = new EnvironmentValidator();

export function validateEnvironment(): EnvConfig {
  return envValidator.validate();
}
