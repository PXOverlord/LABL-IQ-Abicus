
'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Sidebar } from '../../components/layout/sidebar';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Settings, User, DollarSign, Save } from 'lucide-react';
import { useAuthStore } from '../../lib/stores/auth-store';
import toast from 'react-hot-toast';

export default function SettingsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { user, updateSettings, fetchUser } = useAuthStore();

  const [formData, setFormData] = useState({
    originZip: '',
    defaultMarkup: 0,
    defaultSurcharge: 0,
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (status === 'loading') return;
    if (!session) {
      router.push('/login');
      return;
    }
    fetchUser();
  }, [session, status, router, fetchUser]);

  useEffect(() => {
    if (user) {
      setFormData({
        originZip: user.originZip || '',
        defaultMarkup: user.defaultMarkup || 0,
        defaultSurcharge: user.defaultSurcharge || 0,
      });
    }
  }, [user]);

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await updateSettings(formData);
      toast.success('Settings updated successfully!');
    } catch (error) {
      toast.error('Failed to update settings');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto p-6">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
            <p className="text-gray-600">
              Manage your account preferences and default rate analysis settings.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Account Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <User className="h-5 w-5" />
                  <span>Account Information</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Email Address</Label>
                  <Input
                    type="email"
                    value={user?.email || ''}
                    disabled
                    className="bg-gray-50"
                  />
                  <p className="text-xs text-gray-500">
                    Email cannot be changed
                  </p>
                </div>

                <div className="space-y-2">
                  <Label>Role</Label>
                  <Input
                    value={user?.role?.toLowerCase() || ''}
                    disabled
                    className="bg-gray-50 capitalize"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Default Rate Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <DollarSign className="h-5 w-5" />
                  <span>Default Rate Settings</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="originZip">Default Origin ZIP Code</Label>
                    <Input
                      id="originZip"
                      type="text"
                      value={formData.originZip}
                      onChange={(e) => handleInputChange('originZip', e.target.value)}
                      placeholder="Enter your primary origin ZIP"
                      maxLength={5}
                    />
                    <p className="text-xs text-gray-500">
                      This will be pre-filled in new analyses
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="defaultMarkup">Default Markup (%)</Label>
                    <Input
                      id="defaultMarkup"
                      type="number"
                      value={formData.defaultMarkup}
                      onChange={(e) => handleInputChange('defaultMarkup', parseFloat(e.target.value) || 0)}
                      placeholder="0"
                      min="0"
                      max="100"
                      step="0.1"
                    />
                    <p className="text-xs text-gray-500">
                      Percentage markup to add to base rates
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="defaultSurcharge">Default Surcharge ($)</Label>
                    <Input
                      id="defaultSurcharge"
                      type="number"
                      value={formData.defaultSurcharge}
                      onChange={(e) => handleInputChange('defaultSurcharge', parseFloat(e.target.value) || 0)}
                      placeholder="0.00"
                      min="0"
                      step="0.01"
                    />
                    <p className="text-xs text-gray-500">
                      Fixed dollar amount to add per shipment
                    </p>
                  </div>

                  <Button
                    type="submit"
                    className="w-full"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4 mr-2" />
                        Save Settings
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Additional Settings */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Settings className="h-5 w-5" />
                <span>Preferences</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <h4 className="font-medium">Email Notifications</h4>
                    <p className="text-sm text-gray-600">
                      Receive email notifications when analyses are complete
                    </p>
                  </div>
                  <Button variant="outline" size="sm" disabled>
                    Coming Soon
                  </Button>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <h4 className="font-medium">API Access</h4>
                    <p className="text-sm text-gray-600">
                      Programmatic access to rate analysis features
                    </p>
                  </div>
                  <Button variant="outline" size="sm" disabled>
                    Coming Soon
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
