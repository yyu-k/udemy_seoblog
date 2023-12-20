'use client'

import { useState, useEffect } from "react";
import { getCookie } from "@/actions/auth";
import { createTag, getAllTags, deleteTag } from "@/actions/tag";

const Tag = () => {
    const [values, setValues] = useState({
        tagName : '',
        error: '',
        success: false,
        tags: [],
        removed: false,
        reload : false
    });

    const {tagName, error, success, tags, removed, reload} = values;
    const token = getCookie('token');

    const loadTags = () => {
        getAllTags().then((data) => {
            if (data.error) {
                setValues({...values, error : data.error});
            } else {
                setValues({...values, tags : data})
            }
        })
    }
        
    useEffect(() => {
        loadTags()
    }, [reload])

    const deleteConfirm = (c) => {
        let answer = window.confirm(`Are you sure you want to delete the Tag ${c.name}`)
        if(answer) {
            deleteTag(c.slug, token).then((data) => {
                if (data.error) {
                    setValues({...values, error : data.error});
                } else {
                    setValues({...values, error: '', success: false, removed : true, reload: !reload})
                }
            })
        }
    }

    const showTags = () => {
        return tags.map((c, i) => { //c is the individual object within the array, i is the index
            return (
                <button
                    onDoubleClick={() => deleteConfirm(c)} 
                    title="Double click to delete"
                    key={i} 
                    className="btn btn-outline-primary mt-1 me-1 ms-1">
                    {c.name}
                </button>
            )
        })
    }

    const clickSubmit = (e) => {
        e.preventDefault(); //prevents the page from reloading on submit
        createTag({name: tagName}, token)
        .then((data) => {
            if (data.error) {
                setValues({...values, error : data.error, success : false});
            } else {
                setValues({...values, error: '', success: true, tagName: '', reload: !reload});
            }
        })
    }

    const handleChange = (e) => {
        setValues({...values, tags, tagName: e.target.value, error: '', success: false, removed : ''}) //clear out pre-existing issues
    }

    const showSuccess = () => {
        if(success) {
            return <p className="text-success">Tag is created</p>
        }
    }

    const showError = () => {
        if(error) {
            return <p className="text-danger">{error}</p>
        }
    }

    const showRemoved = () => {
        if(removed) {
            return <p className="text-danger">Tag is removed</p>
        }
    }

    const mouseMoveHandler = () => {
        setValues({...values, error : '', success : false, removed : false});
    }

    const newTagForm = () => {
        return (
            <form onSubmit={clickSubmit}>
            <div className="form-group">
                <label className="text-muted">Tag Name</label>
                <input type="text" 
                    className="form-control" 
                    onChange={handleChange}
                    value={tagName}
                    required/>
            </div>
            <div>
                <button type="submit"
                    className="btn btn-primary mt-3">
                    Create
                </button>
            </div>
            </form>
        )
    }

    return (
        <>
        {showSuccess()}
        {showError()}
        {showRemoved()}
        <div onMouseMove = {mouseMoveHandler}>
            {newTagForm()}
            <p className="text-muted mt-3">
                Double click the button to delete the respective tag
            </p>
            {showTags()}
        </div>
        </>
    )

};

export default Tag;