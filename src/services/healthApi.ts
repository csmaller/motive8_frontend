const API_BASE_URL = 'http://127.0.0.1:8000/api';

export interface HealthStatus {
  status: 'healthy' | 'unhealthy';
  timestamp: string;
  version?: string;
  uptime?: number;
  database?: 'connected' | 'disconnected';
  services?: Record<string, 'up' | 'down'>;
  latency?: number;
  error?: string;
  connectionError?: string;
}

export const healthApi = {
  checkHealth: async (): Promise<HealthStatus> => {
    try {
      const response = await fetch(`${API_BASE_URL}/health`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        // Add timeout to prevent hanging
        signal: AbortSignal.timeout(5000), // 5 second timeout
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      return {
        status: 'healthy',
        timestamp: new Date().toISOString(),
        ...data
      };
    } catch (error) {
      console.error('Health check failed:', error);
      return {
        status: 'unhealthy',
        timestamp: new Date().toISOString(),
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  },

  // Test connectivity to the API base URL
  testConnection: async (): Promise<{ connected: boolean; latency?: number; error?: string }> => {
    const startTime = Date.now();
    
    try {
      const response = await fetch(`${API_BASE_URL}/health`, {
        method: 'HEAD', // Use HEAD for lighter request
        signal: AbortSignal.timeout(3000), // 3 second timeout
      });

      const latency = Date.now() - startTime;

      return {
        connected: response.ok,
        latency,
        error: response.ok ? undefined : `HTTP ${response.status}`
      };
    } catch (error) {
      const latency = Date.now() - startTime;
      return {
        connected: false,
        latency,
        error: error instanceof Error ? error.message : 'Connection failed'
      };
    }
  }
};