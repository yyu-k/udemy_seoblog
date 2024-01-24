'use client'

import { useState, useEffect } from "react";
import { getCookie } from "@/actions/auth";
import { getProfile, updateProfile } from "@/actions/user";
import { ImageOrNone } from "../ImageOrNone";
import { updateUser } from "@/actions/auth";
import Loading from "../LoadingComponent";

const ProfileUpdate = () => {
    const [values, setValues] = useState({
        username: '',
        name: '',
        email: '',
        about : '',
        password: '',
        error: '',
        success: false,
        loading: false,
        photo: '',
        userData: new FormData()
    });
    const [firstLoad, setFirstLoad] = useState(true);
    const [pic, setPic] = useState(<></>);
    const token = getCookie('token');

    useEffect(() => {
        const init = async () => {
            const data = await getProfile(token)
            if (data.error) {
                setValues({...values, error : data.error});
            } else {
                setValues({...values, username: data.username, name : data.name, email : data.email, about : data.about});
            }
            return data;
        }
        init().then(data => {
            setFirstLoad(false);
            if (data.photo) {
                const base64String = Buffer.from(data.photo.data.data).toString('base64')
                setPic(showPicture(`data:${data.photo.contentType};base64,${base64String}`))
            } else {
                setPic(showPicture(''));
            }
        });
    }, []);

    const handleChange = (name) => (e) => {
        e.preventDefault();
        const value = (name === 'photo' ? 
            e.target.files[0] : 
            e.target.value);
        values.userData.set(name, value);
        setValues({...values, [name] : value, userData : values.userData, error : false, success : false})
        return
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        setValues({...values, loading : true});
        updateProfile(token, values.userData)
        .then((data) => {
            if (data.error) {
                setValues({...values, error : data.error, success : false, loading : false});
            } else {
                setValues({...values, username : data.username, name : data.name, email : data.email, about : data.about, success : true, error : '', loading : false})
                if (data.photo) {
                    const base64String = Buffer.from(data.photo.data.data).toString('base64')
                    setPic(showPicture(`data:${data.photo.contentType};base64,${base64String}`))
                } 
                const newUser = {
                    id : data.id,
                    username : data.username,
                    name : data.name,
                    email : data.email,
                    role : data.role
                }
                updateUser(newUser);
            }
        })
        return
    }

    const profileUpdateForm = () => {
        return (
            <form onSubmit={handleSubmit}>
                <div className="form-group mt-2">
                    <label className="text-muted">
                        Profile Photo
                    </label>
                    <input onChange={handleChange('photo')}
                        type="file"
                        accept="image/*"
                        className="form-control"/>
                </div>
                <div className="form-group mt-2">
                    <label className="text-muted">
                        User Name
                    </label>
                    <input onChange={handleChange('username')}
                        type="text"
                        className="form-control"
                        value={values.username}/>
                </div>
                <div className="form-group mt-2">
                    <label className="text-muted">
                        Name
                    </label>
                    <input onChange={handleChange('name')}
                        type="text"
                        className="form-control"
                        value={values.name}/>
                </div>
                <div className="form-group mt-2">
                    <label className="text-muted">
                        Email
                    </label>
                    <input onChange={handleChange('email')}
                        type="email"
                        className="form-control"
                        value={values.email}/>
                </div>
                <div className="form-group mt-2">
                    <label className="text-muted">
                        About
                    </label>
                    <textarea onChange={handleChange('about')}
                        type="text"
                        className="form-control"
                        value={values.about}/>
                </div>
                <div className="form-group mt-2">
                    <label className="text-muted">
                        Password
                    </label>
                    <input onChange={handleChange('password')}
                        type="password"
                        className="form-control"
                        value={values.password}/>
                </div>
                <div>
                    <button type="submit" className="btn btn-primary mt-3">
                        Submit
                    </button>
                </div>
            </form>
        )
    }

    const showPicture = (picURL) => {
        return (
            <ImageOrNone src={picURL}
                className="img img-fluid img-thumbnail mb-3"
                style={{maxHeight : 'auto', maxWidth: '100%'}}
                alt="user profile picture"/>
        )
    }

    const showError = () => {
        return (
            <div className="alert alert-danger"
            style={{display : values.error ? '' : 'none'}}>
                {values.error}
            </div>
        )
        
    }

    const showSuccess = () => {
        return (
            <div className="alert alert-success"
            style={{display : values.success ? '' : 'none'}}>
                Profile Updated
            </div>
        )
    }

    const showLoading = () => {
        return (
            <div className="alert alert-info" 
                style={{display : values.loading ? '' : 'none'}}>
                Loading...
            </div>
        )
    }

    const mainContent = () => {
        if (firstLoad) {
            return <Loading text="profile"/>
        }
        return (
            <>
                {showSuccess()}
                {showLoading()}
                {showError()}
                {profileUpdateForm()}
            </>
        )
    }

    return (
        <>
            <div className="container">
                <div className="row">
                    <div className="col-md-4">
                        {pic}
                    </div>
                    <div className="col-md-8 mb-5">
                        {mainContent()}
                    </div>
                </div>
            </div>
        </>
    )
}

export default ProfileUpdate;