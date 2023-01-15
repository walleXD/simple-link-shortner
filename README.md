## Simple Link Shortner

### Usage

#### Development

- Ensure node.js 18 is installed, nvm can be used to automatically do so
- Use corepack to enable pnpm `corepack enable`
- Install all packages `pnpm i`
- Start server `pnpm run dev`

#### Production

- Build application `pnpm run build`
- Start server `pnpm run start`

### Exploring API

The application include `trpc-playground`, which created an interative playground to explore API.
Start the server and then open "http://localhost:3000/trpc/v0/playground".

In the browser, now we can use a simple JS client to interact with the API.

To create a shortened link, run the following:

```javascript
await trpc.linkShortner.createShortenedLink.mutate({
  link: "https://google.com",
});

// required only for the playground module handling
export {};
```

It returns a shortened link that will redirect to google.com.

Additionally, to get all the links that has been shortened, we can run the following:

```javascript
await trpc.linkShortner.getAllShortedLinks.query();

// required only for the playground module handling
export {};
```

We are also able to get a single original URL back using the shortened hash:

```javascript
await trpc.linkShortner.getOriginalUrl.query({
  hash: "HASH", // please use an existing hash
});

// required only for the playground module handling
export {};
```

### Project structure

The Simple Link Shortener service is designed with a modular, domain-driven architecture.
[tRPC](https://trpc.io/) is utilized as the primary communication layer for the API, with the entry route
for shortened URLs being '/:hash', where the hash corresponds to the original URL.The project setup is
stored in the 'src/modules/meta' folder, and all logic and routing related to the link shortener
functionality is located in the 'src/modules/linkShortner' folder. This organization allows for easy
discovery and refactoring of associated code.

### Caveats

#### Production readiness

When deploying a service into production, it is crucial to carefully evaluate various key factors such as
scalability, reliability, monitoring, and configuration management. In the case of our Simple Link Shortener
service, utilizing a service like AWS Lambda@Edge can aid in effectively scaling and meeting user demands
in a dependable manner.

To streamline the deployment process, our codebase is bundled and only the index.js file from the dist
directory needs to be copied into an environment running node.js. For optimal performance of our database,
utilizing a Redis cluster for caching both API requests and database queries is recommended.

Utilizing monitoring services like Datadog can provide real-time visibility into the performance of our
service, allowing for proactive identification and resolution of any issues before they impact a significant
number of users. In a production environment, maintaining the security of application configurations is of
paramount importance. Systems like AWS Secrets can facilitate the deployment process by eliminating the need
for manual management of these configurations.

#### Scaling

Scaling a service to accommodate significant growth, such as a 10x increase in users from 1 million to
10 million, requires careful planning and execution. One of the key challenges in scaling a service is
managing database and network bottlenecks.

To address the issue of database scalability, caching strategies should be implemented to reduce the number
of queries made to the database. In a read-only service, such as a link shortener, where most operations
will involve mapping shortened URLs to their original URLs, caching this mapping in a Redis cluster can
significantly reduce the load on the database.

To address network bottlenecks, services such as AWS Lambda@Edge can be leveraged to provide faster
redirects for users, regardless of their location. These services run closer to the users and can scale
automatically to meet usage demands, ensuring that the system remains responsive and does not become
overwhelmed.

Security is also a crucial consideration when scaling a service. To mitigate the risk of malicious users
overwhelming the system, rate limiting, IP blocking, and bot detection techniques can be implemented to
protect against malicious activity. This ensures that the service remains secure while providing a
positive user experience.
