import { db } from "../libs/db.js";

export const createPlaylist = async (req, res) => {
  const { name, description } = req.body;
  if (!name) {
    return res.status(400).json({ error: "Playlist name is required" });
  }

  const userId = req.user.userId;

  try {
    const existingPlaylist = await db.playlist.findFirst({
      where: {
        name,
        userId,
      },
    });

    if (existingPlaylist) {
      return res.status(409).json({ error: "Playlist already exists" });
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
    return res.status(500).json({ error: "Error while creating playlist" });
  }
};

export const getAllListDetails = async (req, res) => {
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
        return res.status(400).json({ error: "Playlist ID is required" })
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
            return res.status(404).json({ error: "Playlist not found" })
        }

        return res.status(200).json({ success: true, message: "Playlist fetched successfully", playlist })
    } catch (error) {
        console.error(error)
        return res.status(500).json({ error: "Error while fetching playlist" })
    }
};

export const addProblemToPlaylist = async (req, res) => {
    const { playlistId } = req.params;
    const { problemIds } = req.body;

    if (!playlistId || !Array.isArray(problemIds)) {
        return res.status(400).json({ error: "Playlist ID and problem IDs are required" });
    }

    try {
        // Get existing problem IDs in this playlist
        const existing = await db.problemInPlaylist.findMany({
            where: {
                playlistId,
                problemId: { in: problemIds }
            }
        });

        // Extract existing problemIds
        const existingIds = existing.map(item => item.problemId);

        // Filter out duplicates
        const newProblemIds = problemIds.filter(id => !existingIds.includes(id));

        // If nothing new to add
        if (newProblemIds.length === 0) {
            return res.status(200).json({ message: "All problems already exist in the playlist" });
        }

        // Add new problems to playlist
        await db.problemInPlaylist.createMany({
            data: newProblemIds.map(problemId => ({
                playlistId,
                problemId
            }))
        });

        return res.status(201).json({ success: true, message: "Problems added to playlist" });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Error while adding problems to playlist" });
    }
};

export const removeProblemFromPlaylist = async (req, res) => {
    const { playlistId } = req.params;
    const { problemIds } = req.body;

    if (!playlistId || !Array.isArray(problemIds)) {
        return res.status(400).json({ error: "Playlist ID and problem IDs are required" });
    }

    try {
        const result = await db.problemInPlaylist.deleteMany({
            where: {
                playlistId,
                problemId: { in: problemIds }
            }
        });

        if (result.count === 0) {
            return res.status(404).json({ error: "No problems found in playlist" });
        }

        return res.status(200).json({ success: true, message: `${result.count} problem(s) removed from playlist` });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Error while removing problems from playlist" });
    }
};

export const deletePlaylist = async (req, res) => {
    const {playlistId} = req.params
    if(!playlistId) {
        return res.status(400).json({ error: "Playlist ID is required" })
    }

    try {
        const deletePlaylist = await db.playlist.delete({
            where: {
                id: playlistId,
            }
        })

        return res.status(200).json({ success: true, message: `Playlist ${deletePlaylist.name} deleted successfully`, deletePlaylist })
    } catch (error) {
        return res.status(500).json({ error: "Error while deleting playlist" })
    }
};
