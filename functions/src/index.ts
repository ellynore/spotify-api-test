import * as functions from "firebase-functions"

const fetch = require('node-fetch')

// Start writing Firebase Functions
// https://firebase.google.com/docs/functions/typescript

export const helloWorld = functions.https.onRequest(
  (request: functions.Request, response: functions.Response) => {
    functions.logger.info(request.query)

    let name = request.query.name ?? 'Firebase'

    response.send(`Hello to ${name}!`)
  }
)

// define what exists in the response
interface GetCurrentUserResponse {
  display_name: string
  id: string
}

export const userDetails = functions.https.onRequest((request, response) => {
  functions.logger.info(request.query)

  let accessToken = request.query.token

  fetch('https://api.spotify.com/v1/me', {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`
    }
  })
    .then((res: any) => {
      functions.logger.info(res)
      return res.json()
    })
    .then((json: GetCurrentUserResponse) => {
      functions.logger.info("Spotify user:")
      functions.logger.info(json["display_name"])

      response.send({
        displayName: json.display_name
      })
    })
})
