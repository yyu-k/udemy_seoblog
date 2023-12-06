'use client'

import {useState} from 'react';

const SignUpComponent = () => {
    const [values, setValues] = useState({
        name: 'testName',
        email: 'testEmail@email.com',
        password: 'testPassword',
        error: '',
        loading: false,
        message: '',
        showForm: true
    })

    const {name, email, password, error, loading, message, showForm} = values;


    const handleSubmit = (e) => {
        e.preventDefault();
        console.table(values);
    }

    const handleChange = (name) => (e) => { //curried function -> returns a function that takes in the e
        setValues({...values, error: false, [name]: e.target.value})
    }

    const signupForm = () => {
        return (
            <form onSubmit={handleSubmit}>
                <div className='form-group'>
                    <input onChange={handleChange('name')} type="text" className="form-control" placeholder="Type your name"/>
                </div>

                <div className='form-group'>
                    <input onChange={handleChange('email')} type="email" className="form-control" placeholder="Type your email"/>
                </div>

                <div className='form-group'>
                    <input onChange={handleChange('password')} type="password" className="form-control" placeholder="Type your password"/>
                </div>

                <div>
                    <button className="btn btn-primary">Sign Up</button>
                </div>

            </form>
        )
    }
    return (
        <>
            {signupForm()}
        </>
    )
};

export default SignUpComponent;