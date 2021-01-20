import * as functions from "firebase-functions"
import { TrackItem } from "./get_tracks_by_keyword"
import { TrackArtists } from "./get_tracks_by_keyword"

const fetch = require('node-fetch')

interface SearchResults {
    snapshot_id: string
    error: {
        status: number
        message: string
    }
}

function getUri(trackId:string):string {
    return `spotify:track:${trackId}`
}

export const addTracksToPlaylist = async (playlistId:string, tracks: Array<TrackItem>,accessToken:string) => {
    if(playlistId == '') {
        functions.logger.error("Playlist id is empty!")
        return null
    }

    let uris: Array<string> = []

    tracks.forEach((track) => {
        uris.push(getUri(track.id))
    })

    let result = await fetch(
        `https://api.spotify.com/v1/playlists/${playlistId}/tracks?uris=${uris.join()}`, 
        {
            method: 'POST',
            headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`
        }
    })
  
    let json: SearchResults = await result.json()
  
    if(json.error) {
      functions.logger.error(`[${json.error.status}] ${json.error.message}`)
      throw new Error(`Something went wrong while adding the tracks to the playlist ${playlistId}`)
    } 
    
    return json.snapshot_id
}
  