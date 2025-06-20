// pages/users/index.tsx

import { useEffect, useState } from "react";
import { Plus, Search, Edit, Trash, ShieldCheck, UserCog, User as UserIcon } from "lucide-react";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import DeleteConfirmationDialog from "@/components/shared/DeleteConfirmationDialog";
import UserFormModal from "@/components/users/UserFormModal";
import { User } from "@/types";
import { useToast } from "@/hooks/use-toast";

const getRoleBadgeClass = (role?: string) => {
  switch (role) {
    case "admin": return "bg-red-100 text-red-800";
    case "manager": return "bg-yellow-100 text-yellow-800";
    default: return "bg-blue-100 text-blue-800";
  }
};

const getRoleIcon = (role?: string) => {
  switch (role) {
    case "admin": return <ShieldCheck className="h-3 w-3 mr-1" />;
    case "manager": return <UserCog className="h-3 w-3 mr-1" />;
    default: return <UserIcon className="h-3 w-3 mr-1" />;
  }
};

export default function UsersPage() {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await fetch("/api/users");
      const data = await res.json();
      setUsers(data);
      setFilteredUsers(data);
    } catch (err) {
      toast({ title: "Error", description: "Failed to fetch users.", variant: "destructive" });
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    setFilteredUsers(users.filter(user =>
      user.name.toLowerCase().includes(query) ||
      user.email.toLowerCase().includes(query) ||
      user.department?.toLowerCase().includes(query) ||
      user.position?.toLowerCase().includes(query) ||
      user.role?.toLowerCase().includes(query)
    ));
  };

  const handleAddUser = () => {
    setEditingUser(null);
    setIsUserModalOpen(true);
  };

  const handleEditUser = (user: User) => {
    setEditingUser(user);
    setIsUserModalOpen(true);
  };

  const handleDeleteUser = (user: User) => {
    setCurrentUser(user);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!currentUser) return;
    try {
      await fetch(`/api/users/${currentUser.id}`, { method: "DELETE" });
      toast({ title: "User Deleted", description: `${currentUser.name} was deleted.`, variant: "destructive" });
      setIsDeleteDialogOpen(false);
      setCurrentUser(null);
      fetchUsers();
    } catch (err) {
      toast({ title: "Error", description: "Failed to delete user.", variant: "destructive" });
    }
  };

  const handleSaveUser = async (userData: Partial<User>) => {
  try {
    const isEdit = !!editingUser;
    const response = await fetch(
      isEdit ? `/api/users/${editingUser.id}` : "/api/users",
      {
        method: isEdit ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...userData, role: userData.role || "user" }),
      }
    );

    if (!response.ok) {
      const err = await response.json();
      throw new Error(err?.error || "Failed to save user.");
    }

    toast({
      title: isEdit ? "User Updated" : "User Created",
      description: `User "${userData.name}" saved successfully.`,
    });

    setIsUserModalOpen(false);
    fetchUsers();
  } catch (err: any) {
    toast({
      title: "Error",
      description: err.message,
      variant: "destructive",
    });
  }
};

  return (
    <Layout title="Users | IT Asset Manager">
      <div className="space-y-6 p-4 md:p-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Users</h1>
          <Button onClick={handleAddUser}>
            <Plus className="h-4 w-4 mr-2" /> Add User
          </Button>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>User Management</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex mb-4">
              <Input
                placeholder="Search users..."
                value={searchQuery}
                onChange={handleSearch}
                className="w-full"
              />
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.length > 0 ? filteredUsers.map(user => (
                  <TableRow key={user.id}>
                    <TableCell>{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <Badge className={getRoleBadgeClass(user.role)}>
                        {getRoleIcon(user.role)}
                        {user.role?.charAt(0).toUpperCase() + user.role?.slice(1) || 'User'}
                      </Badge>
                    </TableCell>
                    <TableCell>{user.department || '-'}</TableCell>
                    <TableCell>{user.location || '-'}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="icon" onClick={() => handleEditUser(user)}>
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="outline" size="icon" onClick={() => handleDeleteUser(user)}>
                          <Trash className="w-4 h-4 text-red-500" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                )) : (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-4 text-muted-foreground">No users found</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <UserFormModal
          isOpen={isUserModalOpen}
          onClose={() => setIsUserModalOpen(false)}
          onSave={handleSaveUser}
          user={editingUser}
        />

        {isDeleteDialogOpen && currentUser && (
          <DeleteConfirmationDialog
            isOpen={isDeleteDialogOpen}
            onClose={() => setIsDeleteDialogOpen(false)}
            onConfirm={confirmDelete}
            itemName={`user ${currentUser.name}`}
          />
        )}
      </div>
    </Layout>
  );
}
