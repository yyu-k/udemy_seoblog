'use client'

import Link from "next/link"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import dynamic from "next/dynamic" //needs to be used with React Quill - make sure that SSR is turned off
import { getCookie, getLocalStorageUser } from "@/actions/auth" //for getting token
import { getAllCategories } from "@/actions/category"
import { getAllTags } from "@/actions/tag"
import { createBlog } from "@/actions/blog"
import { quillFormats, quillModules } from "@/helpers/quill"

const ReactQuill = dynamic(() => import('react-quill'), {ssr : false})
import '@/node_modules/react-quill/dist/quill.snow.css';

const BlogCreate = () => {
    let blogFromLocalFlag = false; //Added by me as a flag (used with useEffect) to avoid the problem where the form is empty even though the in-process blog appears to be loaded from local storage
    const blogFromLocalStorage = () => {
        if (typeof window === 'undefined' || !localStorage.getItem('blog')) {
            return '';
        }
        const localBlog = localStorage.getItem('blog');
        if (localBlog) {
            blogFromLocalFlag = true;
            return localBlog
        } 
    }

    const [categories, setCategories] = useState([]);
    const [tags, setTags] = useState([]);
    const [uploaded, setUploaded] = useState('');
    const [chosenCategories, setChosenCategories] = useState([]);
    const [chosenTags, setChosenTags] = useState([])
    const [values, setValues] = useState({
        error: '',
        sizeError: '', //limit the blog size to 2mb - unused?
        success: '',
        formData: new FormData(),
        title: '',
        hidePublishButton : false //disable on pressing publish
    })
    const [body, setBody] = useState(blogFromLocalStorage());
    const {error, sizeError, success, formData, title, hidePublishButton} = values;

    const initCategories = () => {
        getAllCategories()
        .then((data) => {
            if (data.error) {
                setValues({...values, error : data.error})
            } else {
                setCategories(data);
            }
        })
    }

    const initTags = () => {
        getAllTags()
        .then((data) => {
            if (data.error) {
                setValues({...values, error : data.error})
            } else {
                setTags(data);
            }
        })
    }

    useEffect(() => {
        //setValues({...values, formData : new FormData()}) //Not sure why this needs to be a useEffect? Amended. 
        initCategories();
        initTags();
    }, []) //supposed to add router as a dependency but I think not needed

    useEffect(() => { //added by me so that formData can be set once the blog is loaded from local storage
        if (blogFromLocalFlag) {
            formData.set('body', body)
        }
    }, [blogFromLocalFlag])

    const publishBlog = (e) => {
        e.preventDefault();
        const token = getCookie('token');
        createBlog(formData, token)
        .then((data) => {
            if (data.error) {
                setValues({...values, error: data.error});
            } else {
                setValues({...values, formData: new FormData(), title : '', error : '', success : `A new blog titled "${data.title}" is created`});
                setBody(''); //will also trigger OnChange and clear out local storage
                setChosenCategories([]);
                setChosenTags([]);
                setUploaded('');
                document.querySelectorAll('input[type=checkbox]').forEach( el => el.checked = false );
            }
        })
    }

    const handleChange = (type) => (e) => { 
        var input;
        if (type === 'photo') {
            input = e.target.files[0]; //only grab the first picture
            setUploaded(e.target.files[0].name);
        } else {
            input = e.target.value;
        }
        formData.set(type, input);
        setValues({...values, [type] : input, error : '', success : ''})
    }

    const handleBody = (e) => {
        setBody(e);
        formData.set('body', e);
        if(typeof window !== 'undefined') { //make sure that the code is being run in a browser
            localStorage.setItem('blog', e);
        }
    }

    const handleCategoryToggle = (catID) => () => {
        const catIndex = chosenCategories.indexOf(catID);
        const copyCat = [...chosenCategories] //cannot mutate the state directly
        if (catIndex === -1) {
            copyCat.push(catID);
        } else {
            copyCat.splice(catIndex, 1)
        }
        setChosenCategories(copyCat);
        formData.set('categories', copyCat);
    };

    const handleTagToggle = (tagID) => () => {
        const tagIndex = chosenTags.indexOf(tagID);
        const copyTag = [...chosenTags] //cannot mutate the state directly
        if (tagIndex === -1) {
            copyTag.push(tagID);
        } else {
            copyTag.splice(tagIndex, 1)
        }
        setChosenTags(copyTag);
        formData.set('tags', copyTag);
    };


    const showCategories = () => {
        return (
            categories.map((v) => {
                return (
                    <li key={v._id} className="list-unstyled">
                        <input type="checkbox" className="me-2" onChange={handleCategoryToggle(v._id)}/>
                        <label className='form-check-label'>{v.name}</label>
                    </li>
                )
            })
        )
    }

    const showTags = () => {
        return (
            tags.map((v) => {
                return (
                    <li key={v._id} className="list-unstyled">
                        <input type="checkbox" className="me-2" onChange={handleTagToggle(v._id)}/>
                        <label className='form-check-label'>{v.name}</label>
                    </li>
                )
            })
        )
    }

    const showError = () => {
        return (
            <div className="alert alert-danger" 
            style={{display : error ? '' : 'none'}}> {/*will not be displayed if there is no error*/}
                {error}
            </div>
        )
    }

    const showSuccess = () => {
        return(
            <div className="alert alert-success" 
            style={{display : success ? '' : 'none'}}> {/*will not be displayed if there is no error*/}
                {success}
            </div>
        )
    }

    const createBlogForm = () => {
        return (
            <form onSubmit={publishBlog}>
                <div className="form-group">
                    <label className="text-mute">
                        Title
                    </label>
                    <input type="text" className="form-control" value={title} onChange={handleChange('title')}/>
                </div>
                <div className="form-group">
                    <ReactQuill modules={quillModules} 
                    formats={quillFormats} 
                    value={body} 
                    placeholder="Key in the contents of your blog here" 
                    onChange={handleBody}
                    />
                </div>
                <div>
                    <button type="submit" className="btn btn-primary mt-2">
                        Publish
                    </button>
                </div>
            </form>
        )
    }
    return (
        <div className="container-fluid">
            <div className="row">
                <div className='col-md-8'>
                    {showError()}
                    {showSuccess()}
                    {createBlogForm()}
                </div>
                <div className="col-md-4">
                    <div className="form-group pb-2">
                        <h5>Featured Image</h5>
                        <hr/>
                        <small className="text-muted">
                            Max size: 1mb
                        </small>
                        <br/>
                        <label className="btn btn-outline-info">
                            Upload Featured Image
                            <input onChange={handleChange('photo')} type="file" accept="image/*" hidden/>
                        </label>
                        <span className="text-muted d-block">
                            {uploaded}
                        </span>
                    </div>
                    <div>
                        <h5 className="mt-4 mb-4">Categories</h5>
                        <hr/>
                        <ul style={{maxHeight : '200px',
                            overflowY : 'scroll'}}>
                            {showCategories()}
                        </ul>
                        <h5 className="mt-4 mb-4">Tags</h5>
                        <hr/>
                        <ul style={{maxHeight : '200px',
                            overflowY : 'scroll'}}>
                            {showTags()}
                        </ul>
                    </div>
                </div>
            </div>
            
        </div>
    )
}


export default BlogCreate;