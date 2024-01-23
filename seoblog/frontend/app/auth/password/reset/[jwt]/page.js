'use client'
import { useState } from "react";
import { resetPassword } from "@/actions/auth";
import { SimpleError } from "@/components/SimpleError";

export default function Page({params}) {
  const [state, setState] = useState({
    name: '',
    newPassword: '',
    error: '',
    message: '',
    showForm : true
  })

  const handleSubmit = e => {
    e.preventDefault();
    resetPassword({
      resetPasswordLink : params.jwt,
      newPassword : state.newPassword
    })
    .then(data => {
      if (data.error) {
        setState({...state, error : data.error, showForm: false, newPassword : ''});
      } else {
        setState({...state, message : data.message, showForm: false, newPassword: '', error : ''});
      }
    })
  }

  const showForm = () => {
    if (state.showForm) {
        return (
            <>
            <div className="container">
                <form onSubmit={handleSubmit}>
                    <div className="form-group pt-5">
                        <input type="password" onChange={e => setState({...state, newPassword: e.target.value})} 
                          className="form-control" 
                          value={state.newPassword} 
                          placeholder="Please type your new password" 
                          required/>
                    </div>
                    <div>
                        <button className="btn btn-primary mt-5">
                            Update Password
                        </button>
                    </div>
                </form>
            </div>
            </>
        )
      }
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

  return (
      <>
      <div className="container">
        <h2>Reset Password</h2>
        <hr/>
        {showError()}
        {showMessage()}
        {showForm()}
      </div>
      </>
    )
  }