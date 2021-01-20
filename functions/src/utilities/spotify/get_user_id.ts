import * as functions from "firebase-functions"
const fetch = require('node-fetch')

interface userResult {
    display_name: string,
    id: string
}

export const getUserId = async (accessToken: string):Promise<string> => {
    let result = await fetch('https://api.spotify.com/v1/me', {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`
        }
    })

    let json: userResult = await result.json()

    console.log(json)

    return json.id
}