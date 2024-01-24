'use client'

const { useEffect, useState } = require("react");
import { useRouter } from 'next/navigation';
import { getLocalStorageUser } from '@/actions/auth';

const Private = ({children}) => {
    const router = useRouter();
    const [loading, setIsLoading] = useState(true);
    useEffect(() => {
        if(!getLocalStorageUser()) {
            router.push('/signin');
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


export default Private