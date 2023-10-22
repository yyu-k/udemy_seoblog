This is the code resulting from following the Udemy MERN React Node Next.js Multi User SEO Blogging Platform tutorial, it is not mine (and in fact this repo should be private). Minor adjustments detailed below.

The course can be accessed on https://www.udemy.com/course/react-node-nextjs-fullstack-multi-user-blogging-platform-with-seo/
The course's repository is on https://github.com/PacktPublishing/React-Node-FullStack---Multi-User-Blogging-Platform-with-SEO-1

1. Changed password hashing/salting to bcrypt (instead of built-in crypto)
2. Using the winston module for logging instead of console.log
3. Moved some constants to a general CONSTANTS.js file in root
4. Changed shortid to nanoid


Out of date things that needed to be changed:
1. MongooseError: Query.prototype.exec() no longer accepts a callback
2. MongooseError: Model.prototype.save() no longer accepts a callback

Notes:
1. mongoose "required" validation will fail if the setter depends on a promise (the promise will not be resolved in time - e.g. bcrypt.hash)