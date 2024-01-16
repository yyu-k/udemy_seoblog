import Private from "@/components/auth/Private"
import { BlogRead } from "@/components/crud/BlogRead"

export default function Page() {
    return (
      <>
      <Private>
        <div className="container">
          <div className="row">
            <div className="col-md-12 pt-5 pb-5">
              <h2>Manage Blogs</h2>
            </div>
            <div>
              <BlogRead userDashboard={true}/>
            </div>
          </div>
        </div>
      </Private>
      </>
    )
  }
  