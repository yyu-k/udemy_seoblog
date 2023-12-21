import Admin from "@/components/auth/Admin"
import BlogCreate from "@/components/crud/BlogCreate"

export default function Page() {
    return (
      <>
      <Admin>
        <div className="row">
          <div className="col-md-12 pt-5 pb-5">
            <h2>Create a New Blog</h2>
          </div>
          <div>
            <BlogCreate/>
          </div>
        </div>
      </Admin>
      </>
    )
  }
  