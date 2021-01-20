import * as functions from "firebase-functions"
import { error } from "firebase-functions/lib/logger"
import { TrackItem } from "./get_tracks_by_keyword"

var FormData = require('form-data');
const fetch = require('node-fetch')

export interface NewPlaylist {
    error: {
        status: number
        message: string
    }
    description: string
    id: string
    name: string
    public: boolean
    tracks: {
        items: Array<TrackItem>
    }
}

export const createPlaylist = async (city:string, keyword:string, userId:string, accessToken:string) => {
    functions.logger.info(city)
    functions.logger.info(keyword)

    const data = {
        'name': `${keyword} in ${city}`,
        'description': "Your daily weather playlist",
        'public': false
    }

    let result = await fetch(`https://api.spotify.com/v1/users/${userId}/playlists`, {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`
        }
    })

    console.log(result)

    let json: NewPlaylist = await result.json()

    functions.logger.info(json)

    if(json.error) {
        functions.logger.error(`[${json.error.status}] ${json.error.message}`)
        throw new Error(`Something went wrong while creating a new playlist: ${keyword} in ${city}`)
    } 

    return json.id
}