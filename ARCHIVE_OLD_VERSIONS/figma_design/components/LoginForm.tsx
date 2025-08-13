import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Alert, AlertDescription } from './ui/alert';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  ArrowRight,
  CheckCircle,
  TrendingUp,
  BarChart3,
  Package,
  Zap,
  Shield,
  Users,
  Globe,
  Activity,
  Calculator
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

export function LoginForm() {
  const { login, loading, error } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [selectedRole, setSelectedRole] = useState<'merchant' | 'analyst' | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    
    try {
      await login(email, password, selectedRole || 'merchant');
    } catch (err) {
      // Error is handled by the useAuth hook
    }
  };

  const demoCredentials = {
    merchant: { email: 'merchant@demo.com', password: 'demo123' },
    analyst: { email: 'analyst@demo.com', password: 'demo123' }
  };

  const handleDemoLogin = (role: 'merchant' | 'analyst') => {
    setEmail(demoCredentials[role].email);
    setPassword(demoCredentials[role].password);
    setSelectedRole(role);
  };

  const userTypes = [
    {
      type: 'merchant' as const,
      title: 'Merchant / 3PL',
      description: 'Optimize your shipping operations and costs',
      features: ['Rate Analysis', 'Cost Optimization', 'Carrier Management', 'Performance Tracking'],
      icon: Package,
      color: 'blue'
    },
    {
      type: 'analyst' as const,
      title: 'Rate Analyst',
      description: 'Advanced analytics and client consulting',
      features: ['Client Analytics', 'Custom Reports', 'Data Insights', 'Consulting Tools'],
      icon: BarChart3,
      color: 'purple'
    }
  ];

  return (
    <div className="min-h-screen bg-white flex">
      {/* Left Panel - Brand & Features */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-gray-900 to-gray-800 text-white p-12 flex-col justify-between relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-20 left-20 w-32 h-32 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-40 right-20 w-48 h-48 bg-blue-400 rounded-full blur-3xl"></div>
        </div>

        <div className="relative z-10">
          {/* Logo & Brand */}
          <div className="flex items-center space-x-4 mb-12">
            <div className="bg-white w-12 h-12 rounded-lg flex items-center justify-center shadow-lg">
              <svg className="w-6 h-6" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
                <g>
                  <path d="M3.9993 8.00049H0V20.0019H11.9997V16.0008H3.9993V8.00049Z" fill="#1f2937" />
                  <path d="M3.9993 0L0 4.00104H16.0007V20.0017L20 16.0007V0H3.9993Z" fill="#1f2937" />
                </g>
              </svg>
            </div>
            <div>
              <h1 className="text-2xl font-bold">Labl IQ</h1>
              <p className="text-blue-200">Your shipping intelligence platform</p>
            </div>
          </div>

          {/* Value Proposition */}
          <div className="mb-12">
            <h2 className="text-3xl font-bold mb-4 leading-tight">
              Advanced rate analysis and{' '}
              <span className="text-blue-400">shipping optimization</span>
            </h2>
            <p className="text-lg text-gray-300 leading-relaxed">
              Comprehensive shipping intelligence with AI-powered analytics, 
              rate optimization, and data-driven insights for logistics professionals.
            </p>
          </div>

          {/* Key Features */}
          <div className="grid grid-cols-2 gap-6">
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center">
                <Calculator className="w-4 h-4 text-blue-400" />
              </div>
              <div>
                <h3 className="font-semibold mb-1">Rate Analysis</h3>
                <p className="text-sm text-gray-400">Compare carriers and optimize shipping costs</p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-4 h-4 text-green-400" />
              </div>
              <div>
                <h3 className="font-semibold mb-1">Smart Analytics</h3>
                <p className="text-sm text-gray-400">AI-powered insights and recommendations</p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-purple-500/20 rounded-lg flex items-center justify-center">
                <BarChart3 className="w-4 h-4 text-purple-400" />
              </div>
              <div>
                <h3 className="font-semibold mb-1">Advanced Reports</h3>
                <p className="text-sm text-gray-400">Branded reports and client analytics</p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-orange-500/20 rounded-lg flex items-center justify-center">
                <Shield className="w-4 h-4 text-orange-400" />
              </div>
              <div>
                <h3 className="font-semibold mb-1">Enterprise Grade</h3>
                <p className="text-sm text-gray-400">Secure, scalable, and reliable platform</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Stats */}
        <div className="relative z-10">
          <div className="flex items-center space-x-8 text-sm">
            <div>
              <div className="text-xl font-bold text-blue-400">500K+</div>
              <div className="text-gray-400">Shipments Analyzed</div>
            </div>
            <div>
              <div className="text-xl font-bold text-green-400">$2.5M+</div>
              <div className="text-gray-400">Costs Saved</div>
            </div>
            <div>
              <div className="text-xl font-bold text-purple-400">1000+</div>
              <div className="text-gray-400">Active Users</div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel - Login */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md space-y-8">
          {/* Mobile Header */}
          <div className="lg:hidden text-center">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <div className="bg-gray-900 w-10 h-10 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
                  <g>
                    <path d="M3.9993 8.00049H0V20.0019H11.9997V16.0008H3.9993V8.00049Z" fill="white" />
                    <path d="M3.9993 0L0 4.00104H16.0007V20.0017L20 16.0007V0H3.9993Z" fill="white" />
                  </g>
                </svg>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Labl IQ</h1>
                <p className="text-sm text-gray-600">Your shipping intelligence platform</p>
              </div>
            </div>
          </div>

          {/* User Type Selection */}
          {!selectedRole && (
            <div className="space-y-6">
              <div className="text-center">
                <h2 className="text-2xl font-semibold text-gray-900 mb-2">Welcome to Labl IQ</h2>
                <p className="text-gray-600">Choose your account type to continue</p>
              </div>

              <div className="space-y-3">
                {userTypes.map((userType) => (
                  <Card 
                    key={userType.type}
                    className="cursor-pointer transition-all duration-200 hover:shadow-lg border-2 hover:border-blue-200 group"
                    onClick={() => setSelectedRole(userType.type)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-4">
                        <div className={`w-10 h-10 bg-${userType.color}-100 rounded-lg flex items-center justify-center group-hover:bg-${userType.color}-200 transition-colors`}>
                          <userType.icon className={`w-5 h-5 text-${userType.color}-600`} />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900">{userType.title}</h3>
                          <p className="text-sm text-gray-600 mb-2">{userType.description}</p>
                          <div className="flex flex-wrap gap-1">
                            {userType.features.slice(0, 2).map((feature, index) => (
                              <Badge key={index} variant="secondary" className="text-xs">
                                {feature}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <ArrowRight className={`w-4 h-4 text-${userType.color}-600 opacity-0 group-hover:opacity-100 transition-opacity`} />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Login Form */}
          {selectedRole && (
            <Card className="shadow-lg">
              <CardHeader className="text-center pb-4">
                <div className="flex items-center justify-center space-x-2 mb-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedRole(null)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    ← Back
                  </Button>
                  <Badge variant="outline" className="capitalize">
                    {selectedRole === 'merchant' ? 'Merchant/3PL' : 'Rate Analyst'}
                  </Badge>
                </div>
                <CardTitle className="text-xl">Sign in to Labl IQ</CardTitle>
                <CardDescription>
                  Access your shipping intelligence dashboard
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-4">
                {error && (
                  <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="pl-10"
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
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="pl-10 pr-10"
                        required
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-1 top-1/2 transform -translate-y-1/2 h-7 w-7 p-0"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </Button>
                    </div>
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full bg-black text-white hover:bg-gray-800"
                    disabled={loading}
                  >
                    {loading ? (
                      <div className="flex items-center space-x-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Signing in...</span>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-2">
                        <span>Sign in</span>
                        <ArrowRight className="w-4 h-4" />
                      </div>
                    )}
                  </Button>
                </form>

                <Separator />

                {/* Demo Access */}
                <div className="space-y-3">
                  <p className="text-sm text-gray-600 text-center">Try the demo</p>
                  <div className="flex space-x-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => handleDemoLogin('merchant')}
                      className="flex-1"
                      disabled={loading}
                    >
                      <Package className="w-3 h-3 mr-2" />
                      Merchant Demo
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => handleDemoLogin('analyst')}
                      className="flex-1"
                      disabled={loading}
                    >
                      <BarChart3 className="w-3 h-3 mr-2" />
                      Analyst Demo
                    </Button>
                  </div>
                </div>

                {/* Platform Features */}
                <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-2 mb-3">
                    <Activity className="w-4 h-4 text-blue-500" />
                    <span className="text-sm font-medium text-gray-700">Platform Features</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
                    <div className="flex items-center space-x-1">
                      <CheckCircle className="w-3 h-3 text-green-500" />
                      <span>Rate Analysis</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <CheckCircle className="w-3 h-3 text-green-500" />
                      <span>Cost Optimization</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <CheckCircle className="w-3 h-3 text-green-500" />
                      <span>Smart Analytics</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <CheckCircle className="w-3 h-3 text-green-500" />
                      <span>Custom Reports</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Footer */}
          <div className="text-center text-sm text-gray-500">
            <p>© 2025 Labl IQ. Your shipping intelligence platform.</p>
            <div className="flex items-center justify-center space-x-4 mt-2">
              <a href="#" className="hover:text-gray-700">Privacy</a>
              <a href="#" className="hover:text-gray-700">Terms</a>
              <a href="#" className="hover:text-gray-700">Support</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}