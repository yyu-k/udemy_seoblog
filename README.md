This is the code resulting from following the Udemy MERN React Node Next.js Multi User SEO Blogging Platform tutorial, it is not mine (and in fact this repo should be private). Minor adjustments detailed below.

The course can be accessed on https://www.udemy.com/course/react-node-nextjs-fullstack-multi-user-blogging-platform-with-seo/
The course's repository is on https://github.com/PacktPublishing/React-Node-FullStack---Multi-User-Blogging-Platform-with-SEO-1

<h3>Experimental Changes</h3>

1. Changed password hashing/salting to bcrypt (instead of built-in crypto)
2. The tutorial suggested that, for the purpose of creating an email authentication link when signing up, the link could include the JWT of the username, PASSWORD, and email. Not sure if this is a good idea given that the contents of the JWT are public; the JWT prevents modification, not reading. Slightly reworked so that the JWT contains the hashed password instead, but there are probably better ways of doing email authentication.
4. Changed shortid to nanoid
5. When error is caught, the e.message should be returned instead of the Error object. More generally changes were made to error handling to simplify the processing of the error message / display more details to the front end. Perhaps too much information is at the front end though.
6. Amended require_sign_in so that absence of authorization token will be caught and the user will receive a 401 with a JSON (instead of the whole error object)
7. Amended the changes to input type=file (which is hidden) so that the uploaded file's name continues to be displayed.
8. Tried to reduce the number of nested then, preferring to return a promise, and operate on that promise. 
9. React documentation provides that "You might be tempted to use an item’s index in the array as its key. In fact, that’s what React will use if you don’t specify a key at all. But the order in which you render items will change over time if an item is inserted, deleted, or if the array gets reordered. Index as a key often leads to subtle and confusing bugs." - this advice did not seem to be heeded by the course author. Index occasionally changed (e.g. to the _id provided by mongodb) for this reason but this was not consistently done. 
10. Added ImageOrNone component to display a NO IMAGE image where there is none to display for experimentation purpose
11. Wrote a simple comment component, since there is no free disqus plan available anymore.
12. Instead of using 'jsonwebtoken' for verification that the token used for password resetting has not expired, created separate express-jwt middleware (auth_controllers.resetPasswordMiddleware) instead for consistency/experimentation. Same for auth_controllers.signup_token_checker.
13. Amended backend auth_controllers.signup to prevent users clicking the same activation link multiple times. 
14. Changed GoogleLogin so that any error caused will bubble back up and be displayed. See https://react.dev/learn/sharing-state-between-components 

<h3>Random issues fixed</h3>
1. Lodash merge will merge arrays instead of reassign the variable - this creates a problem when updating tags/categories of blogs, where additions will work but not removals. Changed to lodash assign. 

<h3>Out of date things that needed to be changed</h3>

<h4>General</h4>

1. Replaced process.browser with typeof window === 'object'.
3. Replaced nProgress with next-nprogress-bar for compatibility with app router
4. zeit/next-css is no longer necessary due to improved CSS support in next
5. JSON.stringify and JSON.parse are not necessary for various parts involving saving to local storage
6. isomorphic-fetch should no longer be necessary - fetch provided in node
7. async/await now supported in server components, but not client components (generally used async/await to mess around)
8. react-render-html is outdated, replaced with directly using dangerouslySetInnerHTML in the Blog component. Some kind of sanitiser is needed for this reason to avoid e.g. cross site scripting, but that has not been implemented. 
9. react-google-login is deprecated. Swapped to https://developers.google.com/identity/gsi/web/tools/configurator. However, the google login button loads slowly and is hard to customize. Simple modifications made to indicate that the button is loading, in practice probably will use some OAuth library to manage this. For some of the issues, see https://stackoverflow.com/questions/69242615/prevent-sign-in-with-google-button-flickering-while-loading-when-centered-vertic and https://medium.com/@leonardosalles/a-guide-to-custom-google-sign-in-button-e7b02c2c5e4f



<h4>Mongoose</h4>

1. Query.prototype.exec() no longer accepts a callback
2. Model.prototype.save() no longer accepts a callback
3. When merging earlier mongoose documents with newer updates sent via formidable.Fields, the _.merge(doc, fields) step should happen AFTER necessary changes are made on the FIELDS object e.g. splitting up a string of categories into an array. Otherwise, there will be errors such as CastError: Cast to ObjectId failed for value "657d41ba286c0e0633253c36,658412b168d0b80ebe8a5b63" (type string) at path "tags" because of "BSONError". This issue arises quite frequently because all of the fields are stored as an array which need to be extracted using firstValues or otherwise. 
4. min, max renamed to minLength, maxLength for strings

<h4>Formidable</h4>
1. Formidable: Method of creation/altering options slightly changed
2. Formidable: string values of fields are now placed in an array, to be extracted with firstValues. Similar issue with photo properties. 
3. Some fields read from form.parse() has a different name e.g. files.photo.mimetype instead of files.photo.type, where photo is the key of the form.

<h4>Random extensions</h4>
1. Slugify: toLowerCase is now an option ({lower : true})
2. express-jwt: The decoded JWT payload is now available as req.auth rather than req.user

<h4>Next JS</h4>

1. pages-->index.js is no longer used; replaced pages router with app router. For the same reason, components --> Layout.js is no longer used (layout pages are within the "app" directory)
2. charset and viewport are default fields, so there is no need to explicitly add them to the head as defined in the "_document.js" (now the root layout)
3. Starting with Next.js 13, &ltLink> renders as &lta>, so attempting to use &lta> as a child is invalid (unless legacy options are used)
4. Changed to accomodate the new reactstrap NavLink etc with next.JS Link, wrapped in functions within NavBarLinks.js, because "the child is a custom component that wraps an &lta> tag". Note that NavbarBrand also requires a React.forwardRef wrapper. 
5. 'use client' must occasionally be added for client side renders involving useState etc
6. useRouter must be from next/navigation and not next/router when using app router. Additionally, there is no equivalent of the Router from next/router. This means that the router can ONLY be used inside a functional component, necessitating changes in certain function calls e.g. redirect on expiry of token. See e.g. https://github.com/vercel/next.js/issues/50100. Using window.location.href as a workaround.
7. The previous way of dynamically rendering the navigation bar to reflect login status was to use a function to pull values from localStorage, and render the bar depending on whether the function returned a "truthy" value e.g. {localStorageFunction() && showSignIn()}. This did not work - there are hydration issues, and after those are resolved, the navigation bar would only re-render with a refresh. The solution was to trigger an event via window.dispatchEvent on login/logout, then use window.addEventListener on the useEffect function. See https://stackoverflow.com/questions/56660153/how-to-listen-to-localstorage-value-changes-in-react. Note that alternatives such as https://stackoverflow.com/questions/61178240/useeffect-does-not-listen-for-localstorage, by themselves, do not work. 
8. On some pages with redirection, e.g. on the sign up page, to avoid flashing before redirection by using a "loading" state coupled with UseEffect. See e.g. https://stackoverflow.com/questions/75786885/preventing-flashing-of-page-when-redirecting. Not done on all for learning purpose.
9. withRouter does not work with the app router. Various workarounds. 
10. Modification of head tag no longer done with next/head, but using the Metadata API. See https://nextjs.org/docs/app/building-your-application/optimizing/metadata, and also https://stronglytyped.uk/articles/open-graph-images-nextjs-app-router.
11. getIntitialProps etc no longer used in the app router - just fetch directly. See e.g. https://stackoverflow.com/questions/76267351/how-to-fetch-data-server-side-in-the-latest-next-js-tried-getstaticprops-but-it. Note that fetch must be run with the option {cache : no-store} for pages where the content may change e.g. blogs, or the page will not update. 
12. The method utilised by the course to update an image on change (e.g. user changes the profile picture) is to use something along the lines of "img src=${API}/user/photo/${username_for_photo}", where username_for_photo is a state. This does not work; either the image is not being re-rendered after the upload, or the API call immediately after the change returns the old image for one reason or another. The solution is to use the photo buffer that is returned immediately after the change, coupled with a "pic" state i.e. const base64String = Buffer.from(data.photo.data.data).toString('base64'), setPic(showPicture(data:${data.photo.contentType};base64,${base64String})), where showPicture returns a JSX fragment. 
13. router.query.message replaced with useSearchParams
14. Google Analytics tag implemented with https://nextjs.org/docs/messages/next-script-for-ga

<h4>CSS/Bootstrap</h4>

1. Margins: ml/mr has been replaced with ms (start) and me (end). See https://stackoverflow.com/questions/69301335/bootstrap-padding-left-and-right-is-not-working. More generally various class name changes e.g. font-weight to fw
2. btn-block no longer works - see https://stackoverflow.com/questions/23183343/bootstrap-btn-block-not-working. The parent div now looks something like div className="d-grid gap-2 col-md-2"

<h3>Notes</h3>

1. THIS APPLICATION IS VULNERABLE TO BOTH CROSS-SITE SCRIPTING AND DATABASE INJECTIONS. The solution would probably be to use sanitization libraries - not done. 
1. next 14.0.1 doesn't seem to work in Windows - run this in Linux or use WSL2 (actually the problem seems to be that the directory name cannot contain the words "ude" in Windows for some reason) 
2. mongoose "required" validation will fail if the setter depends on a promise (the promise will not be resolved in time - e.g. bcrypt.hash). More generally, virtual fields getters and setters DO NOT WORK with promises. Initially resolved by using the synchronous versions of the functions, but as this is bad practice, reworked by writing async instance methods. async must also be peppered onto various callbacks for this to work, because the instance methods MUST be awaitted or they won't work either. 
3. The reactstrap functions MUST be placed within the body tags (as opposed to within html etc)
4. Arguments for the navbar in reactstrap needs to be keyed in manually (e.g. expand={'md'}), otherwise the default values will hold and the navbar will not change its formatting regardless of screensize etc.
5. admin password is adminpassword
6. The problem with using the url as parameters for the purpose of API calls is that one has to be sure the parameters are always in English - an api call to e.g. /tag/delete/日本語 probably wouldn't work well
7. For some reason, if FormData is used directly (e.g. const formData = new FormData()) instead of being part of an object (const state = {..., formData : new FormData()}), values that are set will disappear and the backend will receive empty fields. 
8. Putting a Link inside a section causes a hydration error. The hydration error appeared in the http://localhost:3000/blogs page, and removing the Card component made it clear that the Card component was the issue. Then the JSX was progressively removed and tested in the Card component to figure out what was causing the hydration error. 
9. There is a strange bug where the first login on firefox causes a hydration error - but this error doesn't repeat even after restarting the browser / backend / frontend - not quite sure where it is coming from or just dev mode wierdness. UPDATE: This seems to be caused by the password manager addon - if the password manager prompt is dismissed, the hydration error won't appear. See https://github.com/facebook/react/issues/24430 
10. To check what the server rendered component looks like with no client rendering, disable javascript. 
11. There are a number of pages where the number of blogs loaded is not controlled e.g. in the categories page, all blogs with that category is immediately loaded. If got time, need to do some kind of load more feature instead of loading any number of potential blogs. 
12. Caching behaviour for fetch is different between dev and build mode. It's generally okay to fetch the same information multiple times e.g. for the once for the opengraph-image.js, once for the main page, etc, because in production mode the fetch will only occur once. See https://nextjs.org/docs/app/building-your-application/caching#request-memoization
13. It appears that dangerouslySetInnerHTML can cause hydration errors because it is not possible to control how the user structures the blog post. It is possible to avoid this by rendering the content only on the client side, but not sure this is the best?
14. The ordering of routes matters where there are variables e.g. /blog/:slug. If router.get(/blog/search) is placed after router.get(/blog/:slug), then the calls to search will always be treated as a slug. 
15. Changing size of container : see: https://stackoverflow.com/questions/20984874/how-to-make-a-smaller-container-in-bootstrap
16. Centering a div: see : https://stackoverflow.com/questions/42388989/bootstrap-center-vertical-and-horizontal-alignment (used mx-auto)
17. If NavLink is used in the header instead of NewNavLink (which incorporates Link from react/link), clicking on the header links will cause a reload of the header, with the effect that header components depending on states would flash. E.g. if username is to be shown on the header, on click the username will disappear, then appear again as the state gets loaded. 
18. Both http://localhost:3000 and http://localhost must be added to the Authorized JavaScript origins of the Google OAuth client in https://console.cloud.google.com/apis/credentials?project=xxxxxxxx for local testing of google login to work