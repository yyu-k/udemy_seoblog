import Private from "@/components/auth/Private"
import Link from "next/link"

export default function Page() {
  return (
    <>
      <Private>
        <div className="row">
          <div className="col-md-12 pt-5 pb-5">
            <h2>User Dashboard</h2>
          </div>
          <div className="col-md-4">
            <ul className="list-group">
              <li className="list-group-item">
                <Link href="/user/crud/blog">
                  Create Blog
                </Link>
              </li>
              <li className="list-group-item">
                <Link href="/user/crud/blog-edit">
                  Update/Delete Blogs
                </Link>
              </li>
              <li className="list-group-item">
                <Link href="/user/update">
                  Update Profile
                </Link>
              </li>
            </ul>
          </div>
          <div className="col-md-8">
            right
          </div>
        </div>
      </Private>
    </>
  )
}
