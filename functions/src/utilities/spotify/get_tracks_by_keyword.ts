import * as functions from "firebase-functions"

const fetch = require('node-fetch')

export interface SearchResults {
    tracks: {
        items: Array<TrackItem>
    }
    error: {
        status: number,
        message: string
    }
}

export interface TrackItem {
    name: string,
    artists: Array<TrackArtists>,
    id: string
}

export interface TrackArtists {
    name: string,
    id: string
}

 //return a string of ALL artists' names
function getArtistsNames(artistsList: Array<TrackArtists>): string {
    var artists = String("")
    for(let i=0; i<artistsList.length; i++) {
      artists += (artistsList[i].name )
    }
    return artists
}

//function for getting a list of 20 tracks based on keyword
export const getTracksByKeyword = async (keyword:string, market:string, accessToken:string) => {

    let result = await fetch(`https://api.spotify.com/v1/search?q=${keyword}&type=track&limit=20`, {
        method: 'GET',
        headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`
        }
    })
  
    let json: SearchResults = await result.json()
  
    if(json.error) {
      functions.logger.error(`[${json.error.status}] ${json.error.message}`)
      throw new Error(`Something went wrong while searching tracks by keyword: ${keyword}`)
    } 
  
    json.tracks.items.forEach((item: TrackItem) => {
      functions.logger.debug(
        item.name, 
        item.id, 
        item.artists
      )
    })
  
    return json.tracks.items
}
  