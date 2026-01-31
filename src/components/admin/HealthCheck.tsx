import React, { useState, useEffect } from 'react';
import { healthApi, type HealthStatus } from '../../services/healthApi';
import { peopleApi } from '../../services/peopleApi';
import Card from '../ui/Card';
import Button from '../ui/Button';
import LoadingSpinner from '../ui/LoadingSpinner';

const HealthCheck: React.FC = () => {
  const [healthStatus, setHealthStatus] = useState<HealthStatus | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [lastChecked, setLastChecked] = useState<Date | null>(null);
  const [autoRefresh, setAutoRefresh] = useState(false);
  const [usersConnection, setUsersConnection] = useState<{
    connected: boolean;
    latency?: number;
    error?: string;
    count?: number;
  } | null>(null);

  const checkHealth = async () => {
    setIsLoading(true);
    try {
      const status = await healthApi.checkHealth();
      setHealthStatus(status);
      setLastChecked(new Date());
    } catch (error) {
      console.error('Health check error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const testPeopleConnection = async () => {
    setIsLoading(true);
    try {
      const result = await peopleApi.testConnection();
      setUsersConnection(result);
      setLastChecked(new Date());
    } catch (error) {
      console.error('People connection test error:', error);
      setUsersConnection({
        connected: false,
        error: 'Connection test failed'
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Auto-refresh every 30 seconds when enabled
  useEffect(() => {
    let interval: number;
    
    if (autoRefresh) {
      interval = setInterval(() => {
        checkHealth();
      }, 30000);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [autoRefresh]);

  // Initial health check on mount
  useEffect(() => {
    checkHealth();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy':
        return 'text-green-600';
      case 'unhealthy':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy':
        return (
          <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
        );
      case 'unhealthy':
        return (
          <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
        );
      default:
        return (
          <svg className="w-5 h-5 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
        );
    }
  };

  return (
    <Card>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">API Health Status</h3>
          <div className="flex items-center space-x-2">
            <label className="flex items-center space-x-2 text-sm">
              <input
                type="checkbox"
                checked={autoRefresh}
                onChange={(e) => setAutoRefresh(e.target.checked)}
                className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              />
              <span>Auto-refresh</span>
            </label>
          </div>
        </div>

        {/* Status Display */}
        <div className="flex items-center space-x-3">
          {isLoading ? (
            <LoadingSpinner size="sm" />
          ) : (
            healthStatus && getStatusIcon(healthStatus.status)
          )}
          <div>
            <div className="flex items-center space-x-2">
              <span className={`font-medium ${healthStatus ? getStatusColor(healthStatus.status) : 'text-gray-600'}`}>
                {healthStatus ? healthStatus.status.toUpperCase() : 'Unknown'}
              </span>
              {healthStatus?.latency && (
                <span className="text-sm text-gray-500">
                  ({healthStatus.latency}ms)
                </span>
              )}
            </div>
            {lastChecked && (
              <div className="text-xs text-gray-500">
                Last checked: {lastChecked.toLocaleTimeString()}
              </div>
            )}
          </div>
        </div>

        {/* API Endpoint */}
        <div className="text-sm text-gray-600">
          <strong>Endpoint:</strong> http://127.0.0.1:8000/api/health
        </div>

        {/* Error Display */}
        {healthStatus?.status === 'unhealthy' && (healthStatus as { error?: string }).error && (
          <div className="bg-red-50 border border-red-200 rounded-md p-3">
            <div className="text-sm text-red-800">
              <strong>Error:</strong> {(healthStatus as { error?: string }).error}
            </div>
          </div>
        )}

        {/* Additional Health Info */}
        {healthStatus?.status === 'healthy' && (
          <div className="grid grid-cols-2 gap-4 text-sm">
            {healthStatus.version && (
              <div>
                <span className="font-medium text-gray-700">Version:</span>
                <span className="ml-2 text-gray-600">{healthStatus.version}</span>
              </div>
            )}
            {healthStatus.uptime && (
              <div>
                <span className="font-medium text-gray-700">Uptime:</span>
                <span className="ml-2 text-gray-600">{Math.round(healthStatus.uptime / 60)} min</span>
              </div>
            )}
            {healthStatus.database && (
              <div>
                <span className="font-medium text-gray-700">Database:</span>
                <span className={`ml-2 ${healthStatus.database === 'connected' ? 'text-green-600' : 'text-red-600'}`}>
                  {healthStatus.database}
                </span>
              </div>
            )}
          </div>
        )}

        {/* People API Connection */}
        {usersConnection && (
          <div className="border-t pt-4 mt-4">
            <div className="flex items-center space-x-3 mb-2">
              {usersConnection.connected ? (
                <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg className="w-4 h-4 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              )}
              <div>
                <span className="text-sm font-medium text-gray-700">People API:</span>
                <span className={`ml-2 text-sm ${usersConnection.connected ? 'text-green-600' : 'text-red-600'}`}>
                  {usersConnection.connected ? 'Connected' : 'Disconnected'}
                </span>
                {usersConnection.latency && (
                  <span className="ml-2 text-sm text-gray-500">
                    ({usersConnection.latency}ms)
                  </span>
                )}
                {usersConnection.count !== undefined && (
                  <span className="ml-2 text-sm text-gray-500">
                    • {usersConnection.count} people
                  </span>
                )}
              </div>
            </div>
            {usersConnection.error && (
              <div className="text-sm text-red-600 ml-7">
                {usersConnection.error}
              </div>
            )}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex space-x-2 pt-2">
          <Button
            variant="outline"
            size="sm"
            onClick={checkHealth}
            loading={isLoading}
          >
            Check Health
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={testPeopleConnection}
            loading={isLoading}
          >
            Test People API
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default HealthCheck;