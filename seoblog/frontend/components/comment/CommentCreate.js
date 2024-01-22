'use client'

import '@/css/small_container.css'
import { getLocalStorageUser } from "@/actions/auth";
import { useEffect, useState } from 'react';

import { sendComment } from '@/actions/comment';
import { getCookie } from '@/actions/auth';
import { SimpleError } from '../SimpleError';

export const CommentCreate = ({slug}) => {
    const [state, setState] = useState({
        message : '',
        buttonText: 'Submit',
        error : '',
        success : false,
        user : '',
        loading : true
    })
    
    useEffect(()=> {
        const user = getLocalStorageUser();
        setState({...state, user, loading : false});
    }, [])

    const PleaseLogIn = () => {
        return (
            <>
            <div className="container container-small alert alert-primary text-center" role="alert">
                Please log in to comment
            </div>
            </>
        )
    }

    const submit = (e) => {
        const event = new Event("comment");
        const token = getCookie('token');
        e.preventDefault();
        setState({...state, buttonText : "Submitting"})
        sendComment({text : state.message, slug}, token)
        .then((response) => {
            if (response.error) {
                setState({...state, buttonText : "Submit", error : response.error})
            } else {
                setState({...state, message : '', buttonText : "Submit", error : '', success : true})
                window.dispatchEvent(event);
            }
        })
    }

    const handleChange = (e) => {
        setState({...state, message : e.target.value, error : '', success : false})
    }

    const form = () => {
        return (
            <form onSubmit={submit} className="pb-5">
                <div className="form-group">
                    <label className="lead">
                        Comment (not more than 160 characters)
                    </label>
                    <textarea onChange={handleChange}
                        type="text"
                        className="form-control"
                        value={state.message}
                        required={true}
                        rows={5}/>
                </div>
                <div>
                    <button className="btn btn-primary mt-2 mb-2">
                        {state.buttonText}
                    </button>
                </div>
            </form>
        )
    }

    const showError = () => {
        if (state.error) {
            return <SimpleError error={state.error}/>
        }
    }

    const showSuccess = () => {
        if (state.success) {
            return (
                <div className='alert alert-info' role='alert'>
                    Comment successfully submitted!
                </div>
            )
        }
    }

    if (!state.user && !state.loading) {
        return <PleaseLogIn/>;
    }
    return (
        <>
        <div className='row'>
            <div className='col'>
                <div className='containter container-small mx-auto'>
                    {showError()}
                    {showSuccess()}
                    {form()}
                </div>
            </div>
        </div>
        </>
    )
}