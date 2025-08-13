import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Alert, AlertDescription } from './ui/alert';
import { Badge } from './ui/badge';
import { useAuth } from '../hooks/useAuth';
import { Mail, Lock, Eye, EyeOff, AlertCircle, Info, CheckCircle, Settings } from 'lucide-react';
import { env } from '../utils/env';

export function LoginForm() {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    company: ''
  });
  
  const { login, register, loading, error, clearError } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();

    try {
      if (isLogin) {
        await login(formData.email, formData.password);
      } else {
        await register(formData);
      }
    } catch (err) {
      // Error is already handled by the auth hook
      console.error('Authentication error:', err);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleDemoLogin = async () => {
    clearError();
    setFormData({
      name: 'Demo User',
      email: 'demo@labl.com',
      password: 'demo123',
      company: 'Demo Company'
    });
    
    try {
      await login('demo@labl.com', 'demo123');
    } catch (err) {
      console.error('Demo login error:', err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Development Mode Status */}
        {env.isDevelopment && (
          <div className="mb-4">
            <Alert className="border-blue-200 bg-blue-50">
              <Settings className="h-4 w-4 text-blue-600" />
              <AlertDescription className="text-blue-800">
                <div className="flex items-center justify-between">
                  <span>Development Mode</span>
                  <Badge variant={env.useBackend ? "default" : "secondary"} className="ml-2">
                    {env.useBackend ? "Backend Connected" : "Mock Mode"}
                  </Badge>
                </div>
              </AlertDescription>
            </Alert>
          </div>
        )}

        {/* Logo */}
        <div className="text-center mb-8">
          <div className="bg-[#222530] w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8"
              fill="none"
              preserveAspectRatio="none"
              viewBox="0 0 20 20"
            >
              <g>
                <path
                  d="M3.9993 8.00049H0V20.0019H11.9997V16.0008H3.9993V8.00049Z"
                  fill="white"
                />
                <path
                  d="M3.9993 0L0 4.00104H16.0007V20.0017L20 16.0007V0H3.9993Z"
                  fill="white"
                />
              </g>
            </svg>
          </div>
          <h1 className="text-2xl font-medium text-black">labl IQ Rate Analyzer</h1>
          <p className="text-gray-600 mt-2">Shipping Optimization Platform</p>
        </div>

        <Card className="shadow-lg">
          <CardHeader className="text-center">
            <CardTitle>{isLogin ? 'Sign In' : 'Create Account'}</CardTitle>
            <CardDescription>
              {isLogin 
                ? 'Enter your credentials to access your dashboard' 
                : 'Get started with your shipping optimization journey'
              }
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLogin && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      name="name"
                      type="text"
                      placeholder="Enter your full name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="company">Company (Optional)</Label>
                    <Input
                      id="company"
                      name="company"
                      type="text"
                      placeholder="Your company name"
                      value={formData.company}
                      onChange={handleInputChange}
                    />
                  </div>
                </>
              )}

              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="Enter your email"
                    className="pl-10"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    className="pl-10 pr-10"
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {error && (
                <Alert className="border-red-200 bg-red-50">
                  <AlertCircle className="h-4 w-4 text-red-600" />
                  <AlertDescription className="text-red-600">
                    {error}
                  </AlertDescription>
                </Alert>
              )}

              <Button 
                type="submit" 
                className="w-full bg-black text-white hover:bg-gray-800"
                disabled={loading}
              >
                {loading ? 'Please wait...' : (isLogin ? 'Sign In' : 'Create Account')}
              </Button>
            </form>

            {/* Demo Login Button for Development */}
            {env.isDevelopment && !env.useBackend && isLogin && (
              <div className="mt-4">
                <Button 
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={handleDemoLogin}
                  disabled={loading}
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Quick Demo Login
                </Button>
              </div>
            )}

            <div className="mt-6 text-center">
              <button
                type="button"
                onClick={() => {
                  setIsLogin(!isLogin);
                  clearError();
                  setFormData({
                    name: '',
                    email: '',
                    password: '',
                    company: ''
                  });
                }}
                className="text-sm text-gray-600 hover:text-black"
              >
                {isLogin 
                  ? "Don't have an account? Sign up" 
                  : "Already have an account? Sign in"
                }
              </button>
            </div>
          </CardContent>
        </Card>

        {/* Development Instructions */}
        {env.isDevelopment && !env.useBackend && (
          <Card className="mt-4 border-green-200 bg-green-50">
            <CardContent className="p-4">
              <div className="flex items-start space-x-3">
                <Info className="w-5 h-5 text-green-600 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-green-800 mb-2">Development Mode Active</p>
                  <p className="text-xs text-green-700 mb-2">
                    You can login with any email address and password, or use the demo login button.
                  </p>
                  <p className="text-xs text-green-600">
                    To connect to a real backend, set <code className="bg-green-100 px-1 rounded">REACT_APP_USE_BACKEND=true</code> in your .env file.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Backend Connection Instructions */}
        {env.isDevelopment && env.useBackend && (
          <Card className="mt-4 border-amber-200 bg-amber-50">
            <CardContent className="p-4">
              <div className="flex items-start space-x-3">
                <Settings className="w-5 h-5 text-amber-600 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-amber-800 mb-2">Backend Mode</p>
                  <p className="text-xs text-amber-700 mb-2">
                    Make sure your FastAPI backend is running on <code className="bg-amber-100 px-1 rounded">{env.apiUrl.replace('/api', '')}</code>
                  </p>
                  <p className="text-xs text-amber-600">
                    If the backend is not running, switch to mock mode by removing <code className="bg-amber-100 px-1 rounded">REACT_APP_USE_BACKEND</code> from your .env file.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}