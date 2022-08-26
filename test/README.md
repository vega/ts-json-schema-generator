# Testing

## Schema Generation

To add/update a test case for generating a valid schema from a typscript file:

- Look in `test/valid-data` for a sample related to your change. If you don't find one, create your own following the naming convention. For example, when adding the new sample `annotation-default`:
    - Create folder `test/valid-data/annotation-default`
    - Add `main.ts` to that folder with the type sample
- Update the corresponding `main.ts` file with your changes.
- Compile the JSON Schema via `yarn --silent run run --path 'test/valid-data/{the-target-folder}/*.ts' --type 'MyObject' -o test/valid-data/{the-target-folder}/schema.json`
    - This happens automatically when running `yarn test:update`, but that can take a while
- Add a test to `test/valid-data-annotations.test.ts`, matching a similar pattern to the existing tests.
- Run tests via `yarn jest test/valid-data-annotations.test.ts` (this only runs the subset of tests related to schema validation)
