import Private from "@/components/auth/Private"

export default function Page() {
  return (
    <>
     <Private>
      <h2>User Dashboard</h2>
     </Private>
    </>
  )
}
