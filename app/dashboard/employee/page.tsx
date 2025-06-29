  "use client"

  import { useEffect, useState } from "react"
  import { Button } from "@/components/ui/button"
  import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table"
  import { Switch } from "@/components/ui/switch"
  import { useRouter } from "next/navigation"
  import { toast } from "sonner"
  import { AlertDialog, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { deleteUser } from "@/lib/actions/user.actions"

  interface User {
    _id: string
    email: string
    username: string
    isAdmin: boolean
  }

  const UserManagementPage = () => {
    const [users, setUsers] = useState<User[]>([])
    const [loading, setLoading] = useState(true)
    const router = useRouter()

    useEffect(() => {
      fetch("/api/users")
        .then((res) => res.json())
        .then(setUsers)
        .finally(() => setLoading(false))
    }, [])

    const toggleAdmin = async (userId: string, isAdmin: boolean) => {
      const adminCount = users.filter((u) => u.isAdmin).length

      // Prevent unchecking the last admin
      if (adminCount === 1 && isAdmin) {
        toast.warning("At least one admin is required.")
        return
      }

      try {
        const res = await fetch(`/api/users`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId, isAdmin: !isAdmin }),
        })

        if (!res.ok) throw new Error("Failed to update admin status")

        setUsers((prev) =>
          prev.map((u) => (u._id === userId ? { ...u, isAdmin: !isAdmin } : u))
        )
      } catch (err) {
        console.error(err);
        toast.error("Failed to toggle admin mode")
      }
    }

    const handleDeleteUser = async (userId: string) => {
        await deleteUser({ 
          id: userId as string, 
        })
        setUsers((prev) => prev.filter((u) => u._id !== userId))
        toast.success("User deleted")
    }

    return (
      <div className="p-6 space-y-4">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">User Management</h1>
          <Button onClick={() => router.push("/sign-up")}>+ Add User</Button>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Email</TableHead>
              <TableHead>Username</TableHead>
              <TableHead className="text-center">Admin</TableHead>
              <TableHead className="text-right"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={5}>Loading...</TableCell>
              </TableRow>
            ) : users.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5}>No users found.</TableCell>
              </TableRow>
            ) : (
              users.map((user) => (
                <TableRow key={user._id}>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.username}</TableCell>
                  <TableCell className="text-center">
                    <Switch
                      checked={user.isAdmin}
                      onCheckedChange={() => toggleAdmin(user._id, user.isAdmin)}
                    />
                  </TableCell>
                  <TableCell className="text-right">
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="destructive" size="sm">
                          Delete
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete user?</AlertDialogTitle>
                          <AlertDialogDescription>This action cannot be undone.</AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="destructive"
                              disabled={users.length === 1}
                              title={users.length === 1 ? "Cannot delete the last user" : ""}
                              onClick={() => handleDeleteUser(user._id)}
                            >
                              Delete
                            </Button>
                          </AlertDialogTrigger>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    )
  }

  export default UserManagementPage
