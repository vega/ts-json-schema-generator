# Testing

## Schema Generation

To add/update a test case for generating a valid schema from a Typescript file:

-   Look in `test/valid-data` for a sample related to your change. If you don't find one, create your own following the naming convention. For example, when adding the new sample `annotation-default`:
    -   Create folder `test/valid-data/annotation-default`
    -   Add `main.ts` to that folder with the type sample
-   Update the corresponding `main.ts` file with your changes.
-   Run `yarn test:update` to compile the JSON schema
-   Add a test to `test/valid-data-annotations.test.ts`, matching a similar pattern to the existing tests.
-   Run tests via `yarn jest test/valid-data-annotations.test.ts` (this only runs the subset of tests related to schema validation)
