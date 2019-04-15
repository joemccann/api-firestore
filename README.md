# SYNOPSIS

👷🏽‍♀️ CRUD operations for Google Cloud Functions APIs for any generic Collection in Firestore.

## REQUIREMENTS

1. A Google Cloud Account.
2. Billing Enabled.
3. API and Firestore Access Enabled.
4. `gcloud` CLI installed and in your `$PATH`.
5. A preferred configuration created ( `gcloud init` ).

## USAGE

```sh
curl https://${DEFAULT_REGION}-${PROJECT}.cloudfunctions.net/api-firestore --data '{ "collection": "foo", "document": "foo-doc-1", "value": "{ "message": "hello from foo doc." }" }' -H "Content-Type: application/json"
```

The expected response:

```js
{
  "data": "OK"
}
```

Or in the case there is a failure:

```js
{
  "err":"Document, foo, already exists."
}
```

## API

```sh
# Create a document
curl https://${DEFAULT_REGION}-${PROJECT}.cloudfunctions.net/api-firestore --data '{ "collection": "foo", "document": "foo-doc-1", "value": "{ "message": "hello from foo doc." }" }' -H "Content-Type: application/json"

# Get a document by its document name
curl https://${DEFAULT_REGION}-${PROJECT}.cloudfunctions.net/api-firestore?document=foo-doc-1

# Update a user by their username (id)
curl https://${DEFAULT_REGION}-${PROJECT}.cloudfunctions.net/api-firestore --data '{ "collection": "foo", "document": "foo-doc-1", "value": "{ "message": "hello from foo doc...again!" }" }' -H "Content-Type: application/json"

# Delete a user by their username
curl -X DELETE https://${DEFAULT_REGION}-${PROJECT}.cloudfunctions.net/api-firestore?document=foo-doc-1
```

## DEPLOY

First, fork or clone this repo, then:

```sh
npm i
```

You need to pass in your [environment variables either in a `.env.yaml` file or as command line arguements](https://cloud.google.com/functions/docs/env-var).  Run the following command in the root of this repository, assuming a `.env.yaml` file:

```sh
gcloud functions deploy api-firestore --runtime nodejs10 --trigger-http --memory 128MB --env-vars-file .env.yaml
```

You should receive a YAML like response in your terminal including the URL for the Cloud Function.

## TESTS

```sh
npm i -D
PROJECT={PROJECT} npm test
```

## AUTHORS

- [Joe McCann](https://twitter.com/joemccann)

## LICENSE

MIT