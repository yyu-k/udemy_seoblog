'use client'

import {useEffect, useState} from 'react';
import { signin, saveData } from '@/actions/auth';
import { useRouter } from 'next/navigation';
import { getLocalStorageUser } from '@/actions/auth';

const SignInComponent = () => {
    const router = useRouter();
    const [values, setValues] = useState({
        email: 'testEmail@email.com',
        password: 'testPassword',
        error: '',
        loading: false,
        message: '',
        showForm: true
    })
    const {email, password, error, loading, message, showForm} = values;

    //don't show the page if user is already signed in
    useEffect(() => {
        const isSignedIn = !!getLocalStorageUser();
        if (isSignedIn) {
            setValues({...values, showForm : false});
            router.replace('/');
        }
    }, []);


    const handleSubmit = (e) => {
        e.preventDefault(); //browser will show network error otherwise
        setValues({...values, loading : true, error: false});
        const user = {email, password};
        signin(user)
        .then((data) => { //this assumes that the API gives a string as an error instead of the actual error object
            if (data.error) {
                setValues({...values, error: data.error, loading: false});
                console.log(data.error); //Added for debugging
            }else {
                //save user token to cookie and save user info to local storage
                saveData(data, () => {
                    router.push('/'); //redirect the user to some other page based on user identity
                });
            }
        } 
        )
    }

    const handleChange = (name) => (e) => { //curried function -> returns a function that takes in the e
        setValues({...values, error: false, [name]: e.target.value})
    }
   
    const showLoading = () => {
        return (loading ? <div className='alert alert-info'>Loading...</div> : '');
    }

    const showAlreadySignedIn = () => {
        return (
            <div className='alert alert-info'>
                You are already signed in. Redirecting...
            </div>
        )
    }

    const showError = () => {
        return (error ? <div className='alert alert-danger'>{error}</div> : '');
    }

    const showMessage = () => {
        return (message ? <div className='alert alert-info'>{message}</div> : '');
    }

    const signinForm = () => {
        return (
            <form onSubmit={handleSubmit}>
                <div className='form-group' style={{marginBottom: 20}}>
                    <input value={email} onChange={handleChange('email')} type="email" className="form-control" placeholder="Type your email"/>
                </div>

                <div className='form-group' style={{marginBottom: 20}}>
                    <input value={password} onChange={handleChange('password')} type="password" className="form-control" placeholder="Type your password"/>
                </div>

                <div>
                    <button className="btn btn-primary">Sign In</button>
                </div>

            </form>
        )
    }

    const allSignInComponents = () => {
        return (
            <>
            {showError()}
            {showLoading()}
            {showMessage()}
            {showForm && signinForm()}
            </>  
        )
    }

    return (
        <>  
         {showForm ? allSignInComponents() :
            showAlreadySignedIn()}
        </>
    ) //notice that signupForm() will not be evaluated if showForm is false
    //the page will be redrawn when there is a change of state, and showError etc will run if necessary.
};

export default SignInComponent;