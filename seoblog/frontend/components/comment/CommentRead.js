'use client'

import '@/css/small_container.css'
import { getComment } from '@/actions/comment';
import { SimpleError } from '../SimpleError';
import { useState, useEffect, useRef } from 'react';

import { CommentCard } from './CommentCard';
import { COMMENT_LOAD_LIMIT } from '@/config';

export const CommentRead = ({slug}) => {
    const [state, setState] = useState({
        error : '',
        skip : 0,
        limit : COMMENT_LOAD_LIMIT,
        loadSize : 0,
        comments : []
    })

    

    const loadMore = () => {
        getComment(state.skip, state.limit, slug)
        .then((data) => {
        if (data.error) {
            setState ({...state, error : data.error})
        } else {
            const newState = state.comments.concat(data);
            setState({...state, 
                loadSize : data.length,
                skip : state.skip + state.limit,
                comments : newState})
        }
        })
    }

    const reloadNewest = () => {
        getComment(0, state.limit, slug)
        .then((data) => {
        if (data.error) {
            setState ({...state, error : data.error})
        } else {
            setState({...state, 
                loadSize : data.length,
                skip : 0 + state.limit,
                comments : data})
        }
        })
    }
    
    useEffect(() => {
        loadMore();
    }, [])

    useEffect(() => {
        window.addEventListener("comment", reloadNewest);
        return () => {
            window.removeEventListener("comment", reloadNewest);
        };
    }, [])

    const commentsRender = () => {
        if (state.error) {
            return <SimpleError error={state.error}/>
        } 
        return (
           state.comments.map(c => {
                return <CommentCard comment={c} key={c._id}/>
            })
        )
    }

    const loadMoreButton = () => {
        if (state.loadSize >= state.limit) {
            return (
                <button type='button' className='btn btn-primary' onClick={loadMore}>
                    Load More Comments
                </button>
            )
        }
    }

    return (
        <>
        <div className='row'>
            <div className='col'>
                <div className='containter container-small mx-auto'>
                    {commentsRender()}
                    {loadMoreButton()}
                </div>
            </div>
        </div>
        </>
    )
}