import express from "express"
import { authMiddleware } from "../middleware/auth.middleware.js"
import { addProblemToPlaylist, createPlaylist, deletePlaylist, getAllPlaylistsOfUser, getLatestUnpurchasedPaidPlaylists, getPlaylistDetails, getPurchaseHistory, getUnpurchasedPaidPlaylists, initiatePlaylistPurchase, removeProblemFromPlaylist, verifyPlaylistPurchase } from "../controllers/playlist.controller.js"

const playlistRoutes = express.Router()

playlistRoutes.get("/", authMiddleware, getAllPlaylistsOfUser)
playlistRoutes.get("/unpurchased-paid-playlists", authMiddleware, getUnpurchasedPaidPlaylists)
playlistRoutes.get("/latest/unpurchased-paid-playlists", authMiddleware, getLatestUnpurchasedPaidPlaylists)
playlistRoutes.get("/:playlistId", authMiddleware, getPlaylistDetails)
playlistRoutes.post("/create-playlist", authMiddleware, createPlaylist)
playlistRoutes.post("/:playlistId/add-problem", authMiddleware, addProblemToPlaylist)
playlistRoutes.delete("/:playlistId/remove-problem", authMiddleware, removeProblemFromPlaylist)
playlistRoutes.delete("/:playlistId", authMiddleware, deletePlaylist)

playlistRoutes.get("/purchase/history", authMiddleware, getPurchaseHistory);
playlistRoutes.post("/purchase/initiate/:playlistId", authMiddleware, initiatePlaylistPurchase);
playlistRoutes.post("/purchase/verify", authMiddleware, verifyPlaylistPurchase); 
export default playlistRoutes