import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Separator } from './ui/separator';
import { 
  GripVertical,
  Plus,
  Trash2,
  Edit3,
  Save,
  X,
  Star,
  Bookmark,
  Package,
  Truck,
  BarChart3,
  FileText,
  Settings,
  Users,
  Globe,
  Calendar,
  Clock,
  Target,
  Zap,
  Shield,
  Bell,
  Search,
  Upload,
  Download,
  Eye,
  Heart,
  Home,
  Mail,
  Phone,
  MapPin,
  Archive,
  Folder,
  Tag,
  Flag,
  Briefcase,
  Building,
  User,
  CheckCircle,
  AlertTriangle,
  Info,
  HelpCircle,
  Camera,
  Image,
  Music,
  Video,
  Paperclip,
  Link,
  Copy,
  Share,
  Filter,
  Sort,
  Grid,
  List,
  Layout,
  Maximize,
  Minimize,
  RotateCcw,
  RefreshCw,
  Repeat,
  Shuffle,
  SkipBack,
  SkipForward,
  Play,
  Pause,
  Stop,
  Volume,
  Mic,
  MicOff,
  Speaker,
  Headphones
} from 'lucide-react';

interface Bookmark {
  id: string;
  name: string;
  icon: string;
  url: string;
  tab: string;
  description?: string;
  userRole?: 'merchant' | 'analyst' | 'both';
  order: number;
  isDefault?: boolean;
}

interface BookmarkManagerProps {
  bookmarks: Bookmark[];
  onBookmarksUpdate: (bookmarks: Bookmark[]) => void;
  userRole: 'merchant' | 'analyst';
}

// Available icons for bookmarks
const availableIcons = [
  { name: 'Package', icon: Package, category: 'shipping' },
  { name: 'Truck', icon: Truck, category: 'shipping' },
  { name: 'BarChart3', icon: BarChart3, category: 'analytics' },
  { name: 'FileText', icon: FileText, category: 'general' },
  { name: 'Users', icon: Users, category: 'people' },
  { name: 'Globe', icon: Globe, category: 'general' },
  { name: 'Settings', icon: Settings, category: 'general' },
  { name: 'Calendar', icon: Calendar, category: 'time' },
  { name: 'Clock', icon: Clock, category: 'time' },
  { name: 'Target', icon: Target, category: 'goals' },
  { name: 'Zap', icon: Zap, category: 'action' },
  { name: 'Shield', icon: Shield, category: 'security' },
  { name: 'Bell', icon: Bell, category: 'alerts' },
  { name: 'Search', icon: Search, category: 'general' },
  { name: 'Upload', icon: Upload, category: 'action' },
  { name: 'Download', icon: Download, category: 'action' },
  { name: 'Eye', icon: Eye, category: 'general' },
  { name: 'Heart', icon: Heart, category: 'favorites' },
  { name: 'Star', icon: Star, category: 'favorites' },
  { name: 'Bookmark', icon: Bookmark, category: 'favorites' },
  { name: 'Home', icon: Home, category: 'general' },
  { name: 'Mail', icon: Mail, category: 'communication' },
  { name: 'Phone', icon: Phone, category: 'communication' },
  { name: 'MapPin', icon: MapPin, category: 'location' },
  { name: 'Archive', icon: Archive, category: 'storage' },
  { name: 'Folder', icon: Folder, category: 'storage' },
  { name: 'Tag', icon: Tag, category: 'organization' },
  { name: 'Flag', icon: Flag, category: 'status' },
  { name: 'Briefcase', icon: Briefcase, category: 'business' },
  { name: 'Building', icon: Building, category: 'business' },
  { name: 'User', icon: User, category: 'people' },
  { name: 'CheckCircle', icon: CheckCircle, category: 'status' },
  { name: 'AlertTriangle', icon: AlertTriangle, category: 'alerts' },
  { name: 'Info', icon: Info, category: 'general' },
  { name: 'HelpCircle', icon: HelpCircle, category: 'help' }
];

// Available page tabs for bookmarks
const availablePages = [
  { id: 'dashboard', name: 'Dashboard', description: 'Main overview page' },
  { id: 'upload', name: 'Upload Data', description: 'File upload page' },
  { id: 'analysis', name: 'Analysis Results', description: 'Analysis and insights' },
  { id: 'reports', name: 'Reports', description: 'Generate and view reports' },
  { id: 'shipping', name: 'Shipping Tools', description: 'Shipping utilities' },
  { id: 'analytics', name: 'Analytics', description: 'Data analytics dashboard' },
  { id: 'integrations', name: 'Integrations', description: 'Connect external services' },
  { id: 'account', name: 'Account', description: 'Account settings' },
  { id: 'help', name: 'Knowledge Base', description: 'Help and documentation' },
  { id: 'admin-settings', name: 'Admin Settings', description: 'Platform configuration' }
];

export function BookmarkManager({ bookmarks, onBookmarksUpdate, userRole }: BookmarkManagerProps) {
  const [localBookmarks, setLocalBookmarks] = useState<Bookmark[]>(bookmarks);
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [draggedItem, setDraggedItem] = useState<string | null>(null);
  const [iconPickerOpen, setIconPickerOpen] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const [newBookmark, setNewBookmark] = useState<Partial<Bookmark>>({
    name: '',
    icon: 'Star',
    tab: 'dashboard',
    description: '',
    userRole: 'both'
  });

  useEffect(() => {
    setLocalBookmarks(bookmarks);
  }, [bookmarks]);

  const handleDragStart = (e: React.DragEvent, bookmarkId: string) => {
    setDraggedItem(bookmarkId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, targetId: string) => {
    e.preventDefault();
    
    if (!draggedItem || draggedItem === targetId) return;

    const newBookmarks = [...localBookmarks];
    const draggedIndex = newBookmarks.findIndex(b => b.id === draggedItem);
    const targetIndex = newBookmarks.findIndex(b => b.id === targetId);

    if (draggedIndex === -1 || targetIndex === -1) return;

    // Remove dragged item and insert at target position
    const [draggedBookmark] = newBookmarks.splice(draggedIndex, 1);
    newBookmarks.splice(targetIndex, 0, draggedBookmark);

    // Update order values
    const updatedBookmarks = newBookmarks.map((bookmark, index) => ({
      ...bookmark,
      order: index
    }));

    setLocalBookmarks(updatedBookmarks);
    onBookmarksUpdate(updatedBookmarks);
    setDraggedItem(null);
  };

  const handleCreateBookmark = () => {
    if (!newBookmark.name || !newBookmark.icon || !newBookmark.tab) return;

    const bookmark: Bookmark = {
      id: Date.now().toString(),
      name: newBookmark.name,
      icon: newBookmark.icon,
      tab: newBookmark.tab,
      url: `/${newBookmark.tab}`,
      description: newBookmark.description || '',
      userRole: newBookmark.userRole as 'merchant' | 'analyst' | 'both',
      order: localBookmarks.length,
      isDefault: false
    };

    const updatedBookmarks = [...localBookmarks, bookmark];
    setLocalBookmarks(updatedBookmarks);
    onBookmarksUpdate(updatedBookmarks);
    
    setIsCreating(false);
    setNewBookmark({
      name: '',
      icon: 'Star',
      tab: 'dashboard',
      description: '',
      userRole: 'both'
    });
  };

  const handleDeleteBookmark = (bookmarkId: string) => {
    const updatedBookmarks = localBookmarks
      .filter(b => b.id !== bookmarkId)
      .map((bookmark, index) => ({ ...bookmark, order: index }));
    
    setLocalBookmarks(updatedBookmarks);
    onBookmarksUpdate(updatedBookmarks);
  };

  const handleEditBookmark = (bookmarkId: string, field: string, value: string) => {
    const updatedBookmarks = localBookmarks.map(bookmark =>
      bookmark.id === bookmarkId ? { ...bookmark, [field]: value } : bookmark
    );
    
    setLocalBookmarks(updatedBookmarks);
    onBookmarksUpdate(updatedBookmarks);
  };

  const getIconComponent = (iconName: string) => {
    const iconData = availableIcons.find(icon => icon.name === iconName);
    return iconData ? iconData.icon : Star;
  };

  const getFilteredIcons = () => {
    if (selectedCategory === 'all') return availableIcons;
    return availableIcons.filter(icon => icon.category === selectedCategory);
  };

  const iconCategories = [
    { id: 'all', name: 'All Icons' },
    { id: 'shipping', name: 'Shipping' },
    { id: 'analytics', name: 'Analytics' },
    { id: 'general', name: 'General' },
    { id: 'business', name: 'Business' },
    { id: 'people', name: 'People' },
    { id: 'action', name: 'Actions' },
    { id: 'favorites', name: 'Favorites' },
    { id: 'status', name: 'Status' }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium text-black">Custom Bookmarks</h3>
          <p className="text-sm text-gray-600">Create and manage custom navigation shortcuts</p>
        </div>
        <Button 
          onClick={() => setIsCreating(true)}
          className="bg-black text-white hover:bg-gray-800"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Bookmark
        </Button>
      </div>

      {/* Current Bookmarks */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Bookmark className="w-5 h-5 text-blue-600" />
            <span>Current Bookmarks</span>
          </CardTitle>
          <CardDescription>
            Drag and drop to reorder. These will appear in your navigation sidebar.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {localBookmarks.length === 0 ? (
              <div className="text-center py-8">
                <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Bookmark className="w-6 h-6 text-gray-500" />
                </div>
                <p className="text-gray-600 mb-2">No custom bookmarks yet</p>
                <p className="text-sm text-gray-500">Create your first bookmark to get started</p>
              </div>
            ) : (
              localBookmarks.map((bookmark) => {
                const IconComponent = getIconComponent(bookmark.icon);
                
                return (
                  <div
                    key={bookmark.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, bookmark.id)}
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDrop(e, bookmark.id)}
                    className={`flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors cursor-move ${
                      draggedItem === bookmark.id ? 'opacity-50' : ''
                    }`}
                  >
                    <GripVertical className="w-4 h-4 text-gray-400" />
                    
                    <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                      <IconComponent className="w-4 h-4 text-gray-600" />
                    </div>

                    <div className="flex-1">
                      {isEditing === bookmark.id ? (
                        <div className="space-y-2">
                          <Input
                            value={bookmark.name}
                            onChange={(e) => handleEditBookmark(bookmark.id, 'name', e.target.value)}
                            placeholder="Bookmark name"
                            className="text-sm"
                          />
                          <Input
                            value={bookmark.description}
                            onChange={(e) => handleEditBookmark(bookmark.id, 'description', e.target.value)}
                            placeholder="Description (optional)"
                            className="text-xs"
                          />
                        </div>
                      ) : (
                        <div>
                          <div className="font-medium text-sm text-black">{bookmark.name}</div>
                          {bookmark.description && (
                            <div className="text-xs text-gray-600">{bookmark.description}</div>
                          )}
                          <div className="flex items-center space-x-2 mt-1">
                            <Badge variant="outline" className="text-xs">
                              {availablePages.find(p => p.id === bookmark.tab)?.name || bookmark.tab}
                            </Badge>
                            {bookmark.userRole !== 'both' && (
                              <Badge variant="secondary" className="text-xs">
                                {bookmark.userRole}
                              </Badge>
                            )}
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center space-x-2">
                      {isEditing === bookmark.id ? (
                        <>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setIconPickerOpen(bookmark.id)}
                          >
                            <Edit3 className="w-3 h-3" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setIsEditing(null)}
                          >
                            <Save className="w-3 h-3" />
                          </Button>
                        </>
                      ) : (
                        <>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setIsEditing(bookmark.id)}
                          >
                            <Edit3 className="w-3 h-3" />
                          </Button>
                          {!bookmark.isDefault && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteBookmark(bookmark.id)}
                              className="text-red-600 hover:text-red-800"
                            >
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </CardContent>
      </Card>

      {/* Create New Bookmark Modal */}
      {isCreating && (
        <Card className="border-blue-200 bg-blue-50">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Create New Bookmark</CardTitle>
              <Button variant="ghost" size="sm" onClick={() => setIsCreating(false)}>
                <X className="w-4 h-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="bookmark-name">Bookmark Name *</Label>
                <Input
                  id="bookmark-name"
                  value={newBookmark.name}
                  onChange={(e) => setNewBookmark({ ...newBookmark, name: e.target.value })}
                  placeholder="My Custom Page"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="bookmark-page">Target Page *</Label>
                <Select 
                  value={newBookmark.tab} 
                  onValueChange={(value) => setNewBookmark({ ...newBookmark, tab: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select page" />
                  </SelectTrigger>
                  <SelectContent>
                    {availablePages.map((page) => (
                      <SelectItem key={page.id} value={page.id}>
                        <div>
                          <div className="font-medium">{page.name}</div>
                          <div className="text-xs text-gray-600">{page.description}</div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="bookmark-description">Description</Label>
              <Input
                id="bookmark-description"
                value={newBookmark.description}
                onChange={(e) => setNewBookmark({ ...newBookmark, description: e.target.value })}
                placeholder="Optional description for this bookmark"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Icon *</Label>
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                    {React.createElement(getIconComponent(newBookmark.icon || 'Star'), { 
                      className: "w-5 h-5 text-gray-600" 
                    })}
                  </div>
                  <Button
                    variant="outline"
                    onClick={() => setIconPickerOpen('new')}
                  >
                    Choose Icon
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="bookmark-role">Visible To</Label>
                <Select 
                  value={newBookmark.userRole} 
                  onValueChange={(value) => setNewBookmark({ ...newBookmark, userRole: value as any })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="both">Both Merchants & Analysts</SelectItem>
                    <SelectItem value="merchant">Merchants Only</SelectItem>
                    <SelectItem value="analyst">Analysts Only</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex items-center justify-end space-x-3 pt-4">
              <Button variant="outline" onClick={() => setIsCreating(false)}>
                Cancel
              </Button>
              <Button 
                onClick={handleCreateBookmark}
                disabled={!newBookmark.name || !newBookmark.icon || !newBookmark.tab}
                className="bg-black text-white hover:bg-gray-800"
              >
                Create Bookmark
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Icon Picker Modal */}
      {iconPickerOpen && (
        <Card className="fixed inset-4 z-50 bg-white border border-gray-200 shadow-2xl overflow-hidden">
          <CardHeader className="border-b border-gray-200">
            <div className="flex items-center justify-between">
              <CardTitle>Choose Icon</CardTitle>
              <Button variant="ghost" size="sm" onClick={() => setIconPickerOpen(null)}>
                <X className="w-4 h-4" />
              </Button>
            </div>
            
            {/* Category Filter */}
            <div className="flex flex-wrap gap-2 pt-4">
              {iconCategories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`px-3 py-1 text-xs rounded-full transition-colors ${
                    selectedCategory === category.id
                      ? 'bg-black text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {category.name}
                </button>
              ))}
            </div>
          </CardHeader>
          <CardContent className="p-4 max-h-96 overflow-y-auto">
            <div className="grid grid-cols-8 gap-2">
              {getFilteredIcons().map((iconData) => {
                const IconComponent = iconData.icon;
                const isSelected = (iconPickerOpen === 'new' ? newBookmark.icon : 
                  localBookmarks.find(b => b.id === iconPickerOpen)?.icon) === iconData.name;
                
                return (
                  <button
                    key={iconData.name}
                    onClick={() => {
                      if (iconPickerOpen === 'new') {
                        setNewBookmark({ ...newBookmark, icon: iconData.name });
                      } else {
                        handleEditBookmark(iconPickerOpen, 'icon', iconData.name);
                      }
                      setIconPickerOpen(null);
                    }}
                    className={`w-12 h-12 rounded-lg flex items-center justify-center transition-colors ${
                      isSelected
                        ? 'bg-black text-white'
                        : 'bg-gray-50 hover:bg-gray-100 text-gray-600'
                    }`}
                    title={iconData.name}
                  >
                    <IconComponent className="w-5 h-5" />
                  </button>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Overlay for icon picker */}
      {iconPickerOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setIconPickerOpen(null)}
        />
      )}
    </div>
  );
}