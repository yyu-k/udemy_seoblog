'use client'

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Loading from '@/components/LoadingComponent';
import { getLocalStorageUser } from '@/actions/auth';

export default function Page() {
  const router = useRouter();
  const user = getLocalStorageUser();
  //from https://stackoverflow.com/questions/72160276/warning-cannot-update-a-component-browserrouter-while-rendering-a-different
  useEffect(()=>{
    if (!user) {
      router.push('/signin');
    } else if (user.role === 1) {
      router.push('/admin');
    } else {
      router.push('/user');
    }
  },[user])
  return <div className='container'><Loading/></div>
}
