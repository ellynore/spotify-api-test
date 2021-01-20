import * as functions from "firebase-functions"
import { generatePlaylistController } from "./controllers/generate_playlist_controller"
import { userDetailsController } from "./controllers/user_details_controller"

export const userDetails = functions.https.onRequest(userDetailsController)
export const generatePlaylist = functions.runWith({
  timeoutSeconds: 300, memory: '1GB'
}).https.onRequest(generatePlaylistController)