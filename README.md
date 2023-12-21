This is the code resulting from following the Udemy MERN React Node Next.js Multi User SEO Blogging Platform tutorial, it is not mine (and in fact this repo should be private). Minor adjustments detailed below.

The course can be accessed on https://www.udemy.com/course/react-node-nextjs-fullstack-multi-user-blogging-platform-with-seo/
The course's repository is on https://github.com/PacktPublishing/React-Node-FullStack---Multi-User-Blogging-Platform-with-SEO-1

1. Changed password hashing/salting to bcrypt (instead of built-in crypto)
2. Using the winston module for logging instead of console.log
3. Moved some constants to a general CONSTANTS.js file in root
4. Changed shortid to nanoid
5. When error is caught, the e.message should be returned instead of the Error object. More generally changes were made to error handling to simplify the processing of the error message / display more details to the front end
6. Amended require_sign_in so that absence of authorization token will be caught and the user will receive a 401 with a JSON (instead of the whole error object)
7. Amended the changes to input type=file (which is hidden) so that the uploaded file's name continues to be displayed.

<h3>Out of date things that needed to be changed</h3>

<h5>General<h5>
1. Replaced process.browser with typeof window === 'object'.
2. express-jwt: The decoded JWT payload is now available as req.auth rather than req.user
3. Replaced nProgress with next-nprogress-bar for compatibility with app router
4. zeit/next-css is no longer necessary due to improved CSS support in next
5. JSON.stringify and JSON.parse are not necessary for various parts involving saving to local storage

<h5>Mongoose<h5>

1. Query.prototype.exec() no longer accepts a callback
2. Model.prototype.save() no longer accepts a callback

<h5>Random extensions<h5>
1. Slugify: toLowerCase is now an option ({lower : true})

<h5>Formidable<h5>
1. Formidable: Method of creation/altering options slightly changed
2. Formidable: string values of fields are now placed in an array, to be extracted with firstValues. Similar issue with photo properties. 
3. Some fields read from form.parse() has a different name e.g. files.photo.mimetype instead of files.photo.type, where photo is the key of the form.

<h5>Next JS</h5>

1. pages-->index.js is no longer used; replaced pages router with app router. For the same reason, components --> Layout.js is no longer used (layout pages are within the "app" directory)
2. charset and viewport are default fields, so there is no need to explicitly add them to the head as defined in the "_document.js" (now the root layout)
3. Starting with Next.js 13, &ltLink> renders as &lta>, so attempting to use &lta> as a child is invalid (unless legacy options are used)
4. Changed to accomodate the new reactstrap NavLink etc with next.JS Link, wrapped in functions within NavBarLinks.js, because "the child is a custom component that wraps an &lta> tag". Note that NavbarBrand also requires a React.forwardRef wrapper. 
5. 'use client' must occasionally be added for client side renders involving useState etc
6. useRouter must be from next/navigation and not next/router when using app router
7. The previous way of dynamically rendering the navigation bar to reflect login status was to use a function to pull values from localStorage, and render the bar depending on whether the function returned a "truthy" value e.g. {localStorageFunction() && showSignIn()}. This did not work - there are hydration issues, and after those are resolved, the navigation bar would only re-render with a refresh. The solution was to trigger an event via window.dispatchEvent on login/logout, then use window.addEventListener on the useEffect function. See https://stackoverflow.com/questions/56660153/how-to-listen-to-localstorage-value-changes-in-react. Note that alternatives such as https://stackoverflow.com/questions/61178240/useeffect-does-not-listen-for-localstorage, by themselves, do not work. 
8. On some pages with redirection, e.g. on the sign up page, to avoid flashing before redirection by using a "loading" state coupled with UseEffect. See e.g. https://stackoverflow.com/questions/75786885/preventing-flashing-of-page-when-redirecting. Not done on all for learning purpose.
9. withRouter does not work with the app router. Various workarounds. 

<h5>CSS/Bootstrap</h5>
1. Margins: ml/mr has been replaced with ms (start) and me (end). See https://stackoverflow.com/questions/69301335/bootstrap-padding-left-and-right-is-not-working

Notes:
1. next 14.0.1 doesn't seem to work in Windows - run this in Linux or use WSL2 (actually the problem seems to be that the directory name cannot contain the words "ude" in Windows for some reason) 
2. mongoose "required" validation will fail if the setter depends on a promise (the promise will not be resolved in time - e.g. bcrypt.hash)
3. The reactstrap functions MUST be placed within the body tags (as opposed to within html etc)
4. Arguments for the navbar in reactstrap needs to be keyed in manually (e.g. expand={'md'}), otherwise the default values will hold and the navbar will not change its formatting regardless of screensize etc.
5. admin password is adminpassword
6. The problem with using the url as parameters for the purpose of API calls is that one has to be sure the parameters are always in English - an api call to e.g. /tag/delete/日本語 probably wouldn't work well