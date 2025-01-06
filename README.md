# Language Diary

React native + express backend

## Set up

The project does not require much set up. It was built with the help of AWS tools suchs as SAM. I believe that the base documentation provided in `backend/lambdas`

## Backend Unit/ Integration testing

This project for the backend uses a mix of mock-unit and integration testing. Perhaps the term unit-integration could be coined here. Anyways, for testing to properly work, one should run first

```bash
npm run migrate-integration
```

to keep the test DB updated. After that simply run:

```bash
npm run test
```

And everything should work fine.

I've yet to set up automatic prisma cleaner, so be careful when setting up test as in `beforeAll` or even `beforeEach` block - all of the related data should be removed.
