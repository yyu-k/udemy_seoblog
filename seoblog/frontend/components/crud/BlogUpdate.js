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
import { readSingleBlog, updateBlog } from "@/actions/blog"

const ReactQuill = dynamic(() => import('react-quill'), {ssr : false});
import '@/node_modules/react-quill/dist/quill.snow.css';

export const BlogUpdate = ({slug}) => {
    const [uploaded, setUploaded] = useState(''); 
    const [body, setBody] = useState('');
    const [state, setState] = useState({
        error : '',
        success : '',
        title : ''
    });
    const formData = new FormData();

    //categories and tags
    const [categories, setCategories] = useState([]);
    const [tags, setTags] = useState([]);
    const [chosenCategories, setChosenCategories] = useState([]);
    const [chosenTags, setChosenTags] = useState([]);

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

    const catChecked = (id) => {
        const result = chosenCategories.indexOf(id);
        if (result === -1) {
            return false;
        } else {
            return true;
        }
    };

    const tagChecked = (id) => {
        const result = chosenTags.indexOf(id);
        if (result === -1) {
            return false;
        } else {
            return true;
        }
    };

    const showCategories = () => {
        return (
            categories.map((v) => {
                return (
                    <li key={v._id} className="list-unstyled">
                        <input type="checkbox" checked={catChecked(v._id)} className="me-2" onChange={handleCategoryToggle(v._id)}/>
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
                        <input type="checkbox" checked={tagChecked(v._id)} className="me-2" onChange={handleTagToggle(v._id)}/>
                        <label className='form-check-label'>{v.name}</label>
                    </li>
                )
            })
        )
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

    //get the blog
    useEffect(() => {
        const setCategoriesFromData = (cats) => {
            const catArray = cats.map(c => c._id);
            setChosenCategories(catArray);
        }
        const setTagsFromData = (tags) => {
            const tagArray = tags.map(t => t._id);
            setChosenTags(tagArray);
        }
        readSingleBlog(slug)
        .then((data) => {
            if (data.error) {
                console.log(data.error);
            } else {
                setState({...state, title : data.title});
                setBody(data.body);
                setCategoriesFromData(data.categories);
                setTagsFromData(data.tags);
            }
        });
        initCategories();
        initTags();
    }, []) //supposed to add router as a dependency but I think not necessary

    const handleBody = (event) => {
        setBody(event);
        formData.set('body', event);
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
        setState({...values, [type] : input, error : '', success : ''})
    }

    const editBlog = () => { //update backend
        console.log('update blog');
    }

    const updateBlogForm = () => {
        return (
            <form onSubmit={editBlog}>
                <div className="form-group">
                    <label className="text-mute">
                        Title
                    </label>
                    <input type="text" className="form-control" value={state.title} onChange={handleChange('title')}/>
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
                        Update
                    </button>
                </div>
            </form>
        )
    }

    return (
        <div className="container-fluid pb-5">
            <div className="row">
                <div className='col-md-8'>
                    {updateBlogForm()}
                    <div className="pt-3">
                        <p>show success and error message</p>
                    </div>
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
