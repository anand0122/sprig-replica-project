import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { 
  Users, 
  UserPlus, 
  Shield, 
  Settings, 
  Mail, 
  Trash2, 
  Edit,
  Key,
  Globe,
  Lock,
  Crown,
  Eye,
  EyeOff,
  CheckCircle,
  XCircle,
  Clock,
  Plus
} from 'lucide-react';

interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: 'owner' | 'admin' | 'editor' | 'viewer';
  status: 'active' | 'pending' | 'suspended';
  lastActive: Date;
  permissions: Permission[];
  groups: string[];
  ssoProvider?: 'google' | 'microsoft' | 'github' | 'okta';
}

interface Permission {
  resource: string;
  actions: ('create' | 'read' | 'update' | 'delete' | 'share' | 'admin')[];
}

interface UserGroup {
  id: string;
  name: string;
  description: string;
  members: string[];
  permissions: Permission[];
  formAccess: {
    formId: string;
    permissions: string[];
  }[];
}

interface SSOProvider {
  id: string;
  name: string;
  type: 'google' | 'microsoft' | 'github' | 'okta' | 'saml';
  enabled: boolean;
  config: {
    clientId?: string;
    domain?: string;
    redirectUri?: string;
  };
}

interface UserManagementProps {
  currentUser: User;
  users: User[];
  groups: UserGroup[];
  ssoProviders: SSOProvider[];
  onUserUpdate: (user: User) => void;
  onUserDelete: (userId: string) => void;
  onUserInvite: (email: string, role: string, groups: string[]) => void;
  onGroupUpdate: (group: UserGroup) => void;
  onSSOUpdate: (provider: SSOProvider) => void;
}

export const UserManagement: React.FC<UserManagementProps> = ({
  currentUser,
  users,
  groups,
  ssoProviders,
  onUserUpdate,
  onUserDelete,
  onUserInvite,
  onGroupUpdate,
  onSSOUpdate
}) => {
  const [activeTab, setActiveTab] = useState('users');
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<string>('viewer');
  const [inviteGroups, setInviteGroups] = useState<string[]>([]);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [editingGroup, setEditingGroup] = useState<UserGroup | null>(null);

  const roleColors = {
    owner: 'bg-purple-100 text-purple-800',
    admin: 'bg-red-100 text-red-800',
    editor: 'bg-blue-100 text-blue-800',
    viewer: 'bg-gray-100 text-gray-800'
  };

  const statusColors = {
    active: 'bg-green-100 text-green-800',
    pending: 'bg-yellow-100 text-yellow-800',
    suspended: 'bg-red-100 text-red-800'
  };

  const rolePermissions = {
    owner: ['create', 'read', 'update', 'delete', 'share', 'admin'],
    admin: ['create', 'read', 'update', 'delete', 'share'],
    editor: ['create', 'read', 'update', 'share'],
    viewer: ['read']
  };

  const handleInviteUser = () => {
    if (inviteEmail && inviteRole) {
      onUserInvite(inviteEmail, inviteRole, inviteGroups);
      setInviteEmail('');
      setInviteRole('viewer');
      setInviteGroups([]);
    }
  };

  const handleRoleChange = (userId: string, newRole: string) => {
    const user = users.find(u => u.id === userId);
    if (user) {
      const updatedUser = {
        ...user,
        role: newRole as User['role'],
        permissions: [{
          resource: 'forms',
          actions: rolePermissions[newRole as keyof typeof rolePermissions] as Permission['actions']
        }]
      };
      onUserUpdate(updatedUser);
    }
  };

  const handleStatusChange = (userId: string, newStatus: string) => {
    const user = users.find(u => u.id === userId);
    if (user) {
      const updatedUser = { ...user, status: newStatus as User['status'] };
      onUserUpdate(updatedUser);
    }
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const formatLastActive = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (days === 0) return 'Today';
    if (days === 1) return 'Yesterday';
    if (days < 7) return `${days} days ago`;
    return date.toLocaleDateString();
  };

  const canManageUser = (targetUser: User) => {
    if (currentUser.role === 'owner') return true;
    if (currentUser.role === 'admin' && targetUser.role !== 'owner') return true;
    return currentUser.id === targetUser.id;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="w-5 h-5" />
          User Management
          <Badge variant="secondary">{users.length} users</Badge>
        </CardTitle>
      </CardHeader>

      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="groups">Groups</TabsTrigger>
            <TabsTrigger value="permissions">Permissions</TabsTrigger>
            <TabsTrigger value="sso">SSO</TabsTrigger>
          </TabsList>

          <TabsContent value="users" className="space-y-6">
            {/* Invite User */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <UserPlus className="w-5 h-5" />
                  Invite User
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <Label>Email Address</Label>
                    <Input
                      type="email"
                      value={inviteEmail}
                      onChange={(e) => setInviteEmail(e.target.value)}
                      placeholder="user@example.com"
                    />
                  </div>
                  <div>
                    <Label>Role</Label>
                    <Select value={inviteRole} onValueChange={setInviteRole}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="viewer">Viewer</SelectItem>
                        <SelectItem value="editor">Editor</SelectItem>
                        {currentUser.role === 'owner' && (
                          <SelectItem value="admin">Admin</SelectItem>
                        )}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Groups (Optional)</Label>
                    <Select
                      value={inviteGroups[0] || ''}
                      onValueChange={(value) => setInviteGroups(value ? [value] : [])}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select group" />
                      </SelectTrigger>
                      <SelectContent>
                        {groups.map((group) => (
                          <SelectItem key={group.id} value={group.id}>
                            {group.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-end">
                    <Button onClick={handleInviteUser} className="w-full">
                      Send Invite
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Users List */}
            <div className="space-y-4">
              {users.map((user) => (
                <Card key={user.id}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <Avatar>
                          <AvatarImage src={user.avatar} />
                          <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-medium">{user.name}</h3>
                            {user.id === currentUser.id && (
                              <Badge variant="outline">You</Badge>
                            )}
                            {user.ssoProvider && (
                              <Badge variant="secondary" className="text-xs">
                                SSO
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-gray-600">{user.email}</p>
                          <p className="text-xs text-gray-500">
                            Last active: {formatLastActive(user.lastActive)}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <Badge className={roleColors[user.role]}>
                            {user.role}
                          </Badge>
                          <div className="mt-1">
                            <Badge variant="outline" className={statusColors[user.status]}>
                              {user.status}
                            </Badge>
                          </div>
                        </div>

                        {canManageUser(user) && user.id !== currentUser.id && (
                          <div className="flex gap-2">
                            <Select
                              value={user.role}
                              onValueChange={(value) => handleRoleChange(user.id, value)}
                            >
                              <SelectTrigger className="w-24">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="viewer">Viewer</SelectItem>
                                <SelectItem value="editor">Editor</SelectItem>
                                {currentUser.role === 'owner' && (
                                  <SelectItem value="admin">Admin</SelectItem>
                                )}
                              </SelectContent>
                            </Select>

                            <Select
                              value={user.status}
                              onValueChange={(value) => handleStatusChange(user.id, value)}
                            >
                              <SelectTrigger className="w-28">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="active">Active</SelectItem>
                                <SelectItem value="suspended">Suspended</SelectItem>
                              </SelectContent>
                            </Select>

                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => onUserDelete(user.id)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>

                    {user.groups.length > 0 && (
                      <div className="mt-3 flex gap-2">
                        <span className="text-sm text-gray-600">Groups:</span>
                        {user.groups.map((groupId) => {
                          const group = groups.find(g => g.id === groupId);
                          return group ? (
                            <Badge key={groupId} variant="outline" className="text-xs">
                              {group.name}
                            </Badge>
                          ) : null;
                        })}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="groups" className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="font-medium">User Groups</h3>
              <Button size="sm">
                <UserPlus className="w-4 h-4 mr-2" />
                Create Group
              </Button>
            </div>

            {groups.map((group) => (
              <Card key={group.id}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-medium">{group.name}</h4>
                      <p className="text-sm text-gray-600 mt-1">{group.description}</p>
                      <div className="flex items-center gap-4 mt-3">
                        <Badge variant="outline">
                          {group.members.length} members
                        </Badge>
                        <Badge variant="outline">
                          {group.formAccess.length} forms
                        </Badge>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm">
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="text-red-600">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="mt-4 space-y-2">
                    <Label className="text-sm font-medium">Members:</Label>
                    <div className="flex flex-wrap gap-2">
                      {group.members.map((memberId) => {
                        const user = users.find(u => u.id === memberId);
                        return user ? (
                          <div key={memberId} className="flex items-center gap-2 bg-gray-100 rounded-full px-3 py-1">
                            <Avatar className="w-6 h-6">
                              <AvatarImage src={user.avatar} />
                              <AvatarFallback className="text-xs">
                                {getInitials(user.name)}
                              </AvatarFallback>
                            </Avatar>
                            <span className="text-sm">{user.name}</span>
                          </div>
                        ) : null;
                      })}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="permissions" className="space-y-6">
            <div>
              <h3 className="font-medium mb-4">Role Permissions</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {Object.entries(rolePermissions).map(([role, permissions]) => (
                  <Card key={role}>
                    <CardHeader className="pb-3">
                      <CardTitle className={`text-sm ${roleColors[role as keyof typeof roleColors]}`}>
                        {role.charAt(0).toUpperCase() + role.slice(1)}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="space-y-2">
                        {permissions.map((permission) => (
                          <div key={permission} className="flex items-center gap-2 text-sm">
                            <CheckCircle className="w-4 h-4 text-green-500" />
                            <span className="capitalize">{permission}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-medium mb-4">Custom Permissions</h3>
              <p className="text-sm text-gray-600 mb-4">
                Set specific permissions for individual users or groups
              </p>
              
              <Card>
                <CardContent className="p-4">
                  <div className="text-center text-gray-500 py-8">
                    Custom permission management coming soon
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="sso" className="space-y-6">
            <div>
              <h3 className="font-medium mb-4">Single Sign-On Providers</h3>
              
              {ssoProviders.map((provider) => (
                <Card key={provider.id}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                          <Globe className="w-6 h-6" />
                        </div>
                        <div>
                          <h4 className="font-medium">{provider.name}</h4>
                          <p className="text-sm text-gray-600">{provider.type.toUpperCase()}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-4">
                        <Badge variant={provider.enabled ? "default" : "secondary"}>
                          {provider.enabled ? "Enabled" : "Disabled"}
                        </Badge>
                        <Button variant="outline" size="sm">
                          <Settings className="w-4 h-4 mr-2" />
                          Configure
                        </Button>
                      </div>
                    </div>

                    {provider.enabled && (
                      <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                        <div className="text-sm space-y-1">
                          {provider.config.clientId && (
                            <div>
                              <span className="font-medium">Client ID:</span>
                              <span className="ml-2 font-mono text-xs">
                                {provider.config.clientId.substring(0, 20)}...
                              </span>
                            </div>
                          )}
                          {provider.config.domain && (
                            <div>
                              <span className="font-medium">Domain:</span>
                              <span className="ml-2">{provider.config.domain}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}

              <Card className="border-dashed">
                <CardContent className="p-6 text-center">
                  <Plus className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <h4 className="font-medium mb-2">Add SSO Provider</h4>
                  <p className="text-sm text-gray-600 mb-4">
                    Connect with Google, Microsoft, GitHub, or custom SAML providers
                  </p>
                  <Button variant="outline">
                    Add Provider
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}; 