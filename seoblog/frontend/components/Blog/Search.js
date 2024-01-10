'use client'
import { useState, useEffect } from "react"
import { listSearch } from "@/actions/blog"
import Link from "next/link"

export const Search = () => {
    const [values, setValues] = useState({
        search : '',
        results : [],
        searched: false,
        msg: ''
    });
    const searchSubmit = (e) => {
        e.preventDefault();
        listSearch({search : values.search})
        .then(data => {
            if (data.error) {
                setValues({...values, results : [], searched: true, msg : data.error});
            } else {
                setValues({...values, results : data, searched : true, msg : `${data.length} blogs found`});
            }
        })
    }

    const searchResults = () => {
        const displayMsg = () => {
            if (values.msg) {
                return (
                    <p className="pt-4 text-muted font-italic">
                        {values.msg}
                    </p>
                )
            } 
        }
        const displayResults = () => {
            return (
                values.results.map((b) => {
                    return (
                        <div key={b._id}>
                            <Link className="text-primary" href={`/blogs/${b.slug}`} style={{fontWeight : "bold"}}>
                                {b.title}
                            </Link>
                        </div>
                    )
                })
            )
            
        }
        return (
            <div className="jumbotron bg-white">
                {displayMsg()}
                {displayResults()}
            </div>
        )
    }

    const handleChange = (e) => {
        setValues({...values, search : e.target.value, searched : false, results : []})
    }

    const searchForm = () => {
        return (
            <form onSubmit={searchSubmit}>
                <div className="row">
                    <div className="col-md-10">
                        <input type='search'
                            className="form-control"
                            placeholder="Search blogs"
                            onChange={handleChange}/>
                    </div>
                    <div className="d-grid gap-2 col-md-2">
                        <button className="btn btn-outline-primary" 
                            type='submit'>
                            Search
                        </button>
                    </div>
                </div>
            </form>
        )
    }

    return (
        <div className="container-fluid">
            <div className="pt-3 pb-5">
                {searchForm()}
            </div>
            {values.searched &&
                <div style={{marginTop:'-70px', marginBottom:'20px'}}>
                    {searchResults()}
                </div>
            }
        </div>
    )
}