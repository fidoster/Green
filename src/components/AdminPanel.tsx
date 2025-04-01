import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "./ui/alert-dialog";
import {
  Leaf,
  Key,
  Users,
  Plus,
  Trash2,
  Edit,
  Shield,
  AlertTriangle,
} from "lucide-react";

interface User {
  id: string;
  email: string;
  role: string;
  created_at: string;
}

interface ApiKey {
  id: string;
  service: string;
  key: string;
  created_at: string;
  created_by: string;
  description: string;
}

const AdminPanel = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [users, setUsers] = useState<User[]>([]);
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
  const [currentUser, setCurrentUser] = useState<any>(null);

  // Form states
  const [newApiKey, setNewApiKey] = useState({
    service: "openai",
    key: "",
    description: "",
  });

  const [newUserEmail, setNewUserEmail] = useState("");
  const [newUserRole, setNewUserRole] = useState("user");

  useEffect(() => {
    const checkAdminStatus = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        setCurrentUser(user);

        if (!user) {
          setIsLoading(false);
          return;
        }

        // For development purposes, always grant admin access
        setIsAdmin(true);
        fetchUsers();
        fetchApiKeys();
      } catch (error) {
        console.error("Error checking admin status:", error);
      } finally {
        setIsLoading(false);
      }
    };

    checkAdminStatus();
  }, []);

  const fetchUsers = async () => {
    try {
      // First try to get users from the auth.users table (if admin access)
      let { data: authUsers, error: authError } =
        await supabase.auth.admin.listUsers();

      if (authUsers?.users && authUsers.users.length > 0) {
        // Format auth users to match our User interface
        const formattedUsers = authUsers.users.map((user) => ({
          id: user.id,
          email: user.email || "",
          role: user.role || "user",
          created_at: user.created_at || new Date().toISOString(),
        }));
        setUsers(formattedUsers);
        return;
      }

      // Fallback to the users table in the database
      const { data, error } = await supabase.from("users").select("*");

      if (error) {
        console.error("Error fetching from users table:", error);
        // If no users found in the database, create a default admin user (for development)
        if (currentUser) {
          const defaultUser = {
            id: currentUser.id,
            email: currentUser.email || "admin@example.com",
            role: "admin",
            created_at: new Date().toISOString(),
          };
          setUsers([defaultUser]);
        }
        return;
      }

      if (data && data.length > 0) {
        setUsers(data);
      } else if (currentUser) {
        // If no users found, create a default admin user (for development)
        const defaultUser = {
          id: currentUser.id,
          email: currentUser.email || "admin@example.com",
          role: "admin",
          created_at: new Date().toISOString(),
        };
        setUsers([defaultUser]);

        // Try to insert this user into the database
        try {
          await supabase.from("users").insert([defaultUser]);
        } catch (insertError) {
          console.error("Error inserting default user:", insertError);
        }
      }
    } catch (error) {
      console.error("Error fetching users:", error);

      // If all else fails, create a default user for development
      if (currentUser) {
        const defaultUser = {
          id: currentUser.id,
          email: currentUser.email || "admin@example.com",
          role: "admin",
          created_at: new Date().toISOString(),
        };
        setUsers([defaultUser]);
      }
    }
  };

  const fetchApiKeys = async () => {
    try {
      // In a real app, you would fetch API keys from your database
      const { data, error } = await supabase.from("api_keys").select("*");

      if (error) throw error;
      setApiKeys(data || []);
    } catch (error) {
      console.error("Error fetching API keys:", error);
    }
  };

  const handleAddApiKey = async () => {
    try {
      if (!newApiKey.key || !newApiKey.service) {
        alert("Please fill in all required fields");
        return;
      }

      const { data, error } = await supabase.from("api_keys").insert([
        {
          service: newApiKey.service,
          key: newApiKey.key,
          description: newApiKey.description,
          created_by: currentUser?.id,
        },
      ]);

      if (error) throw error;

      // Reset form and refresh list
      setNewApiKey({ service: "openai", key: "", description: "" });
      fetchApiKeys();
    } catch (error) {
      console.error("Error adding API key:", error);
    }
  };

  const handleDeleteApiKey = async (id: string) => {
    try {
      const { error } = await supabase.from("api_keys").delete().eq("id", id);

      if (error) throw error;
      fetchApiKeys();
    } catch (error) {
      console.error("Error deleting API key:", error);
    }
  };

  const handleAddUser = async () => {
    try {
      if (!newUserEmail) {
        alert("Please enter an email address");
        return;
      }

      // In a real app, you would use Supabase Auth Admin API to create users
      // For now, we'll just add a record to the users table
      const { data, error } = await supabase.from("users").insert([
        {
          email: newUserEmail,
          role: newUserRole,
        },
      ]);

      if (error) throw error;

      // Reset form and refresh list
      setNewUserEmail("");
      setNewUserRole("user");
      fetchUsers();
    } catch (error) {
      console.error("Error adding user:", error);
    }
  };

  const handleDeleteUser = async (id: string) => {
    try {
      // Don't allow deleting yourself
      if (id === currentUser?.id) {
        alert("You cannot delete your own account");
        return;
      }

      const { error } = await supabase.from("users").delete().eq("id", id);

      if (error) throw error;
      fetchUsers();
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  const handleUpdateUserRole = async (id: string, newRole: string) => {
    try {
      const { error } = await supabase
        .from("users")
        .update({ role: newRole })
        .eq("id", id);

      if (error) throw error;
      fetchUsers();
    } catch (error) {
      console.error("Error updating user role:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Loading...</p>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-[#f0f7f2] dark:bg-[#1f2a28]">
        <div className="w-full max-w-md p-8 space-y-6 bg-white/90 dark:bg-[#3A4140]/90 rounded-lg shadow-xl backdrop-blur relative z-10 border border-white/20 dark:border-[#4A5654]/30">
          <div className="flex flex-col items-center text-center">
            <div className="flex items-center justify-center w-20 h-20 mb-4 rounded-full bg-red-100 dark:bg-red-900/30">
              <Shield className="w-10 h-10 text-red-500 dark:text-red-400" />
            </div>
            <h1 className="text-2xl font-bold text-[#2C4A3E] dark:text-white">
              Access Restricted
            </h1>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
              You don't have permission to access the admin panel. Please
              contact your administrator.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 bg-[#f0f7f2] dark:bg-[#1f2a28] min-h-screen">
      <div className="flex items-center mb-8 space-x-4">
        <div className="p-3 rounded-full bg-[#4B9460]/20 dark:bg-[#4B9460]/10">
          <Leaf className="w-8 h-8 text-[#2C4A3E] dark:text-[#8BA888]" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-[#2C4A3E] dark:text-white">
            GreenBot Admin
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Manage users and API keys
          </p>
        </div>
      </div>

      <div className="mb-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800/50 rounded-lg">
        <div className="flex items-start space-x-3">
          <AlertTriangle className="w-5 h-5 text-yellow-600 dark:text-yellow-500 mt-0.5" />
          <div>
            <h3 className="font-medium text-yellow-800 dark:text-yellow-400">
              Development Mode
            </h3>
            <p className="text-sm text-yellow-700 dark:text-yellow-300/80">
              This admin panel is in development. In production, ensure proper
              authentication and authorization mechanisms are in place.
            </p>
          </div>
        </div>
      </div>

      <Tabs defaultValue="api-keys" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-8">
          <TabsTrigger value="api-keys" className="flex items-center space-x-2">
            <Key className="w-4 h-4" />
            <span>API Keys</span>
          </TabsTrigger>
          <TabsTrigger value="users" className="flex items-center space-x-2">
            <Users className="w-4 h-4" />
            <span>Users</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="api-keys" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Add New API Key</CardTitle>
              <CardDescription>
                Configure API keys for various services
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="service">Service</Label>
                  <Select
                    value={newApiKey.service}
                    onValueChange={(value) =>
                      setNewApiKey({ ...newApiKey, service: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select service" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="openai">OpenAI</SelectItem>
                      <SelectItem value="grok">Grok</SelectItem>
                      <SelectItem value="anthropic">Anthropic</SelectItem>
                      <SelectItem value="mistral">Mistral AI</SelectItem>
                      <SelectItem value="deepseek">DeepSeek</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="api-key">API Key</Label>
                  <Input
                    id="api-key"
                    type="password"
                    placeholder="Enter API key"
                    value={newApiKey.key}
                    onChange={(e) =>
                      setNewApiKey({ ...newApiKey, key: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description (Optional)</Label>
                <Input
                  id="description"
                  placeholder="E.g., Production OpenAI key"
                  value={newApiKey.description}
                  onChange={(e) =>
                    setNewApiKey({ ...newApiKey, description: e.target.value })
                  }
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleAddApiKey} className="w-full md:w-auto">
                <Plus className="w-4 h-4 mr-2" />
                Add API Key
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Manage API Keys</CardTitle>
              <CardDescription>
                View and manage existing API keys
              </CardDescription>
            </CardHeader>
            <CardContent>
              {apiKeys.length === 0 ? (
                <div className="text-center py-6 text-gray-500 dark:text-gray-400">
                  <Key className="w-12 h-12 mx-auto mb-3 opacity-20" />
                  <p>No API keys found. Add your first API key above.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="border-b border-gray-200 dark:border-gray-700">
                        <th className="py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-400">
                          Service
                        </th>
                        <th className="py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-400">
                          Key
                        </th>
                        <th className="py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-400">
                          Description
                        </th>
                        <th className="py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-400">
                          Created
                        </th>
                        <th className="py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-400">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {apiKeys.map((apiKey) => (
                        <tr
                          key={apiKey.id}
                          className="border-b border-gray-200 dark:border-gray-700"
                        >
                          <td className="py-4 text-sm capitalize">
                            {apiKey.service}
                          </td>
                          <td className="py-4 text-sm">
                            ••••••••••••{apiKey.key.slice(-4)}
                          </td>
                          <td className="py-4 text-sm">
                            {apiKey.description || "-"}
                          </td>
                          <td className="py-4 text-sm">
                            {new Date(apiKey.created_at).toLocaleDateString()}
                          </td>
                          <td className="py-4 text-sm">
                            <div className="flex space-x-2">
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button variant="outline" size="sm">
                                    <Edit className="w-3 h-3 mr-1" />
                                    Edit
                                  </Button>
                                </DialogTrigger>
                                <DialogContent>
                                  <DialogHeader>
                                    <DialogTitle>Edit API Key</DialogTitle>
                                    <DialogDescription>
                                      Update the details for this API key.
                                    </DialogDescription>
                                  </DialogHeader>
                                  <div className="space-y-4 py-4">
                                    <div className="space-y-2">
                                      <Label htmlFor="edit-description">
                                        Description
                                      </Label>
                                      <Input
                                        id="edit-description"
                                        defaultValue={apiKey.description}
                                      />
                                    </div>
                                  </div>
                                  <DialogFooter>
                                    <Button type="submit">Save changes</Button>
                                  </DialogFooter>
                                </DialogContent>
                              </Dialog>

                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button variant="destructive" size="sm">
                                    <Trash2 className="w-3 h-3 mr-1" />
                                    Delete
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>
                                      Are you sure?
                                    </AlertDialogTitle>
                                    <AlertDialogDescription>
                                      This action cannot be undone. This will
                                      permanently delete the API key.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>
                                      Cancel
                                    </AlertDialogCancel>
                                    <AlertDialogAction
                                      onClick={() =>
                                        handleDeleteApiKey(apiKey.id)
                                      }
                                    >
                                      Delete
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="users" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Add New User</CardTitle>
              <CardDescription>
                Invite new users to the platform
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="user@example.com"
                    value={newUserEmail}
                    onChange={(e) => setNewUserEmail(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="role">Role</Label>
                  <Select value={newUserRole} onValueChange={setNewUserRole}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="user">User</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleAddUser} className="w-full md:w-auto">
                <Plus className="w-4 h-4 mr-2" />
                Add User
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Manage Users</CardTitle>
              <CardDescription>View and manage existing users</CardDescription>
            </CardHeader>
            <CardContent>
              {users.length === 0 ? (
                <div className="text-center py-6 text-gray-500 dark:text-gray-400">
                  <Users className="w-12 h-12 mx-auto mb-3 opacity-20" />
                  <p>No users found. Add your first user above.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="border-b border-gray-200 dark:border-gray-700">
                        <th className="py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-400">
                          Email
                        </th>
                        <th className="py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-400">
                          Role
                        </th>
                        <th className="py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-400">
                          Created
                        </th>
                        <th className="py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-400">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map((user) => (
                        <tr
                          key={user.id}
                          className="border-b border-gray-200 dark:border-gray-700"
                        >
                          <td className="py-4 text-sm">{user.email}</td>
                          <td className="py-4 text-sm capitalize">
                            <span
                              className={`px-2 py-1 rounded-full text-xs ${user.role === "admin" ? "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300" : "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300"}`}
                            >
                              {user.role}
                            </span>
                          </td>
                          <td className="py-4 text-sm">
                            {new Date(user.created_at).toLocaleDateString()}
                          </td>
                          <td className="py-4 text-sm">
                            <div className="flex space-x-2">
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button variant="outline" size="sm">
                                    <Edit className="w-3 h-3 mr-1" />
                                    Edit
                                  </Button>
                                </DialogTrigger>
                                <DialogContent>
                                  <DialogHeader>
                                    <DialogTitle>Edit User</DialogTitle>
                                    <DialogDescription>
                                      Update the role for this user.
                                    </DialogDescription>
                                  </DialogHeader>
                                  <div className="space-y-4 py-4">
                                    <div className="space-y-2">
                                      <Label htmlFor="edit-role">Role</Label>
                                      <Select
                                        defaultValue={user.role}
                                        onValueChange={(value) =>
                                          handleUpdateUserRole(user.id, value)
                                        }
                                      >
                                        <SelectTrigger>
                                          <SelectValue placeholder="Select role" />
                                        </SelectTrigger>
                                        <SelectContent>
                                          <SelectItem value="user">
                                            User
                                          </SelectItem>
                                          <SelectItem value="admin">
                                            Admin
                                          </SelectItem>
                                        </SelectContent>
                                      </Select>
                                    </div>
                                  </div>
                                  <DialogFooter>
                                    <Button type="submit">Save changes</Button>
                                  </DialogFooter>
                                </DialogContent>
                              </Dialog>

                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button
                                    variant="destructive"
                                    size="sm"
                                    disabled={user.id === currentUser?.id}
                                  >
                                    <Trash2 className="w-3 h-3 mr-1" />
                                    Delete
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>
                                      Are you sure?
                                    </AlertDialogTitle>
                                    <AlertDialogDescription>
                                      This action cannot be undone. This will
                                      permanently delete the user account.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>
                                      Cancel
                                    </AlertDialogCancel>
                                    <AlertDialogAction
                                      onClick={() => handleDeleteUser(user.id)}
                                    >
                                      Delete
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminPanel;
