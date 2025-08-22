import { getUser, request } from "@/lib/api";
import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import { PageHeader } from "@/components/PageHeaders";
import AdminStatsCard from "@/components/admin/AdminStatsCard";
import { PageContainer } from "../PageContaire";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface User {
  id: number;
  email: string;
  firstName?: string;
  lastName?: string;
  role: string;
  createdAt?: string;
  _count?: {
    reservations: number;
  };
  reservations?: any[];
}

const UsersList: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState<number | null>(null);
  const [currentUser, setCurrentUser] = useState<{
    name?: string;
    email?: string;
  } | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [newUser, setNewUser] = useState({
    email: "",
    firstName: "",
    lastName: "",
    password: "",
    role: "USER",
  });
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordStrength, setPasswordStrength] = useState(0);

  useEffect(() => {
    fetchUsers();
    const user = getUser();
    setCurrentUser(user);
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await request({
        method: "GET",
        url: "/api/users",
      });

      if (response.data && response.data.data) {
        setUsers(response.data.data);
      }
    } catch (error) {
      console.error("Failed to fetch users:", error);
      toast.error("Failed to load users");
    }
  };

  const handleRoleChange = async (userId: number, newRole: string) => {
    try {
      setIsLoading(userId);

      const response = await request({
        method: "PATCH",
        url: `/api/users/${userId}/role`,
        data: { role: newRole },
      });

      if (response.data && response.data.data) {
        setUsers(
            users.map((user) =>
                user.id === userId ? { ...user, role: newRole } : user
            )
        );
        toast.success("User role updated successfully");
      }
    } catch (error) {
      console.error("Error updating user role:", error);
      toast.error("Failed to update user role");
    } finally {
      setIsLoading(null);
    }
  };

  const handleDeleteUser = async (userId: number) => {
    try {
      setIsLoading(userId);
      const response = await request({
        method: "DELETE",
        url: `/api/users/${userId}`,
      });

      if (response.data && response.data.success) {
        setUsers(users.filter((user) => user.id !== userId));
        toast.success("User deleted successfully");
      }
    } catch (error: any) {
      console.error("Error deleting user:", error);

      // Show specific error message from backend
      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else if (error.message?.includes("reservations")) {
        toast.error("Cannot delete user with existing reservations");
      } else if (error.message?.includes("notifications")) {
        toast.error("Cannot delete user with notifications");
      } else if (error.message?.includes("references")) {
        toast.error("Cannot delete user due to related records. Please delete reservations and notifications first.");
      } else {
        toast.error("Failed to delete user");
      }
    } finally {
      setIsLoading(null);
    }
  };

  const handleEditUser = (user: User) => {
    setEditingUser(user);
    setNewUser({
      email: user.email,
      firstName: user.firstName || "",
      lastName: user.lastName || "",
      password: "",
      role: user.role,
    });
    setConfirmPassword("");
    setIsDialogOpen(true);
  };

  const handleUpdateUser = async () => {
    if (!editingUser) return;

    try {
      setIsLoading(editingUser.id);
      const response = await request({
        method: "PUT",
        url: `/api/users/${editingUser.id}`,
        data: {
          email: newUser.email,
          firstName: newUser.firstName,
          lastName: newUser.lastName,
          role: newUser.role,
        },
      });

      if (response.data && response.data.data) {
        setUsers(
            users.map((user) =>
                user.id === editingUser.id ? response.data.data : user
            )
        );
        toast.success("User updated successfully");
        setIsDialogOpen(false);
      }
    } catch (error) {
      console.error("Error updating user:", error);
      toast.error("Failed to update user");
    } finally {
      setIsLoading(null);
    }
  };

  const handleCreateUser = async () => {
    if (!newUser.password || newUser.password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    if (newUser.password !== confirmPassword) {
      toast.error("Passwords don't match");
      return;
    }

    try {
      setIsLoading(-1);
      const userPayload = {
        email: newUser.email,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        password: newUser.password,
        role: newUser.role,
      };

      const response = await request({
        method: "POST",
        url: "/api/users",
        data: userPayload,
      });

      if (response.data && response.data.data) {
        setUsers([...users, response.data.data]);
        toast.success("User created successfully");
        setIsDialogOpen(false);
        setNewUser({
          email: "",
          firstName: "",
          lastName: "",
          password: "",
          role: "USER",
        });
        setConfirmPassword("");
      }
    } catch (error) {
      console.error("Error creating user:", error);
      toast.error("Failed to create user");
    } finally {
      setIsLoading(null);
    }
  };

  const handlePasswordChange = (password: string) => {
    setNewUser({ ...newUser, password });
    let strength = 0;
    if (password.length >= 6) strength++;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    setPasswordStrength(strength);
  };

  const filteredUsers = users.filter(
      (user) =>
          user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (user.firstName?.toLowerCase() || "").includes(
              searchTerm.toLowerCase()
          ) ||
          (user.lastName?.toLowerCase() || "").includes(searchTerm.toLowerCase())
  );

  const totalUsers = users.length;
  const adminUsers = users.filter((u) => u.role === "ADMIN").length;
  const activeUsers = users.filter(
      (u) => u._count && u._count.reservations > 0
  ).length;
  const newUsers = users.filter((u) => {
    if (!u.createdAt) return false;
    const daysSinceJoined = Math.floor(
        (new Date().getTime() - new Date(u.createdAt).getTime()) /
        (1000 * 60 * 60 * 24)
    );
    return daysSinceJoined <= 30;
  }).length;

  const userName = currentUser?.name || currentUser?.email || "Unknown User";

  return (
      <PageContainer className="p-0">
        <PageHeader title="Users Management" username={userName} />

        <div className="p-6 bg-gray-50 dark:bg-navy-900/50 min-h-[calc(100vh-16rem)]">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <AdminStatsCard
                title="Total Users"
                value={totalUsers}
                icon="users"
                trend={`${adminUsers} admins`}
            />
            <AdminStatsCard
                title="Active Users"
                value={activeUsers}
                icon="users"
                trend="With reservations"
            />
            <AdminStatsCard
                title="New Users"
                value={newUsers}
                icon="users"
                trend="Last 30 days"
            />
          </div>

          <div className="bg-white dark:bg-navy-700 rounded-lg shadow-sm border border-gray-200 dark:border-navy-600 p-4 mb-6">
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
              <div className="flex-1 w-full">
                <Input
                    type="text"
                    placeholder="Search users by name or email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full"
                />
              </div>
              <div className="flex gap-2">
                {searchTerm && (
                    <Button
                        variant="outline"
                        onClick={() => setSearchTerm("")}
                        disabled={!searchTerm}
                    >
                      Clear
                    </Button>
                )}
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                  <DialogTrigger asChild>
                    <Button
                        onClick={() => {
                          setEditingUser(null);
                          setNewUser({
                            email: "",
                            firstName: "",
                            lastName: "",
                            password: "",
                            role: "USER",
                          });
                          setConfirmPassword("");
                        }}
                    >
                      <span className="hidden sm:inline">Add New User</span>
                      <span className="sm:hidden">+ Add</span>
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[525px]">
                    <DialogHeader>
                      <DialogTitle className="text-xl font-semibold">
                        {editingUser ? "Edit User" : "Create New User"}
                      </DialogTitle>
                    </DialogHeader>
                    <form
                        onSubmit={(e) => {
                          e.preventDefault();
                          editingUser ? handleUpdateUser() : handleCreateUser();
                        }}
                    >
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="email" className="text-sm font-medium">
                            Email Address*
                          </Label>
                          <Input
                              id="email"
                              value={newUser.email}
                              onChange={(e) =>
                                  setNewUser({ ...newUser, email: e.target.value })
                              }
                              type="email"
                              required
                              placeholder="user@example.com"
                          />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="firstName" className="text-sm font-medium">
                              First Name
                            </Label>
                            <Input
                                id="firstName"
                                value={newUser.firstName}
                                onChange={(e) =>
                                    setNewUser({ ...newUser, firstName: e.target.value })
                                }
                                placeholder="e.g: Jean Paul"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="lastName" className="text-sm font-medium">
                              Last Name
                            </Label>
                            <Input
                                id="lastName"
                                value={newUser.lastName}
                                onChange={(e) =>
                                    setNewUser({ ...newUser, lastName: e.target.value })
                                }
                                placeholder="e.g: Kaberuka"
                            />
                          </div>
                        </div>

                        {!editingUser && (
                            <>
                              <div className="space-y-2">
                                <Label htmlFor="password" className="text-sm font-medium">
                                  Password*
                                </Label>
                                <Input
                                    id="password"
                                    value={newUser.password}
                                    onChange={(e) =>
                                        handlePasswordChange(e.target.value)
                                    }
                                    type="password"
                                    required
                                    placeholder="••••••••"
                                />
                                <div className="mt-2">
                                  <div className="flex gap-1 h-1.5 mb-1">
                                    {[1, 2, 3, 4].map((i) => (
                                        <div
                                            key={i}
                                            className={`flex-1 rounded-full ${
                                                passwordStrength >= i
                                                    ? i > 2
                                                        ? "bg-green-500"
                                                        : "bg-yellow-500"
                                                    : "bg-gray-200 dark:bg-gray-600"
                                            }`}
                                        />
                                    ))}
                                  </div>
                                  <p className="text-xs text-gray-500 dark:text-gray-400">
                                    {passwordStrength < 2
                                        ? "Weak password"
                                        : passwordStrength < 4
                                            ? "Moderate password"
                                            : "Strong password"}
                                  </p>
                                </div>
                              </div>

                              <div className="space-y-2">
                                <Label
                                    htmlFor="confirmPassword"
                                    className="text-sm font-medium"
                                >
                                  Confirm Password*
                                </Label>
                                <Input
                                    id="confirmPassword"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    type="password"
                                    required
                                    placeholder="••••••••"
                                />
                              </div>
                            </>
                        )}

                        <div className="space-y-2">
                          <Label htmlFor="role" className="text-sm font-medium">
                            Role
                          </Label>
                          <select
                              id="role"
                              value={newUser.role}
                              onChange={(e) =>
                                  setNewUser({ ...newUser, role: e.target.value })
                              }
                              className="w-full rounded-md border border-gray-300 dark:border-navy-500 bg-white dark:bg-navy-800 p-2 text-sm focus:ring-2 focus:ring-blue-500 dark:focus:ring-navy-300"
                          >
                            <option value="USER">User</option>
                            <option value="ADMIN">Admin</option>
                          </select>
                        </div>
                      </div>

                      <div className="flex justify-end gap-3 mt-6">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setIsDialogOpen(false)}
                            className="px-4 py-2"
                        >
                          Cancel
                        </Button>
                        <Button
                            type="submit"
                            disabled={isLoading === (editingUser?.id || -1)}
                            className="px-4 py-2"
                        >
                          {isLoading === (editingUser?.id || -1) ? (
                              <span className="flex items-center">
                            <svg
                                className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                            >
                              <circle
                                  className="opacity-25"
                                  cx="12"
                                  cy="12"
                                  r="10"
                                  stroke="currentColor"
                                  strokeWidth="4"
                              ></circle>
                              <path
                                  className="opacity-75"
                                  fill="currentColor"
                                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                              ></path>
                            </svg>
                                {editingUser ? "Saving..." : "Creating..."}
                          </span>
                          ) : editingUser ? (
                              "Save Changes"
                          ) : (
                              "Create User"
                          )}
                        </Button>
                      </div>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-navy-700 rounded-lg shadow-sm border border-gray-200 dark:border-navy-600 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                <tr className="bg-gray-50 dark:bg-navy-800">
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-navy-600">
                {filteredUsers.map((user) => (
                    <tr
                        key={user.id}
                        className="hover:bg-gray-50 dark:hover:bg-navy-600 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-10 w-10 flex-shrink-0">
                            <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                            <span className="text-blue-600 dark:text-blue-200 font-medium">
                              {(
                                  user.firstName?.[0] || user.email[0]
                              ).toUpperCase()}
                            </span>
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                              {user.firstName && user.lastName
                                  ? `${user.firstName} ${user.lastName}`
                                  : "Anonymous"}
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                              {user.email}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <select
                            value={user.role}
                            onChange={(e) =>
                                handleRoleChange(user.id, e.target.value)
                            }
                            disabled={isLoading === user.id}
                            className="text-sm rounded-md border-gray-300 dark:border-navy-500 bg-white dark:bg-navy-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 dark:focus:ring-navy-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                          <option value="USER">User</option>
                          <option value="ADMIN">Admin</option>
                        </select>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap space-x-2">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEditUser(user)}
                            disabled={isLoading === user.id}
                        >
                          Edit
                        </Button>
                        <Button
                            variant="ghost"
                            size="sm"
                            className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                            onClick={() => handleDeleteUser(user.id)}
                            disabled={isLoading === user.id}
                        >
                          Delete
                        </Button>
                      </td>
                    </tr>
                ))}
                </tbody>
              </table>
            </div>

            {filteredUsers.length === 0 && (
                <div className="text-center py-12">
                  <div className="text-gray-500 dark:text-gray-400">
                    {searchTerm
                        ? "No users match your search"
                        : "No users found"}
                  </div>
                </div>
            )}
          </div>
        </div>
      </PageContainer>
  );
};

export default UsersList;