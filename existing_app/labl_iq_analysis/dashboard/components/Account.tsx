import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Switch } from './ui/switch';
import { Textarea } from './ui/textarea';
import { 
  User, 
  Mail, 
  Phone, 
  Building, 
  CreditCard, 
  Bell, 
  Shield, 
  Key,
  Users,
  Settings,
  Download,
  Upload,
  Trash2,
  Edit,
  Plus,
  CheckCircle,
  AlertCircle,
  Crown,
  Zap,
  Copy
} from 'lucide-react';

const teamMembers = [
  {
    id: 1,
    name: 'John Smith',
    email: 'john.smith@company.com',
    role: 'Admin',
    lastActive: '2025-07-01',
    avatar: 'JS',
    status: 'active'
  },
  {
    id: 2,
    name: 'Sarah Johnson',
    email: 'sarah.johnson@company.com',
    role: 'Analyst',
    lastActive: '2025-06-30',
    avatar: 'SJ',
    status: 'active'
  },
  {
    id: 3,
    name: 'Mike Wilson',
    email: 'mike.wilson@company.com',
    role: 'Viewer',
    lastActive: '2025-06-28',
    avatar: 'MW',
    status: 'pending'
  }
];

const billingHistory = [
  { date: '2025-07-01', amount: 299, description: 'Monthly Subscription - Pro Plan', status: 'paid' },
  { date: '2025-06-01', amount: 299, description: 'Monthly Subscription - Pro Plan', status: 'paid' },
  { date: '2025-05-01', amount: 299, description: 'Monthly Subscription - Pro Plan', status: 'paid' },
  { date: '2025-04-01', amount: 299, description: 'Monthly Subscription - Pro Plan', status: 'paid' },
  { date: '2025-03-01', amount: 299, description: 'Monthly Subscription - Pro Plan', status: 'paid' }
];

export function Account() {
  const [notifications, setNotifications] = useState({
    emailReports: true,
    slackAlerts: false,
    smsUpdates: false,
    weeklyDigest: true,
    savingsAlerts: true,
    systemMaintenance: true
  });

  const [apiKeys, setApiKeys] = useState([
    { id: 1, name: 'Production API', key: 'lbl_prod_••••••••••••4f2a', created: '2025-06-01', lastUsed: '2025-07-01' },
    { id: 2, name: 'Development API', key: 'lbl_dev_••••••••••••8b1c', created: '2025-05-15', lastUsed: '2025-06-28' }
  ]);

  return (
    <div className="space-y-8">
      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="grid w-full grid-cols-6 bg-gray-100">
          <TabsTrigger value="profile" className="data-[state=active]:bg-white">Profile</TabsTrigger>
          <TabsTrigger value="team" className="data-[state=active]:bg-white">Team</TabsTrigger>
          <TabsTrigger value="billing" className="data-[state=active]:bg-white">Billing</TabsTrigger>
          <TabsTrigger value="notifications" className="data-[state=active]:bg-white">Notifications</TabsTrigger>
          <TabsTrigger value="security" className="data-[state=active]:bg-white">Security</TabsTrigger>
          <TabsTrigger value="api" className="data-[state=active]:bg-white">API</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="shadow-sm hover-lift bg-white">
              <CardHeader>
                <CardTitle className="text-xl font-medium text-black">Profile Picture</CardTitle>
                <CardDescription className="text-gray-600">
                  Update your profile photo
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center space-y-4">
                <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                  <User className="w-12 h-12 text-blue-600" />
                </div>
                <div className="space-y-2">
                  <Button variant="outline" size="sm">
                    <Upload className="w-4 h-4 mr-2" />
                    Upload New Photo
                  </Button>
                  <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
                    <Trash2 className="w-4 h-4 mr-2" />
                    Remove Photo
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="lg:col-span-2 shadow-sm hover-lift bg-white">
              <CardHeader>
                <CardTitle className="text-xl font-medium text-black">Personal Information</CardTitle>
                <CardDescription className="text-gray-600">
                  Update your personal details and contact information
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="first-name">First Name</Label>
                    <Input
                      id="first-name"
                      defaultValue="John"
                      className="bg-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="last-name">Last Name</Label>
                    <Input
                      id="last-name"
                      defaultValue="Smith"
                      className="bg-white"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    defaultValue="john.smith@company.com"
                    className="bg-white"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      defaultValue="+1 (555) 123-4567"
                      className="bg-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="timezone">Timezone</Label>
                    <Select defaultValue="est">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="est">Eastern Time (EST)</SelectItem>
                        <SelectItem value="cst">Central Time (CST)</SelectItem>
                        <SelectItem value="mst">Mountain Time (MST)</SelectItem>
                        <SelectItem value="pst">Pacific Time (PST)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button className="bg-black text-white hover:bg-gray-800">
                    Save Changes
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="shadow-sm hover-lift bg-white">
            <CardHeader>
              <CardTitle className="text-xl font-medium text-black">Company Information</CardTitle>
              <CardDescription className="text-gray-600">
                Update your company details and shipping addresses
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="company-name">Company Name</Label>
                  <Input
                    id="company-name"
                    defaultValue="Acme Corporation"
                    className="bg-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="industry">Industry</Label>
                  <Select defaultValue="ecommerce">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ecommerce">E-commerce</SelectItem>
                      <SelectItem value="manufacturing">Manufacturing</SelectItem>
                      <SelectItem value="retail">Retail</SelectItem>
                      <SelectItem value="logistics">Logistics</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Company Address</Label>
                <Textarea
                  id="address"
                  defaultValue="123 Business Street, Suite 100, New York, NY 10001"
                  className="bg-white"
                  rows={3}
                />
              </div>

              <div className="flex justify-end">
                <Button className="bg-black text-white hover:bg-gray-800">
                  Update Company Info
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="team" className="space-y-6">
          <Card className="shadow-sm hover-lift bg-white">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-xl font-medium text-black">Team Members</CardTitle>
                  <CardDescription className="text-gray-600">
                    Manage your team access and permissions
                  </CardDescription>
                </div>
                <Button className="bg-black text-white hover:bg-gray-800">
                  <Plus className="w-4 h-4 mr-2" />
                  Invite Member
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {teamMembers.map((member) => (
                  <div
                    key={member.id}
                    className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium text-blue-600">{member.avatar}</span>
                      </div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <h4 className="font-medium text-black">{member.name}</h4>
                          {member.status === 'active' ? (
                            <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200">
                              <CheckCircle className="w-3 h-3 mr-1" />
                              Active
                            </Badge>
                          ) : (
                            <Badge className="bg-amber-50 text-amber-700 border-amber-200">
                              <AlertCircle className="w-3 h-3 mr-1" />
                              Pending
                            </Badge>
                          )}
                        </div>
                        <div className="text-sm text-gray-600">
                          {member.email} • {member.role} • Last active {member.lastActive}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button variant="ghost" size="sm">
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="billing" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="shadow-sm hover-lift bg-white">
              <CardHeader>
                <CardTitle className="text-xl font-medium text-black flex items-center">
                  <Crown className="w-6 h-6 mr-3 text-amber-600" />
                  Current Plan
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="text-2xl font-medium text-black">Pro Plan</div>
                  <div className="text-gray-600">$299/month</div>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-emerald-600" />
                    <span>Unlimited shipments</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-emerald-600" />
                    <span>Advanced analytics</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-emerald-600" />
                    <span>Team collaboration</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-emerald-600" />
                    <span>API access</span>
                  </div>
                </div>
                <Button variant="outline" className="w-full">
                  <Zap className="w-4 h-4 mr-2" />
                  Upgrade Plan
                </Button>
              </CardContent>
            </Card>

            <Card className="lg:col-span-2 shadow-sm hover-lift bg-white">
              <CardHeader>
                <CardTitle className="text-xl font-medium text-black">Payment Method</CardTitle>
                <CardDescription className="text-gray-600">
                  Manage your billing information
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <CreditCard className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <div className="font-medium text-black">•••• •••• •••• 4242</div>
                      <div className="text-sm text-gray-600">Expires 12/2027</div>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    <Edit className="w-4 h-4 mr-2" />
                    Edit
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="billing-email">Billing Email</Label>
                    <Input
                      id="billing-email"
                      defaultValue="billing@company.com"
                      className="bg-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="tax-id">Tax ID</Label>
                    <Input
                      id="tax-id"
                      defaultValue="12-3456789"
                      className="bg-white"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="billing-address">Billing Address</Label>
                  <Textarea
                    id="billing-address"
                    defaultValue="123 Business Street, Suite 100, New York, NY 10001"
                    className="bg-white"
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="shadow-sm hover-lift bg-white">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-xl font-medium text-black">Billing History</CardTitle>
                  <CardDescription className="text-gray-600">
                    View and download your past invoices
                  </CardDescription>
                </div>
                <Button variant="outline" size="sm">
                  <Download className="w-4 h-4 mr-2" />
                  Download All
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {billingHistory.map((bill, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                        <CheckCircle className="w-5 h-5 text-emerald-600" />
                      </div>
                      <div>
                        <div className="font-medium text-black">{bill.description}</div>
                        <div className="text-sm text-gray-600">{bill.date}</div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-lg font-medium text-black">${bill.amount}</div>
                      <Button variant="ghost" size="sm">
                        <Download className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          <Card className="shadow-sm hover-lift bg-white">
            <CardHeader>
              <CardTitle className="text-xl font-medium text-black">Notification Preferences</CardTitle>
              <CardDescription className="text-gray-600">
                Choose how you want to receive notifications and updates
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-black">Email Reports</div>
                    <div className="text-sm text-gray-600">Receive weekly summary reports via email</div>
                  </div>
                  <Switch
                    checked={notifications.emailReports}
                    onCheckedChange={(checked) => setNotifications({...notifications, emailReports: checked})}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-black">Slack Alerts</div>
                    <div className="text-sm text-gray-600">Get real-time alerts in your Slack workspace</div>
                  </div>
                  <Switch
                    checked={notifications.slackAlerts}
                    onCheckedChange={(checked) => setNotifications({...notifications, slackAlerts: checked})}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-black">SMS Updates</div>
                    <div className="text-sm text-gray-600">Receive critical updates via text message</div>
                  </div>
                  <Switch
                    checked={notifications.smsUpdates}
                    onCheckedChange={(checked) => setNotifications({...notifications, smsUpdates: checked})}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-black">Weekly Digest</div>
                    <div className="text-sm text-gray-600">Weekly summary of your shipping analytics</div>
                  </div>
                  <Switch
                    checked={notifications.weeklyDigest}
                    onCheckedChange={(checked) => setNotifications({...notifications, weeklyDigest: checked})}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-black">Savings Alerts</div>
                    <div className="text-sm text-gray-600">Get notified when significant savings are found</div>
                  </div>
                  <Switch
                    checked={notifications.savingsAlerts}
                    onCheckedChange={(checked) => setNotifications({...notifications, savingsAlerts: checked})}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-black">System Maintenance</div>
                    <div className="text-sm text-gray-600">Important system updates and maintenance notices</div>
                  </div>
                  <Switch
                    checked={notifications.systemMaintenance}
                    onCheckedChange={(checked) => setNotifications({...notifications, systemMaintenance: checked})}
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <Button className="bg-black text-white hover:bg-gray-800">
                  Save Preferences
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          <Card className="shadow-sm hover-lift bg-white">
            <CardHeader>
              <CardTitle className="text-xl font-medium text-black">Security Settings</CardTitle>
              <CardDescription className="text-gray-600">
                Manage your account security and authentication
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-black">Password</div>
                      <div className="text-sm text-gray-600">Last changed 3 months ago</div>
                    </div>
                    <Button variant="outline" size="sm">
                      <Key className="w-4 h-4 mr-2" />
                      Change Password
                    </Button>
                  </div>
                </div>

                <div className="p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-black">Two-Factor Authentication</div>
                      <div className="text-sm text-gray-600">Add an extra layer of security to your account</div>
                    </div>
                    <Button className="bg-black text-white hover:bg-gray-800">
                      <Shield className="w-4 h-4 mr-2" />
                      Enable 2FA
                    </Button>
                  </div>
                </div>

                <div className="p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-black">Login Sessions</div>
                      <div className="text-sm text-gray-600">2 active sessions</div>
                    </div>
                    <Button variant="outline" size="sm">
                      <Settings className="w-4 h-4 mr-2" />
                      Manage Sessions
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="api" className="space-y-6">
          <Card className="shadow-sm hover-lift bg-white">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-xl font-medium text-black">API Keys</CardTitle>
                  <CardDescription className="text-gray-600">
                    Manage your API keys for integrations
                  </CardDescription>
                </div>
                <Button className="bg-black text-white hover:bg-gray-800">
                  <Plus className="w-4 h-4 mr-2" />
                  Create API Key
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {apiKeys.map((key) => (
                  <div
                    key={key.id}
                    className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors"
                  >
                    <div>
                      <div className="font-medium text-black">{key.name}</div>
                      <div className="text-sm text-gray-600 font-mono">{key.key}</div>
                      <div className="text-xs text-gray-500">
                        Created {key.created} • Last used {key.lastUsed}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button variant="ghost" size="sm">
                        <Copy className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}