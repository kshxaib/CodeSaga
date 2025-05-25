import { db } from "../libs/db.js";

export const createPlaylist = async (req, res) => {
  const { name, description } = req.body;
  if (!name) {
    return res.status(400).json({ success: false, message: "Playlist name is required" });
  }

  const userId = req.user.id;

  try {
    const existingPlaylist = await db.playlist.findFirst({
      where: {
        name,
        userId,
      },
    });

    if (existingPlaylist) {
      return res.status(409).json({ success: false, message: "Playlist already exists" });
    }

    const playlist = await db.playlist.create({
      data: {
        name,
        description,
        userId,
      },
    });

    return res
      .status(200)
      .json({
        success: true,
        message: `${playlist.name} playlist created successfully}`,
        playlist,
      });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Error while creating playlist" });
  }
};

export const getAllPlaylistsOfUser = async (req, res) => {
  try {
    const playlists = await db.playlist.findMany({
      where: {
        userId: req.user.id,
      },
      include: {
        problems: {
          include: {
            problem: true,
          },
        },
      },
    });

    return res
      .status(200).json({
        success: true, message: "Playlists fetched successfully", playlists,
      });
  } catch (error) {
    return res.status(500).json({
      error: "Error while fetching playlists",
    });
  }
};

export const getPlaylistDetails = async (req, res) => {
    const {playlistId} = req.params
    if(!playlistId) {
        return res.status(400).json({ success: false, message: "Playlist ID is required" })
    }
    try {
        const playlist = await db.playlist.findUnique({
            where: {
                id: playlistId,
                userId: req.user.id
            },
            include: {
                problems: {
                    include: {
                        problem: true,
                    },
                }
            }
        })

        if(!playlist) {
            return res.status(404).json({ success: false, message: "Playlist not found" })
        }

        return res.status(200).json({ success: true, message: "Playlist fetched successfully", playlist })
    } catch (error) {
        console.error(error)
        return res.status(500).json({ success: false, message: "Error while fetching playlist" })
    }
};

export const addProblemToPlaylist = async (req, res) => {
    const { playlistId } = req.params;
    const { problemIds } = req.body;

    if (!playlistId || !Array.isArray(problemIds)) {
        return res.status(400).json({ success: false, message: "Playlist ID and problem IDs are required" });
    }

    try {
        const existing = await db.problemInPlaylist.findMany({
            where: {
                playlistId,
                problemId: { in: problemIds }
            }
        });

        const existingIds = existing.map(item => item.problemId);

        const newProblemIds = problemIds.filter(id => !existingIds.includes(id));


        if (newProblemIds.length === 0) {
            return res.status(200).json({ success: true, message: "problems already exist in the playlist" });
        }

        await db.problemInPlaylist.createMany({
            data: newProblemIds.map(problemId => ({
                playlistId,
                problemId
            }))
        });

        return res.status(201).json({ success: true, message: "Problems added to playlist" });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: "Error while adding problems to playlist" });
    }
};

export const removeProblemFromPlaylist = async (req, res) => {
    const { playlistId } = req.params;
    const { problemIds } = req.body;

    if (!playlistId || !Array.isArray(problemIds)) {
        return res.status(400).json({ success: false, message: "Playlist ID and problem IDs are required" });
    }

    try {
        const result = await db.problemInPlaylist.deleteMany({
            where: {
                playlistId,
                problemId: { in: problemIds }
            }
        });

        if (result.count === 0) {
            return res.status(404).json({ success: false, message: "No problems found in playlist" });
        }

        return res.status(200).json({ success: true, message: `${result.count} problem(s) removed from playlist` });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: "Error while removing problems from playlist" });
    }
};

export const deletePlaylist = async (req, res) => {
    const {playlistId} = req.params
    if(!playlistId) {
        return res.status(400).json({ success: false, message: "Playlist ID is required" })
    }

    try {
        const deletePlaylist = await db.playlist.delete({
            where: {
                id: playlistId,
            }
        })

        return res.status(200).json({ success: true, message: `Playlist ${deletePlaylist.name} deleted successfully`, deletePlaylist })
    } catch (error) {
        return res.status(500).json({ success: false, message: "Error while deleting playlist" })
    }
};

export const getUnpurchasedPaidPlaylists = async (req, res) => {
  try {
    const userId = req.user.id;

    const purchased = await db.playlistPurchase.findMany({
      where: { userId },
      select: { playlistId: true },
    });

    const purchasedIds = purchased.map(p => p.playlistId);

    const playlists = await db.playlist.findMany({
      where: {
        isPaid: true,
        id: {
          notIn: purchasedIds,
        },
      },
      include: {
        problems: true,
      },
    });

    return res.status(200).json({
      success: true,
      message: "Unpurchased paid playlists fetched successfully",
      playlists,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Error while fetching unpurchased paid playlists" });
  }
};

export const purchasePlaylist = async (req, res) => {
  const {playlistId} = req.params 
  if (!playlistId) {
    return res.status(400).json({ success: false, message: "Playlist ID is required" });
  }

  try {
    const userId = req.user.id;
    const existingPurchase = await db.playlistPurchase.findFirst({
      where: {
        userId,
        playlistId,
      },
    });
    if (existingPurchase) {
      return res.status(409).json({ success: false, message: "Playlist already purchased" });
    }
    const purchase = await db.playlistPurchase.create({
      data: {
        userId,
        playlistId,
      },
      include: {
        playlist: true,
      },
    });
    return res.status(200).json({ success: true, message: `${purchase.playlist.name} Playlist purchased successfully`, playlist:purchase.playlist });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Error while purchasing playlist" });
  }
}