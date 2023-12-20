import Admin from "@/components/auth/Admin"
import Category from "@/components/crud/Category"
import Tag from "@/components/crud/Tag"

export default function Page() {
    return (
      <>
      <Admin>
        <div className="row">
          <div className="col-md-12 pt-5 pb-5">
            <h2>Manage Categories and Tags</h2>
          </div>
          <div className="col-md-6">
            <Category/>
          </div>
          <div className="col-md-6">
            <Tag/>
          </div>
        </div>
      </Admin>
      </>
    )
  }
  