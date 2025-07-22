
'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { useAuth } from '@/hooks/useAuth';
import { User, Settings, LogOut, Mail, Shield } from 'lucide-react';

export function Account() {
  const { user, logout } = useAuth();

  return (
    <div className="space-y-8">
      {/* Profile Information */}
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <User className="w-5 h-5 text-blue-600" />
            <span>Profile Information</span>
          </CardTitle>
          <CardDescription>
            Manage your account details and preferences
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-blue-100 rounded-xl flex items-center justify-center">
              <User className="w-8 h-8 text-blue-600" />
            </div>
            <div>
              <h3 className="font-medium text-lg text-black">{user?.name || 'User'}</h3>
              <p className="text-gray-600">{user?.email}</p>
              <Badge variant="outline" className="mt-1 bg-green-50 text-green-700 border-green-200">
                <Shield className="w-3 h-3 mr-1" />
                {user?.role === 'admin' ? 'Administrator' : 'User'}
              </Badge>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                value={user?.name || ''}
                readOnly
                className="bg-gray-50"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                value={user?.email || ''}
                readOnly
                className="bg-gray-50"
              />
            </div>
          </div>

          <div className="flex items-center space-x-3 pt-4 border-t border-gray-200">
            <Button variant="outline" size="sm">
              <Settings className="w-4 h-4 mr-2" />
              Edit Profile
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={logout}
              className="text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Coming Soon Features */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg">Preferences</CardTitle>
            <CardDescription>
              Customize your experience and notifications
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-6">
              <Badge variant="secondary" className="bg-gray-50 text-gray-700 border-gray-200">
                Coming Soon
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg">Security</CardTitle>
            <CardDescription>
              Manage your account security settings
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-6">
              <Badge variant="secondary" className="bg-gray-50 text-gray-700 border-gray-200">
                Coming Soon
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
