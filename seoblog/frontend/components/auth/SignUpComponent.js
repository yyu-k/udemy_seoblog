'use client'

import {useState, useEffect} from 'react';
import { signup, getLocalStorageUser } from '@/actions/auth';
import { useRouter } from 'next/navigation';

const SignUpComponent = () => {
    const router = useRouter();
    const [values, setValues] = useState({
        name: 'testName',
        email: 'testEmail@email.com',
        password: 'testPassword',
        error: '',
        loading: true,
        message: '',
        showForm: true,
    })

    const {name, email, password, error, loading, message, showForm, isSignedIn} = values;

    //don't show the page if user is already signed in
    useEffect(() => {
        const isSignedIn = !!getLocalStorageUser();
        if (isSignedIn) {
            router.replace('/user');
        } else {
            setValues({...values, loading : false});
        }
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault(); //browser will show network error otherwise
        setValues({...values, loading : true, error: false});
        const user = {name, email, password};
        signup(user)
        .then((data) => { //this assumes that the API gives a string as an error instead of the actual error object
            if (data.error) {
                setValues({...values, error: data.error, loading: false});
                console.log(data.error); //Added for debugging
            } else {
                setValues({...values, name: '', email: '', password: '', error: '', loading: false, message: data.message, showForm: false});
            }
        } 
        )
    }

    const handleChange = (name) => (e) => { //curried function -> returns a function that takes in the e
        setValues({...values, error: false, [name]: e.target.value})
    }

    const showAlreadySignedIn = () => {
        return (
            <div className='alert alert-info'>
                You are already signed in. Redirecting...
            </div>
        )
    }
    
    const showLoading = () => {
        return (loading ? <div className='alert alert-info'>Loading...</div> : '');
    }

    const showError = () => {
        return (error ? <div className='alert alert-danger'>{error}</div> : '');
    }

    const showMessage = () => {
        return (message ? <div className='alert alert-info'>{message}</div> : '');
    }

    const signupForm = () => {
        return (
            <form onSubmit={handleSubmit}>
                <div className='form-group' style={{marginBottom: 20}}>
                    <input value={name} onChange={handleChange('name')} type="text" className="form-control" placeholder="Type your name"/>
                </div>

                <div className='form-group' style={{marginBottom: 20}}>
                    <input value={email} onChange={handleChange('email')} type="email" className="form-control" placeholder="Type your email"/>
                </div>

                <div className='form-group' style={{marginBottom: 20}}>
                    <input value={password} onChange={handleChange('password')} type="password" className="form-control" placeholder="Type your password"/>
                </div>

                <div>
                    <button className="btn btn-primary">Sign Up</button>
                </div>

            </form>
        )
    }
    const allSignUpComponents = () => {
        return (
            <> 
            {showError()}
            {showLoading()}
            {showMessage()}
            {showForm && signupForm()}
            </>  
        )
    }

    if (loading) {
        return (
            <>
            {showLoading()}
            </>
        )
    } 
    return (
        <>  
         {!isSignedIn ? allSignUpComponents() :
            showAlreadySignedIn()}
        </>
    ) //notice that signupForm() will not be evaluated if showForm is false
    //the page will be redrawn when there is a change of state, and showError etc will run if necessary.
};

export default SignUpComponent;