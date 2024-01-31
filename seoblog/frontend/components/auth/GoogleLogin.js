'use client'

import {useEffect, useState} from "react";
import { useRouter } from "next/navigation";
import { loginWithGoogle, saveData, getLocalStorageUser } from "@/actions/auth";
import { GOOGLE_CLIENT_ID } from "@/config";
import '@/css/styles.css';
import Loading from "../LoadingComponent";

export const GoogleLogin = ({loginValues, setValues }) => {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    //Code modified from
    //https://stackoverflow.com/questions/75692128/react-google-login-package-is-deprecated-what-is-to-be-the-replacement-for-the
    useEffect(() => {
        window.onGoogleSuccess = (response) => {
            // hit your backend, passing up response.credential
            const user = {tokenId : response.client_id};
            loginWithGoogle(user)
            .then(data => {
                if (data.error) {
                    setValues({...loginValues, error : data.error});
                } else {
                    saveData(data, () => {
                        const localUser = getLocalStorageUser();
                        if (localUser && localUser.role === 1) {
                            router.push('/admin'); //redirect the user to admin if role is 1
                        } else {
                            router.push('/user');
                        }
                    });
                }
            })
        }
        // Inject the google provided script 
        // (an importable module would be nicer here)
        const script = document.createElement('script');
        script.src = "https://accounts.google.com/gsi/client";
        script.async = true;
        document.body.appendChild(script);
        setLoading(false);
        return () => {
          // clean up for react lifecycle
          window.onGoogleSuccess = undefined;
          document.body.removeChild(script)
        }
      }, []);

    if (loading) {
        return (
            <div className="GoogleLoginButtonContainer mb-3">
                <Loading style={{height:44, padding:"10px"}} 
                    text="sign in with Google"/>
            </div>
        );
    }
    return (
        <>
            <div className="GoogleLoginButtonContainer mb-3">
                <div id="g_id_onload"
                data-client_id={GOOGLE_CLIENT_ID}
                data-context="signup"
                data-ux_mode="popup"
                data-callback="onGoogleSuccess"
                data-nonce=""
                data-auto_prompt="false">
                </div>
                <div className="row">
                    <div className="col">
                        <div id="GoogleSignInButton"
                            className="g_id_signin pb-3"
                            data-type="standard"
                            data-shape="rectangular"
                            data-theme="filled_blue"
                            data-text="signin_with"
                            data-logo_alignment="left"
                            data-width="300"
                        >
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
    
};

