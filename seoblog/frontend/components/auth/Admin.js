'use client'

const { useEffect, useState } = require("react");
import { useRouter } from 'next/navigation';
import { getLocalStorageUser } from '@/actions/auth';

const Admin = ({children}) => {
    const router = useRouter();
    const [loading, setIsLoading] = useState(true);
    useEffect(() => {
        if(!getLocalStorageUser()) {
            router.push('/signin');
        } else if (getLocalStorageUser().role != 1) {
            router.push('/user');
        } else {
            setIsLoading(false);
        }
    }, [])
    if (loading) {
        return (
            <>
            </>
        )
    } else {
        return (
            <>
            {children}
            </>
        )
    }
}

export default Admin