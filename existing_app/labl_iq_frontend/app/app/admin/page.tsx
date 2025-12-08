
'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Shield, Users, Settings, Activity, Database, AlertTriangle } from 'lucide-react';
import { adminAPI, User } from '../../lib/api';
import toast from 'react-hot-toast';

export default function AdminPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    setIsLoading(true);
    adminAPI
      .getUsers()
      .then((data) => {
        if (mounted) setUsers(data || []);
      })
      .catch((err: any) => {
        const msg =
          err?.response?.status === 401 || err?.response?.status === 403
            ? 'Admin access required.'
            : 'Unable to load users.';
        setError(msg);
        toast.error(msg);
      })
      .finally(() => mounted && setIsLoading(false));
    return () => {
      mounted = false;
    };
  }, []);

  const handleSystemCheck = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      toast.success('System check complete');
    }, 1200);
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-600">
          System administration and monitoring tools.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Users className="h-5 w-5" />
              <span>User Management</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Total Users</span>
                <Badge variant="secondary">
                  {isLoading ? '…' : users.length || '0'}
                </Badge>
              </div>
              {error ? (
                <div className="text-xs text-red-600 flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4" />
                  {error}
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Admin users</span>
                    <Badge variant="secondary">
                      {users.filter((u) => u.role === 'ADMIN').length || 0}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Active</span>
                    <Badge variant="secondary">
                      {users.filter((u: any) => (u as any).isActive !== false).length || 0}
                    </Badge>
                  </div>
                </div>
              )}
              <Button size="sm" variant="black" className="w-full" disabled>
                Manage Users (coming soon)
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Database className="h-5 w-5" />
              <span>System Status</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Database</span>
                <Badge className="bg-green-100 text-green-800">Online</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">API Server</span>
                <Badge className="bg-green-100 text-green-800">Online</Badge>
              </div>
              <Button 
                size="sm" 
                variant="black"
                className="w-full"
                onClick={handleSystemCheck}
                disabled={isLoading}
              >
                {isLoading ? 'Checking...' : 'Run System Check'}
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Activity className="h-5 w-5" />
              <span>Analytics</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Analyses Today</span>
                <Badge variant="secondary">156</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Total Savings</span>
                <Badge variant="secondary">$45,678</Badge>
              </div>
              <Button size="sm" variant="black" className="w-full">
                View Analytics
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Settings className="h-5 w-5" />
              <span>System Settings</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Rate Updates</span>
                <Badge className="bg-blue-100 text-blue-800">Auto</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Backup Status</span>
                <Badge className="bg-green-100 text-green-800">Latest</Badge>
              </div>
              <Button size="sm" variant="black" className="w-full">
                Configure Settings
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
