'use client'
import Box from '@mui/material/Box'
import CircularProgress from '@mui/material/CircularProgress'
import { useAuth } from '@/contexts/auth-context'
import StudentView from '@/components/home/StudentView'
import TeacherView from '@/components/home/TeacherView'
import AdminView from '@/components/home/AdminView'

export default function DashboardPage() {
  const { user, loading } = useAuth()

  if (loading || !user) {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
        <CircularProgress />
      </Box>
    )
  }

  const role = user.role.toUpperCase()
  if (role === 'ADMIN') return <AdminView user={user} />
  if (role === 'TEACHER') return <TeacherView user={user} />
  return <StudentView user={user} />
}
