// Environment utility functions for safe access to environment variables
export class EnvironmentConfig {
  private static getEnvVar(key: string, defaultValue: string = ''): string {
    try {
      // Check if we're in a browser environment
      if (typeof window !== 'undefined') {
        // In browser, check for injected environment variables
        if (typeof process !== 'undefined' && process.env) {
          return process.env[key] || defaultValue;
        }
        // Fallback to window globals (some build systems inject vars this way)
        const windowEnv = (window as any).__ENV__;
        if (windowEnv && windowEnv[key]) {
          return windowEnv[key];
        }
        return defaultValue;
      }
      
      // In Node.js environment (SSR, build time)
      if (typeof process !== 'undefined' && process.env) {
        return process.env[key] || defaultValue;
      }
      
      return defaultValue;
    } catch (error) {
      console.warn(`Failed to access environment variable ${key}:`, error);
      return defaultValue;
    }
  }

  static get isDevelopment(): boolean {
    const nodeEnv = this.getEnvVar('NODE_ENV', 'development');
    const reactEnv = this.getEnvVar('REACT_APP_ENVIRONMENT', 'development');
    
    // Default to development if we can't determine the environment
    return nodeEnv === 'development' || reactEnv === 'development' || (!nodeEnv && !reactEnv);
  }

  static get isProduction(): boolean {
    const nodeEnv = this.getEnvVar('NODE_ENV', '');
    const reactEnv = this.getEnvVar('REACT_APP_ENVIRONMENT', '');
    
    return nodeEnv === 'production' || reactEnv === 'production';
  }

  static get useBackend(): boolean {
    const useBackendVar = this.getEnvVar('REACT_APP_USE_BACKEND', 'false');
    return useBackendVar.toLowerCase() === 'true';
  }

  static get apiUrl(): string {
    return this.getEnvVar('REACT_APP_API_URL', 'http://localhost:8000/api');
  }

  static get jwtSecret(): string {
    return this.getEnvVar('REACT_APP_JWT_SECRET', 'default-dev-secret');
  }

  static get maxFileSize(): string {
    return this.getEnvVar('REACT_APP_MAX_FILE_SIZE', '50MB');
  }

  static get allowedFileTypes(): string {
    return this.getEnvVar('REACT_APP_ALLOWED_FILE_TYPES', '.csv,.xlsx,.xls');
  }

  static get enableBetaFeatures(): boolean {
    const enableBeta = this.getEnvVar('REACT_APP_ENABLE_BETA_FEATURES', 'false');
    return enableBeta.toLowerCase() === 'true';
  }

  static get enableAnalytics(): boolean {
    const enableAnalytics = this.getEnvVar('REACT_APP_ENABLE_ANALYTICS', 'true');
    return enableAnalytics.toLowerCase() === 'true';
  }

  static get websocketUrl(): string {
    return this.getEnvVar('REACT_APP_WEBSOCKET_URL', 'ws://localhost:8000/ws');
  }

  // Helper method to get all environment configuration
  static getConfig() {
    return {
      isDevelopment: this.isDevelopment,
      isProduction: this.isProduction,
      useBackend: this.useBackend,
      apiUrl: this.apiUrl,
      jwtSecret: this.jwtSecret,
      maxFileSize: this.maxFileSize,
      allowedFileTypes: this.allowedFileTypes,
      enableBetaFeatures: this.enableBetaFeatures,
      enableAnalytics: this.enableAnalytics,
      websocketUrl: this.websocketUrl
    };
  }

  // Debug method to log current environment configuration
  static debugConfig() {
    if (this.isDevelopment) {
      console.log('Environment Configuration:', this.getConfig());
    }
  }
}

// Convenience exports
export const env = EnvironmentConfig;
export const isDevelopment = EnvironmentConfig.isDevelopment;
export const isProduction = EnvironmentConfig.isProduction;
export const useBackend = EnvironmentConfig.useBackend;