import Admin from "@/components/auth/Admin"
import { BlogRead } from "@/components/crud/BlogRead"

export default function Page() {
    return (
      <>
      <Admin>
        <div className="container">
          <div className="row">
            <div className="col-md-12 pt-5 pb-5">
              <h2>Manage Blogs</h2>
            </div>
            <div>
              <BlogRead/>
            </div>
          </div>
        </div>
      </Admin>
      </>
    )
  }
  