'use client'

import Link from "next/link"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import dynamic from "next/dynamic" //needs to be used with React Quill - make sure that SSR is turned off
import { getCookie, getLocalStorageUser } from "@/actions/auth" //for getting token
import { getAllCategories } from "@/actions/category"
import { getAllTags } from "@/actions/tag"
import { createBlog } from "@/actions/blog"

const ReactQuill = dynamic(() => import('react-quill', {ssr : false}))
import '@/node_modules/react-quill/dist/quill.snow.css';

const BlogCreate = () => {
    const router = useRouter();
    const blogFromLocalStorage = () => {
        if (typeof window === 'undefined' || !localStorage.getItem('blog')) {
            return '';
        }
        const localBlog = localStorage.getItem('blog');
        if (localBlog) {
            return localBlog
        } 
    }

    const [categories, setCategories] = useState([]);
    const [tags, setTags] = useState([]);
    const [uploaded, setUploaded] = useState('');
    const [chosenCategories, setChosenCategories] = useState([]);
    const [chosenTags, setChosenTags] = useState([])
    const [body, setBody] = useState(blogFromLocalStorage());
    const [values, setValues] = useState({
        error: '',
        sizeError: '', //limit the blog size to 2mb
        success: '',
        formData: new FormData(),
        title: '',
        hidePublishButton : false //disable on pressing publish
    })

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
    }, [router])

    const publishBlog = (e) => {
        e.preventDefault();
        console.log('testing publish');
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
        setValues({...values, [type] : input, formData, error : ''})
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
        formData.set('Tags', copyTag);
    };


    const showCategories = () => {
        return (
            categories.map((v, i) => {
                return (
                    <li key={i} className="list-unstyled">
                        <input type="checkbox" className="me-2" onChange={handleCategoryToggle(v._id)}/>
                        <label className='form-check-label'>{v.name}</label>
                    </li>
                )
            })
        )
    }

    const showTags = () => {
        return (
            tags.map((v, i) => {
                return (
                    <li key={i} className="list-unstyled">
                        <input type="checkbox" className="me-2" onChange={handleTagToggle(v._id)}/>
                        <label className='form-check-label'>{v.name}</label>
                    </li>
                )
            })
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
                    <ReactQuill modules={BlogCreate.modules} formats={BlogCreate.formats} value={body} placeholder="Key in the contents of your blog here" onChange={handleBody}/>
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

BlogCreate.modules = {
    toolbar: [
        [{ header: '1' }, { header: '2' }, { header: [3, 4, 5, 6] }, { font: [] }],
        [{ size: [] }],
        ['bold', 'italic', 'underline', 'strike', 'blockquote'],
        [{ list: 'ordered' }, { list: 'bullet' }],
        ['link', 'image', 'video'],
        ['clean'],
        ['code-block']
    ]
};
 
BlogCreate.formats = [
    'header',
    'font',
    'size',
    'bold',
    'italic',
    'underline',
    'strike',
    'blockquote',
    'list',
    'bullet',
    'link',
    'image',
    'video',
    'code-block'
];

export default BlogCreate;