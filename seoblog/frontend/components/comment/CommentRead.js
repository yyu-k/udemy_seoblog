'use client'

import '@/css/small_container.css'
import { getComment } from '@/actions/comment';
import { SimpleError } from '../SimpleError';
import { useState, useEffect } from 'react';

import { CommentCard } from './CommentCard';

export const CommentRead = ({slug}) => {
    const [state, setState] = useState({
        comments : [],
        error : ''
    })

    useEffect(() => {
         getComment(slug)
         .then((data) => {
            if (data.error) {
                setState ({...state, error : data.error})
            } else {
                setState({...state, comments : state.comments.concat(data)})
            }
         })
    }, [])

    const comments = () => {
        if (state.error) {
            return <SimpleError error={state.error}/>
        } 
        return (
            state.comments.map(c => {
                return <CommentCard comment={c}/>
            })
        )
    }

    return (
        <>
        <div className='row'>
            <div className='col'>
                <div className='containter container-small mx-auto'>
                    {comments()}
                </div>
            </div>
        </div>
        </>
    )
}