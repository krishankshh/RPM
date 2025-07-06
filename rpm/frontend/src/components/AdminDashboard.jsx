import { useState, useEffect } from 'react'
import { Users, UserCheck, UserX, Shield, Calendar, CheckSquare, Square } from 'lucide-react'
import { Button } from './ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Badge } from './ui/badge'
import { Alert, AlertDescription } from './ui/alert'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs'

const AdminDashboard = () => {
  const [stats, setStats] = useState(null)
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedUsers, setSelectedUsers] = useState(new Set())
  const [currentPage, setCurrentPage] = useState(1)
  const [filter, setFilter] = useState('waitlist')
  const [pagination, setPagination] = useState(null)
  const [message, setMessage] = useState('')

  useEffect(() => {
    fetchStats()
    fetchUsers()
  }, [currentPage, filter])

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch('/api/admin/stats', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      
      if (response.ok) {
        const data = await response.json()
        setStats(data)
      }
    } catch (error) {
      console.error('Error fetching stats:', error)
    }
  }

  const fetchUsers = async () => {
    try {
      setLoading(true)
      const token = localStorage.getItem('token')
      const response = await fetch(`/api/admin/users?page=${currentPage}&limit=20&filter=${filter}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      
      if (response.ok) {
        const data = await response.json()
        setUsers(data.users)
        setPagination(data.pagination)
      }
    } catch (error) {
      console.error('Error fetching users:', error)
    } finally {
      setLoading(false)
    }
  }

  const whitelistUser = async (userId) => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`/api/admin/whitelist/${userId}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      
      if (response.ok) {
        setMessage('User whitelisted successfully!')
        fetchUsers()
        fetchStats()
        setTimeout(() => setMessage(''), 3000)
      }
    } catch (error) {
      console.error('Error whitelisting user:', error)
    }
  }

  const bulkWhitelist = async () => {
    if (selectedUsers.size === 0) return

    try {
      const token = localStorage.getItem('token')
      const response = await fetch('/api/admin/bulk-whitelist', {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          user_ids: Array.from(selectedUsers)
        })
      })
      
      if (response.ok) {
        const data = await response.json()
        setMessage(data.message)
        setSelectedUsers(new Set())
        fetchUsers()
        fetchStats()
        setTimeout(() => setMessage(''), 3000)
      }
    } catch (error) {
      console.error('Error bulk whitelisting:', error)
    }
  }

  const toggleUserSelection = (userId) => {
    const newSelected = new Set(selectedUsers)
    if (newSelected.has(userId)) {
      newSelected.delete(userId)
    } else {
      newSelected.add(userId)
    }
    setSelectedUsers(newSelected)
  }

  const selectAllVisible = () => {
    const waitlistUsers = users.filter(user => !user.is_whitelisted)
    const allSelected = waitlistUsers.every(user => selectedUsers.has(user._id))
    
    if (allSelected) {
      // Deselect all visible waitlist users
      const newSelected = new Set(selectedUsers)
      waitlistUsers.forEach(user => newSelected.delete(user._id))
      setSelectedUsers(newSelected)
    } else {
      // Select all visible waitlist users
      const newSelected = new Set(selectedUsers)
      waitlistUsers.forEach(user => newSelected.add(user._id))
      setSelectedUsers(newSelected)
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (loading && !users.length) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading admin dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="text-gray-600">Manage users and waitlist</p>
          </div>
          <div className="flex items-center space-x-2">
            <Shield className="h-5 w-5 text-blue-600" />
            <span className="text-sm font-medium text-blue-600">Admin Access</span>
          </div>
        </div>

        {/* Message */}
        {message && (
          <Alert className="bg-green-50 border-green-200">
            <AlertDescription className="text-green-800">{message}</AlertDescription>
          </Alert>
        )}

        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.total_users}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Waitlisted</CardTitle>
                <UserX className="h-4 w-4 text-orange-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-orange-600">{stats.waitlisted_users}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Whitelisted</CardTitle>
                <UserCheck className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">{stats.whitelisted_users}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Admins</CardTitle>
                <Shield className="h-4 w-4 text-blue-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">{stats.admin_users}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">This Week</CardTitle>
                <Calendar className="h-4 w-4 text-purple-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-purple-600">{stats.recent_registrations}</div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* User Management */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>User Management</CardTitle>
                <CardDescription>Manage user access and permissions</CardDescription>
              </div>
              {selectedUsers.size > 0 && (
                <Button onClick={bulkWhitelist} className="bg-green-600 hover:bg-green-700">
                  Whitelist Selected ({selectedUsers.size})
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <Tabs value={filter} onValueChange={setFilter}>
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="waitlist">Waitlist ({stats?.waitlisted_users || 0})</TabsTrigger>
                <TabsTrigger value="whitelisted">Whitelisted ({stats?.whitelisted_users || 0})</TabsTrigger>
                <TabsTrigger value="all">All Users ({stats?.total_users || 0})</TabsTrigger>
              </TabsList>

              <TabsContent value={filter} className="space-y-4">
                {/* Bulk Actions */}
                {filter === 'waitlist' && users.some(user => !user.is_whitelisted) && (
                  <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={selectAllVisible}
                      className="flex items-center space-x-2"
                    >
                      {users.filter(user => !user.is_whitelisted).every(user => selectedUsers.has(user._id)) ? (
                        <CheckSquare className="h-4 w-4" />
                      ) : (
                        <Square className="h-4 w-4" />
                      )}
                      <span>Select All Visible</span>
                    </Button>
                    <span className="text-sm text-gray-600">
                      {selectedUsers.size} users selected
                    </span>
                  </div>
                )}

                {/* Users Table */}
                <div className="border rounded-lg overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          {filter === 'waitlist' && (
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Select
                            </th>
                          )}
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            User
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Academic Level
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Subject
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Status
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Registered
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {users.map((user) => (
                          <tr key={user._id} className="hover:bg-gray-50">
                            {filter === 'waitlist' && !user.is_whitelisted && (
                              <td className="px-4 py-4">
                                <button
                                  onClick={() => toggleUserSelection(user._id)}
                                  className="text-blue-600 hover:text-blue-800"
                                >
                                  {selectedUsers.has(user._id) ? (
                                    <CheckSquare className="h-4 w-4" />
                                  ) : (
                                    <Square className="h-4 w-4" />
                                  )}
                                </button>
                              </td>
                            )}
                            {filter === 'waitlist' && user.is_whitelisted && (
                              <td className="px-4 py-4"></td>
                            )}
                            <td className="px-4 py-4">
                              <div>
                                <div className="text-sm font-medium text-gray-900">{user.name}</div>
                                <div className="text-sm text-gray-500">{user.email}</div>
                              </div>
                            </td>
                            <td className="px-4 py-4 text-sm text-gray-900">
                              {user.academic_level || 'Not set'}
                            </td>
                            <td className="px-4 py-4 text-sm text-gray-900">
                              {user.subject_interest || 'Not set'}
                            </td>
                            <td className="px-4 py-4">
                              <div className="flex items-center space-x-2">
                                {user.is_whitelisted ? (
                                  <Badge className="bg-green-100 text-green-800">Whitelisted</Badge>
                                ) : (
                                  <Badge className="bg-orange-100 text-orange-800">Waitlist</Badge>
                                )}
                                {user.is_admin && (
                                  <Badge className="bg-blue-100 text-blue-800">Admin</Badge>
                                )}
                              </div>
                            </td>
                            <td className="px-4 py-4 text-sm text-gray-500">
                              {formatDate(user.created_at)}
                            </td>
                            <td className="px-4 py-4">
                              {!user.is_whitelisted && (
                                <Button
                                  size="sm"
                                  onClick={() => whitelistUser(user._id)}
                                  className="bg-green-600 hover:bg-green-700"
                                >
                                  Whitelist
                                </Button>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Pagination */}
                {pagination && pagination.pages > 1 && (
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-700">
                      Showing {((pagination.page - 1) * pagination.limit) + 1} to{' '}
                      {Math.min(pagination.page * pagination.limit, pagination.total)} of{' '}
                      {pagination.total} results
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage(currentPage - 1)}
                        disabled={currentPage === 1}
                      >
                        Previous
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage(currentPage + 1)}
                        disabled={currentPage === pagination.pages}
                      >
                        Next
                      </Button>
                    </div>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default AdminDashboard

