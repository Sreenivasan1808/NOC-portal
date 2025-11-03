import { getCurrentUser } from '@/lib/auth';
import { redirect } from 'next/navigation';

const DashboardPage = async () => {
  // Determine the user's role and redirect to the appropriate dashboard only when
  // visiting the /dashboard index route.
  const user = await getCurrentUser();
  if (!user) return redirect('/login');

  const role = user.role;
  switch (role) {
    case 'admin':
      return redirect('/dashboard/admin');
    case 'student':
      return redirect('/dashboard/student');
    case 'facultyadv':
      return redirect('/dashboard/facultyadv');
    case 'deptrep':
      return redirect('/dashboard/deptrep');
    default:
      return redirect('/unauthorized');
  }
};

export default DashboardPage;
