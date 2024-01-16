'use client'

import { useSearchParams } from "next/navigation"

export const ShowRedirectMsg = () => {
    const searchParams = useSearchParams()
    const redirect = searchParams.get('rdr')
    if(redirect){
        return (
            <div className="alert alert-danger" role="alert">
                {redirect}
            </div>
        )
    }
}