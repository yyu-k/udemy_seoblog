export default async function Page({params}) {
    return (
      <>
      <div>
        <p>{params.jwt}</p>
      </div>
      </>
    )
  }