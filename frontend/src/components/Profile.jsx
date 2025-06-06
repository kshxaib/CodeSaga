import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { Edit, Loader2, Globe, Linkedin, User, BookOpen, Users, Mail, Home } from "lucide-react";
import { useUserStore } from "../store/useUserStore";

const Profile = () => {
  const { user, isLoading, getUserDetails, updateProfile } = useUserStore();
  const [isEditing, setIsEditing] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [updateLoading, setUpdateLoading] = useState(false);

  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  useEffect(() => {
    getUserDetails();
  }, [getUserDetails]);

  useEffect(() => {
    if (user) {
      reset({
        bio: user.bio || "",
        linkedin: user.linkedin || "",
        portfolio: user.portfolio || "",
      });
      setPreviewImage(user.image);
    }
  }, [user, reset]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (data) => {
    setUpdateLoading(true);
    const formData = new FormData();
    
    if (data.bio) formData.append("bio", data.bio);
    if (data.linkedin) formData.append("linkedin", data.linkedin);
    if (data.portfolio) formData.append("portfolio", data.portfolio);
    
    if (selectedFile) {
      formData.append("image", selectedFile);
    }

    try {
      await updateProfile(formData);
      setIsEditing(false);
      await getUserDetails();
    } catch (error) {
      console.error("Update error:", error);
    } finally {
      setUpdateLoading(false);
    }
  };

  if (isLoading && !user) {
    return (
      <div className="min-h-screen min-w-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-blue-400" />
      </div>
    );
  }

  return (
    <div className="min-w-screen min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-gray-100">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        <div className="mb-6">
          <Link 
            to="/home" 
            className="inline-flex items-center text-blue-400 hover:text-blue-300 transition-colors"
          >
            <Home className="h-5 w-5 mr-2" />
            Back to Home
          </Link>
        </div>

        <div className="bg-gray-800/50 rounded-2xl border border-gray-700 shadow-xl overflow-hidden">
          <div className="relative h-48 bg-gradient-to-r from-blue-900/50 to-purple-900/50">
            <div className="absolute -bottom-16 left-8">
              <div className="relative group">
                <div className="h-32 w-32 rounded-full border-4 border-gray-800 bg-gray-700 overflow-hidden shadow-lg">
                  {previewImage ? (
                    <img
                      src={previewImage}
                      alt={user?.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center bg-gray-600">
                      <User className="h-16 w-16 text-gray-400" />
                    </div>
                  )}
                </div>
                {isEditing && (
                  <label
                    htmlFor="profile-image"
                    className="absolute bottom-0 right-0 bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-full cursor-pointer shadow-lg transition-all transform group-hover:scale-110"
                  >
                    <Edit className="h-4 w-4" />
                    <input
                      id="profile-image"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleFileChange}
                    />
                  </label>
                )}
              </div>
            </div>

            <div className="absolute bottom-6 right-6">
              {isEditing ? (
                <div className="flex space-x-3">
                  <button
                    onClick={() => {
                      setIsEditing(false);
                      setSelectedFile(null);
                      setPreviewImage(user?.image);
                    }}
                    className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-md text-sm font-medium transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSubmit(onSubmit)}
                    disabled={updateLoading}
                    className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 rounded-md text-sm font-medium transition-colors flex items-center disabled:opacity-70"
                  >
                    {updateLoading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        Saving...
                      </>
                    ) : (
                      "Save Changes"
                    )}
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setIsEditing(true)}
                  className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 rounded-md text-sm font-medium transition-colors flex items-center"
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Profile
                </button>
              )}
            </div>
          </div>

          {user && (
            <div className="pt-20 px-8 pb-8">
              <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-6">
                <div className="flex-1">
                  <div className="mb-6">
                    <h1 className="text-3xl font-bold text-white">{user.name}</h1>
                    <p className="text-gray-400">@{user.username}</p>
                  </div>

                  <div className="flex space-x-6 mb-8">
                    
                    <div className="text-center bg-gray-700/50 px-4 py-3 rounded-lg">
                      <span className="block text-xl font-bold text-indigo-400">
                        {new Date(user.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </span>
                      <span className="text-sm text-gray-400">Member Since</span>
                    </div>
                  </div>

                  {isEditing ? (
                    <div className="mb-6">
                      <label htmlFor="bio" className="block text-sm font-medium text-gray-300 mb-2">
                        Bio
                      </label>
                      <textarea
                        id="bio"
                        {...register("bio", { maxLength: 200 })}
                        rows="3"
                        className="block w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-400"
                        placeholder="Tell us about yourself..."
                      />
                      {errors.bio && (
                        <p className="mt-2 text-sm text-red-400">
                          Bio should be less than 200 characters
                        </p>
                      )}
                    </div>
                  ) : (
                    user.bio && (
                      <div className="mb-6">
                        <h3 className="text-lg font-semibold text-gray-300 mb-2">About</h3>
                        <div className="flex items-start bg-gray-700/50 p-4 rounded-lg">
                          <BookOpen className="h-5 w-5 text-blue-400 mr-3 mt-0.5 flex-shrink-0" />
                          <p className="text-gray-300">{user.bio}</p>
                        </div>
                      </div>
                    )
                  )}
                </div>

                <div className="md:w-80 space-y-6">
                  <div className="bg-gray-700/50 p-5 rounded-xl">
                    <h3 className="text-lg font-semibold text-gray-300 mb-4">Contact Information</h3>
                    <div className="space-y-4">
                      <div className="flex items-center">
                        <Mail className="h-5 w-5 text-blue-400 mr-3" />
                        <span className="text-gray-300">{user.email}</span>
                      </div>

                      {isEditing ? (
                        <>
                          <div>
                            <label htmlFor="linkedin" className="block text-sm font-medium text-gray-300 mb-1">
                              LinkedIn
                            </label>
                            <div className="relative rounded-lg shadow-sm">
                              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
                                <Linkedin className="h-5 w-5" />
                              </div>
                              <input
                                type="url"
                                id="linkedin"
                                {...register("linkedin")}
                                className="block w-full pl-10 pr-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-400"
                                placeholder="https://linkedin.com/in/username"
                              />
                            </div>
                          </div>

                          <div>
                            <label htmlFor="portfolio" className="block text-sm font-medium text-gray-300 mb-1">
                              Portfolio
                            </label>
                            <div className="relative rounded-lg shadow-sm">
                              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
                                <Globe className="h-5 w-5" />
                              </div>
                              <input
                                type="url"
                                id="portfolio"
                                {...register("portfolio")}
                                className="block w-full pl-10 pr-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-400"
                                placeholder="https://yourportfolio.com"
                              />
                            </div>
                          </div>
                        </>
                      ) : (
                        <>
                          {user.linkedin && (
                            <div className="flex items-center">
                              <Linkedin className="h-5 w-5 text-blue-400 mr-3" />
                              <a
                                href={user.linkedin}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-400 hover:text-blue-300 hover:underline"
                              >
                                LinkedIn
                              </a>
                            </div>
                          )}
                          {user.portfolio && (
                            <div className="flex items-center">
                              <Globe className="h-5 w-5 text-blue-400 mr-3" />
                              <a
                                href={user.portfolio}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-400 hover:text-blue-300 hover:underline"
                              >
                                Portfolio
                              </a>
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;