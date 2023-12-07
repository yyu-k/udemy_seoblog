import SignUpComponent from '@/components/auth/SignUpComponent';

export default function Page() {
    return (
        <>
            <h2 className="text-center pt-4 pb-4">Sign Up</h2>
            <div className="row">
                <div className="col-md-6 offset-md-3">
                    <SignUpComponent/>
                </div>
            </div>
        </>
    )
  }
  