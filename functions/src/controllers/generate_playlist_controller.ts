import * as functions from "firebase-functions"
import { addTracksToPlaylist } from "../utilities/spotify/add_tracks_to_playlist"
import { createPlaylist } from "../utilities/spotify/create_playlist"
import { TrackItem } from "../utilities/spotify/get_tracks_by_keyword"
//import { NewPlaylist } from "../utilities/spotify/create_playlist"
import { getTracksByKeyword } from "../utilities/spotify/get_tracks_by_keyword"
import { getWeatherByCoordinates } from "../utilities/weather/get_weather_by_coordinates"
import { WeatherObject } from "../utilities/weather/get_weather_by_coordinates"
import { getUserId as getSpotifyUserId } from "../utilities/spotify/get_user_id"

export const generatePlaylistController = async (request: functions.Request, response: functions.Response) => {
    functions.logger.info(request.query)
    

    //let latitude:number = 52.4
    //let longitude:number = 4.9
    let accessToken = request.query.token ?? null
    let latitude = request.query.latitude ?? null
    let longitude = request.query.longitude ?? null

    if(accessToken === null || latitude === null || longitude === null) {
        functions.logger.error('missing_parameter', request.query)
        response.status(500).send({
            code: 'missing_parameter',
            message: "Could not generate playlist"
        })
        return
    }
  
    let userId:string = await getSpotifyUserId(`${accessToken}`)
    let weather:WeatherObject = await getWeatherByCoordinates(
        parseFloat(`${latitude}`), 
        parseFloat(`${longitude}`)
    )
    let tracks:Array<TrackItem> = await getTracksByKeyword(
        weather.keyword, 
        weather.country, 
        `${accessToken}`
    )
  
    if(tracks.length === 0) {
      response.status(500).send({
        code: 'no_tracks_found',
        message: "Could not generate playlist"
      })
      return
    }

    let playlistId:string = await createPlaylist(
        weather.city, 
        weather.keyword, 
        userId, 
        `${accessToken}`
    )

    await addTracksToPlaylist(
        playlistId, 
        tracks, 
        `${accessToken}`
    )
    
    response.send({
        playlistId,
        message: "Check your Spotify for a surprise!"
    })
  }