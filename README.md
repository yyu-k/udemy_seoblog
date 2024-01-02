This is the code resulting from following the Udemy MERN React Node Next.js Multi User SEO Blogging Platform tutorial, it is not mine (and in fact this repo should be private). Minor adjustments detailed below.

The course can be accessed on https://www.udemy.com/course/react-node-nextjs-fullstack-multi-user-blogging-platform-with-seo/
The course's repository is on https://github.com/PacktPublishing/React-Node-FullStack---Multi-User-Blogging-Platform-with-SEO-1

1. Changed password hashing/salting to bcrypt (instead of built-in crypto)
4. Changed shortid to nanoid
5. When error is caught, the e.message should be returned instead of the Error object. More generally changes were made to error handling to simplify the processing of the error message / display more details to the front end
6. Amended require_sign_in so that absence of authorization token will be caught and the user will receive a 401 with a JSON (instead of the whole error object)
7. Amended the changes to input type=file (which is hidden) so that the uploaded file's name continues to be displayed.
8. Avoiding nested then(), instead preferring to check if multiple promises are resolved
9. React documentation provides that "You might be tempted to use an item’s index in the array as its key. In fact, that’s what React will use if you don’t specify a key at all. But the order in which you render items will change over time if an item is inserted, deleted, or if the array gets reordered. Index as a key often leads to subtle and confusing bugs." - this advice did not seem to be heeded by the course author. Index occasionally changed (e.g. to the _id provided by mongodb) for this reason but this was not consistently done. 
10. Added ImageOrNone component to display a NO IMAGE image where there is none to display for experimentation purpose
12. It is not apparent why FormData is included in an object initialised using useState when the FormData is not relevant to the rendering. Restructured in some places. See also https://react.dev/reference/react/useState#updating-objects-and-arrays-in-state  

<h3>Out of date things that needed to be changed</h3>

<h5>General<h5>

1. Replaced process.browser with typeof window === 'object'.
3. Replaced nProgress with next-nprogress-bar for compatibility with app router
4. zeit/next-css is no longer necessary due to improved CSS support in next
5. JSON.stringify and JSON.parse are not necessary for various parts involving saving to local storage
6. isomorphic-fetch should no longer be necessary - fetch provided in node
7. async/await now supported in server components, but not client components (generally used async/await to mess around, didn't think too hard about whether it is appropriate)
8. react-render-html is outdated, replaced with directly using dangerouslySetInnerHTML in the Blog component. Some kind of sanitiser is needed for this reason - not thinking very hard about this


<h5>Mongoose<h5>

1. Query.prototype.exec() no longer accepts a callback
2. Model.prototype.save() no longer accepts a callback
3. When merging earlier mongoose documents with newer updates sent via formidable.Fields, the _.merge(doc, fields) step should happen AFTER necessary changes are made on the FIELDS object e.g. splitting up a string of categories into an array. Otherwise, there will be errors such as CastError: Cast to ObjectId failed for value "657d41ba286c0e0633253c36,658412b168d0b80ebe8a5b63" (type string) at path "tags" because of "BSONError". This issue arises quite frequently because all of the fields are stored as an array which need to be extracted using firstValues or otherwise. 

<h5>Random extensions<h5>
1. Slugify: toLowerCase is now an option ({lower : true})
2. express-jwt: The decoded JWT payload is now available as req.auth rather than req.user

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
10. Modification of head tag no longer done with next/head, but using the Metadata API. See https://nextjs.org/docs/app/building-your-application/optimizing/metadata, and also https://stronglytyped.uk/articles/open-graph-images-nextjs-app-router.
11. getIntitialProps etc no longer used in the app router - just fetch directly. See e.g. https://stackoverflow.com/questions/76267351/how-to-fetch-data-server-side-in-the-latest-next-js-tried-getstaticprops-but-it


<h5>CSS/Bootstrap</h5>
1. Margins: ml/mr has been replaced with ms (start) and me (end). See https://stackoverflow.com/questions/69301335/bootstrap-padding-left-and-right-is-not-working. More generally various class name changes e.g. font-weight to fw

Notes:
1. next 14.0.1 doesn't seem to work in Windows - run this in Linux or use WSL2 (actually the problem seems to be that the directory name cannot contain the words "ude" in Windows for some reason) 
2. mongoose "required" validation will fail if the setter depends on a promise (the promise will not be resolved in time - e.g. bcrypt.hash)
3. The reactstrap functions MUST be placed within the body tags (as opposed to within html etc)
4. Arguments for the navbar in reactstrap needs to be keyed in manually (e.g. expand={'md'}), otherwise the default values will hold and the navbar will not change its formatting regardless of screensize etc.
5. admin password is adminpassword
6. The problem with using the url as parameters for the purpose of API calls is that one has to be sure the parameters are always in English - an api call to e.g. /tag/delete/日本語 probably wouldn't work well

