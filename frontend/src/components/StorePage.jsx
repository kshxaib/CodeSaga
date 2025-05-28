import React, { useEffect, useState } from 'react'
import { usePlaylistStore } from '../store/usePlaylistStore'
import { useAuthStore } from '../store/useAuthStore'
import { Lock, DollarSign, CheckCircle2, Loader2 } from 'lucide-react'
import { Link } from 'react-router-dom'
import moment from 'moment'

const StorePage = () => {
  const { unpurchasedPlaylists, getUnpurchasedPaidPlaylists } = usePlaylistStore()
  const { authUser } = useAuthStore()
  const [isStoreLoading, setIsStoreLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      setIsStoreLoading(true)
      await getUnpurchasedPaidPlaylists()
      setIsStoreLoading(false)
    }

    fetchData()
  }, [])

  const handlePurchaseClick = (playlistId) => {
    console.log("Purchasing playlist with ID:", playlistId)
    // Just logging for now as requested
  }

  if (isStoreLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
        <Loader2 className="w-12 h-12 animate-spin text-purple-500" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white px-4 py-10">
      <div className="max-w-6xl mx-auto">
        <div className="mb-10">
          <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
            Premium Playlists Store
          </h1>
          <p className="text-gray-400 mt-2">
            Upgrade your skills with our premium problem collections
          </p>
          <p className="text-gray-400 mt-2">
            Available Playlists: <span className="font-semibold text-blue-400">{unpurchasedPlaylists.length}</span>
          </p>
        </div>

        {unpurchasedPlaylists.length > 0 ? (
          <>
            <div className="grid gap-6">
              {unpurchasedPlaylists.map((playlist) => {
                const totalProblems = playlist.problems?.length || 0
                const purchaseCount = playlist.purchases?.length || 0

                return (
                  <div
                    key={playlist.id}
                    className="bg-gray-800/80 backdrop-blur-sm border border-yellow-500/30 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all"
                  >
                    <div className="p-6">
                      <div className="flex flex-col md:flex-row justify-between gap-6">
                        <div className="flex-1">
                          <div className="flex items-center gap-3">
                            <h2 className="text-2xl font-bold text-gray-100">
                              {playlist.name}
                            </h2>
                            <span className="inline-flex items-center gap-1 bg-yellow-500/20 text-yellow-400 px-2 py-1 rounded-full text-xs font-medium">
                              <Lock className="w-3 h-3" /> PREMIUM
                            </span>
                          </div>
                          
                          <p className="text-gray-300 mt-2">
                            {playlist.description || "No description provided."}
                          </p>
                          <div className="text-gray-400 text-sm italic">
  Includes years when the questions were asked in real interviews
</div>

                          <div className="flex flex-wrap gap-4 mt-4 text-sm">
                            <div className="flex items-center gap-2 text-gray-400">
                              <span className="font-medium text-blue-400">
                                {totalProblems}
                              </span>
                              <span>problems included</span>
                            </div>
                            <div className="flex items-center gap-2 text-gray-400">
                              <span className="font-medium text-purple-400">
                                {purchaseCount} purchases
                              </span>
                            </div>
                            <div className="flex items-center gap-2 text-gray-400">
                              <span className="font-medium text-purple-400">
                                Last updated: {moment(playlist.updatedAt).fromNow()}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-col items-end gap-4 min-w-[200px]">
                          <div className="text-right">
  <p className="text-gray-400 text-sm">Price</p>
  <p className="text-2xl font-bold text-yellow-400 flex items-center justify-end gap-1">
    <DollarSign className="w-5 h-5 hidden" />
    <span className="text-sm text-gray-300">₹</span>
    {Number(playlist.price).toLocaleString("en-IN")}
  </p>
  <p className="text-xs text-gray-400 mt-1 italic">Just for you 🇮🇳</p>
</div>

                          <button
                            onClick={() => handlePurchaseClick(playlist.id)}
                            className="btn bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-white w-full"
                          >
                            Purchase Now
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
            
            <div className="mt-12 text-center text-gray-400">
              <p className="text-lg">More premium playlists coming soon!</p>
              <p className="mt-2">We're constantly adding new content to help you master coding concepts.</p>
              <p className="mt-2">Check back regularly for updates.</p>
            </div>
          </>
        ) : (
          <div className="bg-gray-800/50 backdrop-blur-sm p-8 rounded-xl border border-gray-700 text-center">
            <div className="max-w-md mx-auto">
              <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center bg-gray-700 rounded-full">
                <CheckCircle2 className="w-8 h-8 text-green-400" />
              </div>
              <h3 className="text-xl font-medium text-gray-200 mb-2">
                No premium playlists available
              </h3>
              <p className="text-gray-400 mb-6">
                {authUser ? "You've purchased all available premium playlists!" : "Please login to view available premium playlists"}
              </p>
              {!authUser && (
                <Link
                  to="/login"
                  className="btn bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white"
                >
                  Login to View Store
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default StorePage