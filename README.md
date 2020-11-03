# AIP Assessment 2 | Group 7

### Running local development server

Add a `.env` file in the root directory containing the required env vars (see `.env.example`)

```bash
npm run dev
# or
yarn dev
```

> NOTE: All backend code can be found in `src/pages/api`

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Notable Design Features

### JAMStack (Using NextJS Framework hosted on Vercel)

Using NextJS as a framework for our site allows for many benefits. Most notable are the following:

- Generating static HTML from our page components and serves them to users via a global CDN, allowing for faster TTFB.
- SEO support via Server Side rendering.
- Code-splitting to support lazy-loading pages.
- Route pre-loading when links are in view.
- Serverless architecture to allow for cheap and automatic horizontal scaling that adjusts with site load.

### Mongo DB and Database Design

We're using Mongo DB as our database, but have put a lot of thought into the design and modelling of the database to ensure efficiency and performance.

- Embedded documents to **significantly** reduce the number of reads, resulting in faster DB reads and cheaper usage costs.
- Typegoose + Mongoose ODM to improve development experience by utilising strong typed, centralised models.
- Search indexing to improve query performance and efficiency.
> NOTE: All database indexes were created on Mongo Atlas (the website)

### Firebase Auth and Storage

- Abstracted senstive user data outside of the database to ensure security. 🔐
- Allow for social sign in e.g. Google sign in.
- Uses JWTs to authenticate API requests and avoid the need of a session store since we are using serverless.
- Shortlived Access Tokens + Refresh Tokens to improve security.
- Images are stored in a Firebase Storage bucket to ensure privacy via access rules from Firebase Auth.
- Saved images are not stored on Mongo documents, reducing document size and further improve read times.

### Caching

Design choices were made regarding application caching to significantly improve efficiency, performance and the user experience.

- Pages are cached and servered via a CDN for fast loading (done via NextJS).
- Incremental Static Regeneration 👑
> This feature allows for pages to be pre-rendered and then cached to a CDN so they can be served on subsequent request. A “revalidation” threshold is also set that determines when the cached page is deemed “stale”, after which it is regenerated with the latest data. This ensures users always get the latest data while significantly improving TTFB. This also has the added benefit of reducing the number of database reads, as subsequent requests are served the same cached document, rather than triggering additional database reads.
- SWR (Stale while revalidate) data-fetching library for client-side caching. 😍
> Caches client site requests to significantly improve user experience. Throttles API requests and serves cached results while a request is run in the background to reduce loading screens. Also supports client-side mutations to instatly reflect changes in the UI, rather than waiting for a response from the API. e.g. Submitting favour evidence will instantly update the favour details page while the request is sent in the background.

### Validation

We used `yup` as our validation library to share validation logic on both client-side and server-side.

- Validation schemas are shared to client-side via `react-hook-form` library to keep schemas consistent. (Avoids bugs as we only need to update the validation schemas in one location 🤩)
- Dynamic schemas that change depending on context e.g. require certains fields only on a create action.
- Custom validators such as `isMongoID`.
- Custom Validator HOF allows for a really nice 👌 request validation pattern in our server-side code.

```typescript
// Just create a validate function via the `createValidator` HOF by passing it a schema
const validate = createValidator(favourValidation)

// Then, in any route, simply validate the request with any additonal context
// This example is validating the current request as a `create` action, which will dynamically adjsut the validation schema. How Cool!
const validatedData = await validate(req /* The HTTP request to validate */, "create", /* An optional context action*/)

// If validation fails for the request, a custom `Validation Error` is thrown within `validate()` 
// and caught by the route error handler (see the "General Server-Side Code Design" section below) automatically.
```

### General Client-Side Code Design

- Standardise page layout using the `Layout` wrapper component to provide consistency between pages.
- Reusable `Error` component to provide a standardised Error within any page.
- Reusable `Loader` component to provide standardised loading feedback between pages
- Use of `Chakra-UI` library provides a consistent and customizable theme that supports light & dark mode. 🌞🌙 Give it a try!
- Custom-built `WithAuth` HOF to protect routes easily. For an example of this, please look at the favour page components.

```typescript
// Simply wrap a Page Component with WithAuth, and it's protected!
export default WithAuth(FavourList)
```

- Custom-built Auth Context provided and hook to easily access auth state from anywhere inside the application.

### General Server-Side Code Design

- Custom API route handler built on `next-connect` library allows for shared middleware on any route.
- Custom `authGuard` middleware to easily protect API routes. (Verifies a JWT via firebase auth)
- Custom error handler allows us to return standardised error responses to clientside, depending on the type of error e.g. expected API error, validation error, etc. (see `src/lib/errorHandler.ts`)

This error handler enables developers to simply throw a `ApiError` (or `ValidationError` like above) anywhere within a route handler, and it will auto-magically ✨ get caught by the error handler and formatted into a standard error format. See below for an example.

```typescript

// Find the debtor from db
const debtorData = await User.findById(debtor);
if (!debtorData) throw new ApiError(400 /* Resonse StatusCode */, "No debtor with that ID exists.", /* Error details */);

```

