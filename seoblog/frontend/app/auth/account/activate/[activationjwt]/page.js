'use client'
import { useState, useEffect } from "react";
import { signup } from "@/actions/auth";
import jwt from 'jsonwebtoken'
import Loading from "@/components/LoadingComponent";
import { SimpleError } from "@/components/SimpleError";

export default function Page({params}) {
  const [values, setValues] = useState({
    name : '',
    token : '',
    error : '',
    loading : false,
    success : false,
    showButton : true
  })

  useEffect(() => {
    const token = params.activationjwt;
    if (token) {
      const {name} = jwt.decode(token);
      setValues({...values, name, token});
    }
  }, []);

  const clickSubmit = (e) => {
    e.preventDefault();
    setValues({...values, loading : true, error : false});
    signup({token : values.token})
    .then(data => {
      if (data.error) {
        setValues({... values, error : data.error, loading : false, showButton : false});
      } else {
        setValues({...values, loading : false, success: true, showButton : false});
      }
    });
  }

  const showLoading = () => {
    if (values.loading) {
      return (
        <Loading/>
      )
    }
  }

  const showError = () => {
    if (values.error) {
      return (
        <SimpleError error={values.error}/>
      )
    }
  }

  const showSuccess = () => {
    if (values.success) {
      return (
        <div className="alert alert-success container" role='alert'>
            Congratulations! You have successfully activated your account. Please sign in. 
        </div>
      )
    }
  }

  const showButton = () => {
    if (values.showButton) {
      return (
        <button className="btn btn-outline-primary" onClick={clickSubmit}>
          Activate Account
        </button>
      );
    }
  }

  return (
      <>
      <div className="container">
        <h3 className="pb-4">Dear {values.name}, click the button below to activate your account</h3>
        {showLoading()}
        {showError()}
        {showSuccess()}
        {showButton()}
      </div>
      </>
    )
  }