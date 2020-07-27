// DONE: Once your application is deployed, copy an API id here so that the frontend could interact with it
const apiId = 'g65iy40yob'
export const apiEndpoint = `https://${apiId}.execute-api.eu-west-2.amazonaws.com/dev`

export const authConfig = {
  // DONE: reate an Auth0 application and copy values from it into this map
  domain: 'dev-eb-o8fgn.eu.auth0.com',            // Auth0 domain
  clientId: 'l3s9l1W1QsyZwKShHVb001Nk8fNkXaJo',          // Auth0 client id
  callbackUrl: 'http://localhost:3000/callback'
}
