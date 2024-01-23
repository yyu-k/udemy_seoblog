'use client'

import { useState } from "react"
import { forgotPassword } from "@/actions/auth"
import { SimpleError } from "@/components/SimpleError";

export default function Page() {
    const [state, setState] = useState({
        email : '',
        message : '',
        error : '',
        showForm : true
    });

    const handleChange = (name) => (e) => {
        e.preventDefault();
        setState({...state, message : '', error : '', [name]: e.target.value});
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        setState({...state, message: '', error : ''});
        forgotPassword(state.email)
        .then(data=> {
            if(data.error) {
                setState({...state, error : data.error});
            } else {
                setState({...state, 
                    message : data.success ? 'Forgot password link sent to your email' : 'Something has gone wrong, please try again later',
                    email: '',
                    showForm: false});
            }
        })
    }

    const showError = () => {
        if (state.error){
            return (
                <SimpleError error={state.error}/>
            )
        }
    }

    const showMessage = () => {
        if (state.message) {
            return (
                <div className="alert alert-success">
                    {state.message}
                </div>
            );
        }
    }

    const showForm = () => {
        if (state.showForm) {
            return (
                <>
                <div className="container">
                    <form onSubmit={handleSubmit}>
                        <div className="form-group pt-5">
                            <input type="text" onChange={handleChange("email")} className="form-control" value={state.email} placeholder="Please type your registered email" required/>
                        </div>
                        <div>
                            <button className="btn btn-primary mt-5">
                                Send Password Reset Link
                            </button>
                        </div>
                    </form>
                </div>
                </>
            )
        }
    }

    return (
      <div className="container">
        <h2>Forgot Password</h2>
        <hr/>
        {showError()}
        {showMessage()}
        {showForm()}
      </div>
    )
  }