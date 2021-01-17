import * as functions from "firebase-functions"
const fetch = require('node-fetch')

const userDetailsController = async (request: functions.Request, response: functions.Response) => {
    functions.logger.info(request.query)

    let accessToken = request.query.token

    let res = await fetch('https://api.spotify.com/v1/me', {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`
        }
    })

    let json: GetCurrentUserResponse = await res.json()

    response.send(
        `Spotify user: ${json.display_name}`
    )
}

  
// define what exists in the response
interface GetCurrentUserResponse {
    display_name: string
    id: string
}

//TS syntax - key has same name as variable
export {
    userDetailsController
}