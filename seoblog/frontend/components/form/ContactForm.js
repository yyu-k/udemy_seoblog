'use client'

import { useState } from "react"
import Link from "next/link"
import { emailContactForm } from "@/actions/form"

export const ContactForm = ({authorEmail}) => {
    const [state, setState] = useState({
        message : '',
        name : '',
        email : '',
        sent : false,
        buttonText: 'Send Message',
        success : false,
        error : ''
    })

    const submit = (event) => {
        event.preventDefault();
        setState({...state, buttonText: 'Sending...'});
        emailContactForm({name : state.name,
            email : state.email,
            message : state.message,
            authorEmail})
            .then(data => {
                if(data.error) {
                    setState({...state, error : data.error});
                } else {
                    setState({...state, sent : true, name : '', email : '', message : '', buttonText : 'Sent!', success: data.success})
                }
            })
        
    } 

    const handleChange = (name) => (event) => {
        event.preventDefault();
        setState({...state, [name] : event.target.value, error : false, success : false, buttonText : 'Send Message'})
    }

    const showSuccessMessage = () => {
        if (state.success) {
            return (
                <div className="alert alert-info">
                    Thank you for contacting us
                </div>
            );
        }
    }

    const showError = () => {
        if (state.error) {
            return (
                <div className="alert alert-danger"> 
                    {state.error}
                </div>
            )
        }
    }

    const form = () => {
        return (
            <form onSubmit={submit} className="pb-5">
                <div className="form-group">
                    <label className="lead">
                        Message
                    </label>
                    <textarea onChange={handleChange('message')}
                        type="text"
                        className="form-control"
                        value={state.message}
                        required={true}
                        rows={10}/>
                </div>
                <div className="form-group">
                    <label className="lead">
                        Name
                    </label>
                    <input onChange={handleChange('name')}
                        type="text"
                        className="form-control"
                        value={state.name}
                        required={true}
                        />
                </div>
                <div className="form-group">
                    <label className="lead">
                        Email
                    </label>
                    <input onChange={handleChange('email')}
                        type="email"
                        className="form-control"
                        value={state.email}
                        required={true}
                        />
                </div>
                <div>
                    <button className="btn btn-primary mt-2 mb-2">
                        {state.buttonText}
                    </button>
                </div>
            </form>
        )
    }

    return (
        <>
        {showSuccessMessage()}
        {showError()}
        {form()}
        </>
    )
}