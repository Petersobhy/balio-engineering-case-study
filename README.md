# Balio Case Study
We're excited to have you going through our interview process!

This is a take-home task that involves some coding. This task does not represent what kind of product, tech-stack,
or systems you'll be working with.

We expect this task to take an average of 4 - 6 hours of your time. But you have 7 days to submit. If you need more time, please let us know.

The source code is provided as a subset of a larger system. The tests show how it's expected to be used.

## The Task
You're assigned as a new engineer on a BI engine product for hotels to help revenue managers get more insights.

This BI engine integrates with Property Management Systems (PMS) of hotels by offering an API that their PMS can send the data to.

Currently, the company have an integration with one PMS that sends the data in the form of XML (samples are in `./samples` directory)

The current integration assumes that you will always receive a snapshot of 365 sequences. And does some validation to only accept clean snapshots.

The product manager (PM) has asked you to extend the existing integration to accept JSON payload from another PMS with a completely different format. A sample is provided at `samples/new-integration.json`

The data is saved to a database (schema is found at `init/db.ts`). And you're required to add a new column named `soruce_format` which would allow the analytics team to gather stats about the dominant integration formats we have. It should hold a value of either `XML` or `JSON`.

In addition. The new JSON integration doesn't always provide the full 365 sequences. It only provides sequences with non-empty values.

For consistency, our PM wants to fill the missing sequences with zero values. But the `total_rooms` should be filled from the snapshot for missing sequences.

The PM told you that the mapping of the new JSON values should be as follows:
```
"day_number"        => "sequence" 
"available_rooms"   => "total_rooms"
"reserved_rooms"    => "sold_rooms"
"day_revenue"       => "revenue"
```

Another colleague also wants the records to be extended with Average Daily Revenue calculation (ADR) which is computed as follows: `ADR = revenue / sold rooms`. They want it to be similar to how `occupancy` is being provided (i.e. extend the `Records` class with a similar computation).

You are provided with a fixture in `test/fixtures/new-integration.expected.ts` that can be used to test that the new integration is successful. You might want to check the existing tests to see how it can be used.

In addition to extending the integration, your engineering manager highlighted the following issues:

- The API is exposing some internal details when provided with malformed payload.
- The code is generally hard to read and extend. Other developers rarely want to touch it. 
- It seems that there used to be functionality to limit the payload to 1 MB, but it's no longer working. Its test case is failing but no-one had the time to look why it's breaking

So you're naturally asked to solve these issues and add new tests for the integration.

Your engineering manager asked you to be careful when doing the database changes since it's live and is serving existing customers.
Also, it's crucial not to change the current test assertions as they've captured quite a few bugs before.

## Running the project
This project assumes a `Node.js` version 20 or higher and `NPM` version 10.8 or higher.
### Install the dependencies
```bash
npm ci
```
### Initialize the database
```bash
npm run init
```

### Run the tests
```
npm run test
```

## Submitting the task
Download or clone the repo and proceed with the task.
Once you're done, compress it as a `.zip` and send it via email to the person who sent you the link.

Feel free to assume any missing details. And we highly encourage you to document any assumptions you've made.

Good Luck!
