'use client'

const { useEffect, useState } = require("react");
import { useRouter } from 'next/navigation';
import { getLocalStorageUser } from '@/actions/auth';
import Loading from '../LoadingComponent';

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
            <Loading/>
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