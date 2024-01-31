'use client'

import { useRouter } from 'next/navigation';
import Loading from '@/components/LoadingComponent';
import { getLocalStorageUser } from '@/actions/auth';

export default function Page() {
  const router = useRouter();
  const user = getLocalStorageUser();
  if (!user) {
    router.push('/signin');
  } else if (user.role === 1) {
    router.push('/admin')
  } else {
    router.push('/user')
  }
  return <div className='container'><Loading/></div>
}
