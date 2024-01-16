import SignInComponent from '@/components/auth/SignInComponent';
import { ShowRedirectMsg } from '@/components/ShowRedirectMsg';

export default function Page() {
    return (
        <>
            <h2 className="text-center pt-4 pb-4">Sign In</h2>
            <div className="row">
                <div className="col-md-6 offset-md-3">
                    <ShowRedirectMsg/>
                </div>
                <div className="col-md-6 offset-md-3">
                    <SignInComponent/>
                </div>
            </div>
        </>
    )
  }
  