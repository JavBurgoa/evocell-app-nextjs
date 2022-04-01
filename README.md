This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, download the github repository, open you command line, `cd` to the root folder of the porject and run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `pages/index.js`. The page auto-updates as you edit the file.

The pages/index.js page is the main page that connects everything. The Headers, Title and other components are in separate files in the `components` folder. These are connected to the `pages/index.js` through imports in the beginning of the file.

Connection to the Database containing all datasets is made within `pages/index` through `getStaticProps()`

Download links made in the client side

## Learn More About Next.js

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.
