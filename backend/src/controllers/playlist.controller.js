import { db } from "../libs/db.js";
import Razorpay from "razorpay";
import crypto from "crypto";

const razorpayInstance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,  
});

export const createPlaylist = async (req, res) => {
  const { name, description="", isPaid = false, price = 0 } = req.body;
  if (!name) {
    return res.status(400).json({
      success: false,
      message: "Playlist name is required",
    });
  }

  const userId = req.user.id;
  const userRole = req.user.role;

  try {
    const existingPlaylist = await db.playlist.findFirst({
      where: { name, userId },
    });

    if (existingPlaylist) {
      return res.status(409).json({
        success: false,
        message: "Playlist already exists",
      });
    }

    if (isPaid && userRole !== "ADMIN") {
      return res.status(403).json({
        success: false,
        message: "Only admins can create paid playlists",
      });
    }

    const playlist = await db.playlist.create({
      data: {
        name,
        description,
        isPaid,
        price: isPaid ? Number(price) : 0,
        userId,
      },
    });

    return res.status(201).json({
      success: true,
      message: `${playlist.name} playlist created successfully`,
      playlist,
    });
  } catch (error) {
    console.error("Error creating playlist:", error);
    return res.status(500).json({
      success: false,
      message: "Error while creating playlist",
    });
  }
};

export const getAllPlaylistsOfUser = async (req, res) => {
  try {
    const userId = req.user.id;

    const userCreatedPlaylists = await db.playlist.findMany({
      where: { userId },
      include: {
        problems: {
          include: {
            problem: {
              include: {
                solvedBy: true, 
              },
            },
          },
        },
      },
    });

    const purchasedPlaylists = await db.playlist.findMany({
      where: {
        isPaid: true,
        purchases: {
          some: {
            userId,
          },
        },
      },
      include: {
        problems: {
          include: {
            problem: {
              include: {
                solvedBy: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    const playlists = [...userCreatedPlaylists, ...purchasedPlaylists];

    return res.status(200).json({
      success: true,
      message: "Playlists fetched successfully",
      playlists,
    });
  } catch (error) {
    console.error("Error while fetching playlists:", error);
    return res.status(500).json({
      success: false,
      message: "Error while fetching playlists",
    });
  }
};

export const getPlaylistDetails = async (req, res) => {
  const { playlistId } = req.params;

  if (!playlistId) {
    return res.status(400).json({ success: false, message: "Playlist ID is required" });
  }

  try {
    const userId = req.user.id;

    const playlist = await db.playlist.findUnique({
      where: { id: playlistId },
      include: {
        problems: {
          include: {
            problem: true,
          },
        },
        purchases: true, 
      },
    });

    if (!playlist) {
      return res.status(404).json({ success: false, message: "Playlist not found" });
    }

    const isOwner = playlist.userId === userId;
    const isPurchased = playlist.purchases.some(p => p.userId === userId);
    const isAccessible = !playlist.isPaid || isOwner || isPurchased;

    if (!isAccessible) {
      return res.status(403).json({
        success: false,
        message: "You do not have access to view this playlist",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Playlist fetched successfully",
      playlist,
    });

  } catch (error) {
    console.error("Error fetching playlist:", error);
    return res.status(500).json({
      success: false,
      message: "Error while fetching playlist",
    });
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
        return res.status(400).json({ 
            success: false, 
            message: "Playlist ID and problem IDs array are required" 
        });
    }

    try {
        const playlist = await db.playlist.findUnique({
            where: { id: playlistId }
        });
        
        if (!playlist) {
            return res.status(404).json({ 
                success: false, 
                message: "Playlist not found" 
            });
        }

        if (playlist.userId !== req.user.id) {
            return res.status(403).json({ 
                success: false, 
                message: "You are not authorized to modify this playlist" 
            });
        }

        const result = await db.problemInPlaylist.deleteMany({
            where: {
                playlistId,
                problemId: { in: problemIds }
            }
        });

        return res.status(200).json({ 
            success: true, 
            message: `${result.count} problem(s) removed from playlist`,
            count: result.count
        });

    } catch (error) {
        console.error("Error removing problems:", error);
        return res.status(500).json({ 
            success: false, 
            message: "Error while removing problems from playlist",
            error: error.message 
        });
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
        purchases: true,  
      },
      orderBy: {
        createdAt: "desc",
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

export const initiatePlaylistPurchase = async (req, res) => {
  const { playlistId } = req.params;
  if (!playlistId) {
    return res.status(400).json({ success: false, message: "Playlist ID is required" });
  }

  try {
    const userId = req.user.id;
    
    // Check if playlist exists and is paid
    const playlist = await db.playlist.findUnique({
      where: { id: playlistId }
    });

    if (!playlist) {
      return res.status(404).json({ success: false, message: "Playlist not found" });
    }

    if (!playlist.isPaid) {
      return res.status(400).json({ success: false, message: "This playlist is free" });
    }

    // Check if already purchased
    const existingPurchase = await db.playlistPurchase.findFirst({
      where: { userId, playlistId }
    });

    if (existingPurchase) {
      return res.status(409).json({ success: false, message: "Playlist already purchased" });
    }

    // Create Razorpay order
    const receipt = `pl_${playlistId.slice(0, 10)}_u_${userId.slice(0, 10)}`;
    const options = {
      amount: playlist.price * 100, // amount in paise
      currency: "INR",
      receipt: receipt,
      notes: {
        playlistId,
        userId,
      }
    };

    const razorpayOrder = await razorpayInstance.orders.create(options);

    return res.status(200).json({
      success: true,
      message: "Payment initiated",
      order: razorpayOrder,
      key: process.env.RAZORPAY_KEY_ID
    });

  } catch (error) {
    console.error("Error initiating payment:", error);
    return res.status(500).json({ 
      success: false, 
      message: "Error while initiating payment",
    });
  }
};

export const verifyPlaylistPurchase = async (req, res) => {
  const { razorpay_payment_id, razorpay_order_id, razorpay_signature, playlistId } = req.body;
  console.log("request received", razorpay_payment_id, razorpay_order_id, razorpay_signature, playlistId);

  try {
    if (!razorpay_payment_id || !razorpay_order_id || !razorpay_signature || !playlistId) {
      console.error("Missing payment verification fields");
      return res.status(400).json({
        success: false,
        message: "Missing required fields for payment verification",
      });
    }

    const userId = req.user.id;

    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      console.error("Invalid payment signature", {
        expected: expectedSignature,
        received: razorpay_signature
      });
      return res.status(400).json({
        success: false,
        message: "Invalid payment signature",
      });
    }

    const existingPurchase = await db.playlistPurchase.findFirst({
      where: { userId, playlistId }
    });

    if (existingPurchase) {
      console.warn("Duplicate purchase attempt", { userId, playlistId });
      return res.status(409).json({
        success: false,
        message: "Playlist already purchased",
      });
    }

    const purchase = await db.playlistPurchase.create({
      data: {
        userId,
        playlistId,
        paymentId: razorpay_payment_id,
        paymentOrderId: razorpay_order_id,
        paymentSignature: razorpay_signature,
      },
      include: {
        playlist: true,
      },
    });

    console.log("Purchase successful", purchase);

    return res.status(200).json({
  success: true,
  message: `${purchase.playlist.name} playlist purchased successfully`,
  purchase: {
    id: purchase.id,
    playlist: purchase.playlist,
    paymentId: purchase.paymentId,
  },
});

  } catch (error) {
    console.error("Payment verification error:", error);
    return res.status(500).json({
      success: false,
      message: "An error occurred during payment verification",
    });
  }
};

export const getPurchaseHistory = async (req, res) => {
  try {
    const userId = req.user.id;

    const purchases = await db.playlistPurchase.findMany({
      where: { userId },
      include: {
        playlist: {
          include: {
            problems: {
              include: {
                problem: true
              }
            }
          }
        }
      },
      orderBy: {
        createdAt: "desc"
      }
    });

    return res.status(200).json({
      success: true,
      message: "Purchase history fetched successfully",
      purchases
    });

  } catch (error) {
    console.error("Error fetching purchase history:", error);
    return res.status(500).json({
      success: false,
      message: "Error while fetching purchase history"
    });
  }
}; 

export const getLatestUnpurchasedPaidPlaylists = async (req, res) => {
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
        purchases: true,
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 2,
    });

    return res.status(200).json({
      success: true,
      message: "Latest unpurchased paid playlists fetched successfully",
      playlists,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Error while fetching latest unpurchased paid playlists" });
  }
};