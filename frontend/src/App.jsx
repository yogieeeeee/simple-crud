import React, {useState, useEffect} from "react"
import {Button} from "@/components/ui/button"
import {Input} from "@/components/ui/input"
import {Label} from "@/components/ui/label"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog"
import {Alert, AlertDescription} from "@/components/ui/alert"
import {Trash2, Edit, Plus, User} from "lucide-react"

// API service
const apiService = {
  baseURL: import.meta.env.VITE_API_ENDPOINT,

  async getUsers() {
    const response = await fetch(this.baseURL)
    if (!response.ok) throw new Error("Failed to fetch users")
    return response.json()
  },

  async createUser(userData) {
    const response = await fetch(this.baseURL, {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify(userData)
    })
    if (!response.ok) throw new Error("Failed to create user")
    return response.json()
  },

  async updateUser(id, userData) {
    const response = await fetch(`${this.baseURL}/${id}`, {
      method: "PUT",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify(userData)
    })
    if (!response.ok) throw new Error("Failed to update user")
    return response.json()
  },

  async deleteUser(id) {
    const response = await fetch(`${this.baseURL}/${id}`, {
      method: "DELETE"
    })
    if (!response.ok) throw new Error("Failed to delete user")
    return response.ok
  }
}

// UserCard Component
const UserCard = ({user, onEdit, onDelete}) => {
  return (
    <Card className="w-full">
      <CardContent className="pt-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="p-2 bg-primary/10 rounded-full">
              <User className="h-4 w-4" />
            </div>
            <div>
              <h3 className="font-semibold">{user.name}</h3>
              <p className="text-sm text-muted-foreground">
                {user.age} years old • {user.gender}
              </p>
            </div>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm" onClick={() => onEdit(user)}>
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onDelete(user._id)}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// UserForm Component
const UserForm = ({user, onSubmit, onCancel}) => {
  const [formData, setFormData] = useState({
    name: user?.name || "",
    age: user?.age || "",
    gender: user?.gender || ""
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async () => {
    if (!formData.name || !formData.age || !formData.gender) {
      return
    }

    setIsSubmitting(true)
    try {
      await onSubmit(formData)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (field, value) => {
    setFormData(prev => ({...prev, [field]: value}))
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Name</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={e => handleChange("name", e.target.value)}
          placeholder="Enter name"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="age">Age</Label>
        <Input
          id="age"
          type="number"
          value={formData.age}
          onChange={e => handleChange("age", parseInt(e.target.value))}
          placeholder="Enter age"
          min="1"
          max="120"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="gender">Gender</Label>
        <Select
          value={formData.gender}
          onValueChange={value => handleChange("gender", value)}>
          <SelectTrigger>
            <SelectValue placeholder="Select gender" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Male">Male</SelectItem>
            <SelectItem value="Female">Female</SelectItem>
            <SelectItem value="Other">Other</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex justify-end space-x-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button onClick={handleSubmit} disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : user ? "Update" : "Create"}
        </Button>
      </div>
    </div>
  )
}

// UserList Component
const UserList = ({users, onEdit, onDelete}) => {
  if (users.length === 0) {
    return (
      <div className="text-center py-8">
        <User className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
        <p className="text-muted-foreground">No users found</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {users.map(user => (
        <UserCard
          key={user._id}
          user={user}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  )
}

// Main App Component
const App = () => {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingUser, setEditingUser] = useState(null)

  // Load users
  const loadUsers = async () => {
    try {
      setLoading(true)
      setError("")
      const data = await apiService.getUsers()
      setUsers(Array.isArray(data) ? data : [])
    } catch (error) {
      setError(
        "Failed to load users. Make sure your API server is running on localhost:3000"
      )
      console.error("Error loading users:", error)
    } finally {
      setLoading(false)
    }
  }

  // Create user
  const handleCreate = async userData => {
    try {
      setError("")
      await apiService.createUser(userData)
      await loadUsers()
      setIsDialogOpen(false)
    } catch (error) {
      setError("Failed to create user")
      console.error("Error creating user:", error)
    }
  }

  // Update user
  const handleUpdate = async userData => {
    try {
      setError("")
      await apiService.updateUser(editingUser._id, userData)
      await loadUsers()
      setIsDialogOpen(false)
      setEditingUser(null)
    } catch (error) {
      setError("Failed to update user")
      console.error("Error updating user:", error)
    }
  }

  // Delete user
  const handleDelete = async id => {
    if (!window.confirm("Are you sure you want to delete this user?")) {
      return
    }

    try {
      setError("")
      await apiService.deleteUser(id)
      await loadUsers()
    } catch (error) {
      setError("Failed to delete user")
      console.error("Error deleting user:", error)
    }
  }

  // Edit user
  const handleEdit = user => {
    setEditingUser(user)
    setIsDialogOpen(true)
  }

  // Close dialog
  const handleCloseDialog = () => {
    setIsDialogOpen(false)
    setEditingUser(null)
  }

  // Load users on mount
  useEffect(() => {
    loadUsers()
  }, [])

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">User Management</h1>
          <p className="text-muted-foreground">
            Manage your users with CRUD operations
          </p>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setEditingUser(null)}>
              <Plus className="h-4 w-4 mr-2" />
              Add User
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingUser ? "Edit User" : "Create New User"}
              </DialogTitle>
              <DialogDescription>
                {editingUser
                  ? "Update user information"
                  : "Add a new user to the system"}
              </DialogDescription>
            </DialogHeader>
            <UserForm
              user={editingUser}
              onSubmit={editingUser ? handleUpdate : handleCreate}
              onCancel={handleCloseDialog}
            />
          </DialogContent>
        </Dialog>
      </div>

      {error && (
        <Alert className="mb-6">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Users</CardTitle>
          <CardDescription>
            Total: {users.length} user{users.length !== 1 ? "s" : ""}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">
              <p>Loading users...</p>
            </div>
          ) : (
            <UserList
              users={users}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default App
