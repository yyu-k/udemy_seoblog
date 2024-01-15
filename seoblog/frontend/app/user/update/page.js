import Private from "@/components/auth/Private"
import ProfileUpdate from "@/components/auth/ProfileUpdate"

export default function Page() {
    return (
      <>
        <Private>
          <div className="container-fluid">
            <div className="row">
              <ProfileUpdate/>
            </div>
          </div>
        </Private>
      </>
    )
  }
  