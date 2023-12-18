'use client'

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getLocalStorageUser, getCookie } from "@/actions/auth";
import { createCategory, getAllCategories, deleteCategory } from "@/actions/category";

const Category = () => {
    const [values, setValues] = useState({
        catName : '',
        error: '',
        success: false,
        categories: [],
        removed: false,
        reload : false
    });

    const {catName, error, success, categories, removed, reload} = values;
    const token = getCookie('token');

    const loadCategories = () => {
        getAllCategories().then((data) => {
            if (data.error) {
                setValues({...values, error : data.error});
            } else {
                setValues({...values, categories : data})
            }
        })
    }
        
    useEffect(() => {
        loadCategories()
    }, [reload])

    const deleteConfirm = (c) => {
        let answer = window.confirm(`Are you sure you want to delete ${c.name}`)
        if(answer) {
            deleteCategory(c.slug, token).then((data) => {
                if (data.error) {
                    setValues({...values, error : data.error});
                } else {
                    setValues({...values, error: '', success: false, removed : true, reload: !reload})
                }
            })
        }
    }

    const showCategories = () => {
        return categories.map((c, i) => { //c is the individual object within the array, i is the index
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
        createCategory({name: catName}, token)
        .then((data) => {
            if (data.error) {
                setValues({...values, error : data.error, success : false});
            } else {
                setValues({...values, error: '', success: true, catName: '', reload: !reload});
            }
        })
    }

    const handleChange = (e) => {
        setValues({...values, categories, catName: e.target.value, error: '', success: false, removed : ''}) //clear out pre-existing issues
    }

    const showSuccess = () => {
        if(success) {
            return <p className="text-success">Category is created</p>
        }
    }

    const showError = () => {
        if(error) {
            return <p className="text-danger">{error}</p>
        }
    }

    const showRemoved = () => {
        if(removed) {
            return <p className="text-danger">Category is removed</p>
        }
    }

    const mouseMoveHandler = () => {
        setValues({...values, error : '', success : false, removed : false});
    }


    const newCategoryForm = () => {
        return (
            <form onSubmit={clickSubmit}>
            <div className="form-group">
                <label className="text-muted">Name</label>
                <input type="text" 
                    className="form-control" 
                    onChange={handleChange}
                    value={catName}
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
            {newCategoryForm()}
            <p className="text-muted mt-3">
                Double click the button to delete the respective category
            </p>
            {showCategories()}
        </div>
        </>
    )

};

export default Category;