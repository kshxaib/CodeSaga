import express from "express"
import { authMiddleware } from "../middleware/auth.middleware.js"
import { addProblemToPlaylist, createPlaylist, deletePlaylist, getAllPlaylistsOfUser, getPlaylistDetails, getUnpurchasedPaidPlaylists, purchasePlaylist, removeProblemFromPlaylist } from "../controllers/playlist.controller.js"

const playlistRoutes = express.Router()

playlistRoutes.get("/", authMiddleware, getAllPlaylistsOfUser)
playlistRoutes.get("/:playlistId", authMiddleware, getPlaylistDetails)
playlistRoutes.post("/create-playlist", authMiddleware, createPlaylist)
playlistRoutes.post("/:playlistId/add-problem", authMiddleware, addProblemToPlaylist)
playlistRoutes.delete("/:playlistId/remove-problem", authMiddleware, removeProblemFromPlaylist)
playlistRoutes.delete("/:playlistId", authMiddleware, deletePlaylist)
playlistRoutes.get("/unpurchased-paid-playlists", authMiddleware, getUnpurchasedPaidPlaylists)
playlistRoutes.post("/purchase/:playlistId", authMiddleware, purchasePlaylist)

export default playlistRoutes