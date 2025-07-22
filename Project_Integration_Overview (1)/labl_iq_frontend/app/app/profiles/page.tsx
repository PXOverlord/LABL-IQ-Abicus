
'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Sidebar } from '../../components/layout/sidebar';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { BookOpen, Trash2, Plus, FileText } from 'lucide-react';
import { useProfilesStore } from '../../lib/stores/profiles-store';
import { format } from 'date-fns';
import toast from 'react-hot-toast';

export default function ProfilesPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { profiles, fetchProfiles, deleteProfile, isLoading } = useProfilesStore();

  useEffect(() => {
    if (status === 'loading') return;
    if (!session) {
      router.push('/login');
      return;
    }
    
    fetchProfiles().catch(() => {
      toast.error('Failed to load profiles');
    });
  }, [session, status, router, fetchProfiles]);

  const handleDeleteProfile = async (profileId: string) => {
    if (confirm('Are you sure you want to delete this profile?')) {
      try {
        await deleteProfile(profileId);
        toast.success('Profile deleted successfully');
      } catch (error) {
        toast.error('Failed to delete profile');
        console.error(error);
      }
    }
  };

  const handleCreateNew = () => {
    router.push('/dashboard');
    toast.success('Create a new column mapping in the dashboard and save it as a profile');
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
        <div className="max-w-7xl mx-auto p-6">
          <div className="mb-8 flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Column Profiles</h1>
              <p className="text-gray-600">
                Manage your saved column mapping configurations for quick reuse.
              </p>
            </div>
            <Button onClick={handleCreateNew}>
              <Plus className="h-4 w-4 mr-2" />
              Create New Profile
            </Button>
          </div>

          {isLoading ? (
            <Card>
              <CardContent className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </CardContent>
            </Card>
          ) : profiles.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-medium text-gray-900 mb-2">
                  No profiles saved yet
                </h3>
                <p className="text-gray-500 mb-6">
                  Create your first column mapping profile to save time on future analyses.
                </p>
                <Button onClick={handleCreateNew}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Your First Profile
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {profiles.map((profile) => (
                <Card key={profile.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <FileText className="h-5 w-5 text-primary" />
                        <span className="truncate">{profile.name}</span>
                      </div>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDeleteProfile(profile.id)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {profile.description && (
                        <p className="text-sm text-gray-600">
                          {profile.description}
                        </p>
                      )}
                      
                      <div className="space-y-2">
                        <h4 className="text-sm font-medium text-gray-900">
                          Mapped Fields:
                        </h4>
                        <div className="flex flex-wrap gap-1">
                          {Object.entries(profile.mapping).map(([key, value]) => {
                            if (value && typeof value === 'string') {
                              return (
                                <Badge key={key} variant="secondary" className="text-xs">
                                  {key}: {value}
                                </Badge>
                              );
                            }
                            return null;
                          })}
                        </div>
                      </div>
                      
                      <div className="pt-2 border-t text-xs text-gray-500">
                        Created {format(new Date(profile.createdAt), 'MMM dd, yyyy')}
                      </div>
                      
                      <Button
                        size="sm"
                        className="w-full"
                        onClick={() => {
                          router.push('/dashboard');
                          toast.success('Profile can be loaded in the column mapping section');
                        }}
                      >
                        Use Profile
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
