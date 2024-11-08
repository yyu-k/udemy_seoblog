import { BlogUpdate } from "@/components/crud/BlogUpdate"
import Admin from "@/components/auth/Admin"

export default async function Page({params}) {
    return (
      <>
      <Admin>
        <div className="container-fluid">
          <div className="row">
            <div className="col-md-12 pt-5 pb-5">
              <h2>Update Blog</h2>
            </div>
            <div className="col-md-12">
              <BlogUpdate slug={params.slug}/>
            </div>
          </div>
        </div>
      </Admin>
      </>
    )
  }