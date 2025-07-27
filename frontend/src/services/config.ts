/**
 * Configuration Service
 * Centralized configuration management using environment variables
 * Provides type-safe access to all application settings
 */

interface AppConfig {
  // API Configuration
  apiUrl: string;
  apiTimeout: number;

  // Application Settings
  appName: string;
  appVersion: string;
  environment: 'development' | 'production' | 'staging';

  // Feature Flags
  enableRegistration: boolean;
  enableGuestAccess: boolean;
  maxFileUploadSize: number;

  // Security Settings
  sessionTimeout: number;
  enable2FA: boolean;

  // UI Configuration
  theme: string;
  itemsPerPage: number;

  // External Services
  analyticsId?: string;
  sentryDsn?: string;
}

class ConfigService {
  private config: AppConfig;

  constructor() {
    this.config = this.loadConfig();
    this.validateConfig();
  }

  private loadConfig(): AppConfig {
    return {
      // API Configuration
      apiUrl: process.env.REACT_APP_API_URL || 'http://localhost:8000/api',
      apiTimeout: parseInt(process.env.REACT_APP_API_TIMEOUT || '10000'),

      // Application Settings
      appName: process.env.REACT_APP_APP_NAME || 'Library Management System',
      appVersion: process.env.REACT_APP_APP_VERSION || '1.0.0',
      environment: (process.env.REACT_APP_ENVIRONMENT as any) || 'development',

      // Feature Flags
      enableRegistration: process.env.REACT_APP_ENABLE_REGISTRATION === 'true',
      enableGuestAccess: process.env.REACT_APP_ENABLE_GUEST_ACCESS === 'true',
      maxFileUploadSize: parseInt(process.env.REACT_APP_MAX_FILE_UPLOAD_SIZE || '5242880'),

      // Security Settings
      sessionTimeout: parseInt(process.env.REACT_APP_SESSION_TIMEOUT || '3600000'),
      enable2FA: process.env.REACT_APP_ENABLE_2FA === 'true',

      // UI Configuration
      theme: process.env.REACT_APP_THEME || 'default',
      itemsPerPage: parseInt(process.env.REACT_APP_ITEMS_PER_PAGE || '20'),

      // External Services
      analyticsId: process.env.REACT_APP_ANALYTICS_ID,
      sentryDsn: process.env.REACT_APP_SENTRY_DSN,
    };
  }

  private validateConfig(): void {
    const requiredFields: (keyof AppConfig)[] = ['apiUrl', 'appName'];
    
    for (const field of requiredFields) {
      if (!this.config[field]) {
        throw new Error(`Missing required configuration: ${field}`);
      }
    }

    // Validate API URL format
    try {
      new URL(this.config.apiUrl);
    } catch {
      throw new Error(`Invalid API URL format: ${this.config.apiUrl}`);
    }
  }

  // Getters for type-safe access
  get api() {
    return {
      url: this.config.apiUrl,
      timeout: this.config.apiTimeout,
    };
  }

  get app() {
    return {
      name: this.config.appName,
      version: this.config.appVersion,
      environment: this.config.environment,
    };
  }

  get features() {
    return {
      enableRegistration: this.config.enableRegistration,
      enableGuestAccess: this.config.enableGuestAccess,
      maxFileUploadSize: this.config.maxFileUploadSize,
    };
  }

  get security() {
    return {
      sessionTimeout: this.config.sessionTimeout,
      enable2FA: this.config.enable2FA,
    };
  }

  get ui() {
    return {
      theme: this.config.theme,
      itemsPerPage: this.config.itemsPerPage,
    };
  }

  get external() {
    return {
      analyticsId: this.config.analyticsId,
      sentryDsn: this.config.sentryDsn,
    };
  }

  // Utility methods
  isDevelopment(): boolean {
    return this.config.environment === 'development';
  }

  isProduction(): boolean {
    return this.config.environment === 'production';
  }

  // Get all config (for debugging in development)
  getAllConfig(): AppConfig {
    if (this.isDevelopment()) {
      return { ...this.config };
    }
    throw new Error('Config access not allowed in production');
  }
}

// Export singleton instance
export const config = new ConfigService();
export default config;
