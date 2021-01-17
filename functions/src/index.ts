import * as functions from "firebase-functions"
import { userDetailsController } from "./controllers/user_details_controller"

const fetch = require('node-fetch')


export const userDetails = functions.https.onRequest(userDetailsController)

interface SearchResults {
  tracks: TracksList
  error: SearchError
}

interface TracksList {
  items: Array<TrackItem>
}

interface TrackItem {
  name: string,
  artists: Array<TrackArtists>,
  id: string
}

interface TrackArtists {
  name: string,
  id: string
}

interface SearchError {
  status: number
  message: string
}



 //return a string of ALL artists' names
function getArtistsNames(artistsList: Array<TrackArtists>): string {
  var artists = String("")
  for(let i=0; i<artistsList.length; i++) {
    artists += (artistsList[i].name )
  }
  return artists
}

//Firebase function for getting a list of 20 tracks based on keyword
export const getTracksByKeyword = functions.https.onRequest(async (request, response) => {
  functions.logger.info(request.query)

  let accessToken = request.query.token

  let result = await fetch('https://api.spotify.com/v1/search?q=rain&type=track&market=NL&limit=20', {
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
    return
  } 

  let output: Array<string> = []

  json.tracks.items.forEach((item: TrackItem) => {
    functions.logger.debug(
      item.name, 
      item.id, 
      item.artists
    )
  })
  //functions.logger.info(json)
  response.send(output)
})
