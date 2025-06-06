import { useForm, useFieldArray, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Plus,
  Trash2,
  Code2,
  FileText,
  Lightbulb,
  BookOpen,
  CheckCircle2,
  Download,
  DollarSign,
  ListMusic,
  ChevronDown,
  Loader2,
  Calendar,
} from "lucide-react";
import Editor from "@monaco-editor/react";
import { useState, useEffect } from "react";
import {
  defaultValues,
  problemSchema,
  sampleStringProblem,
  sampledpData,
} from "../../schema/problemSchema";
import { useNavigate } from "react-router-dom";
import { useProblemStore } from "../../store/useProblemStore";
import { usePlaylistStore } from "../../store/usePlaylistStore";

const CreateProblemForm = () => {
  const [sampleType, setSampleType] = useState("DP");
  const navigation = useNavigate();
  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(problemSchema),
    defaultValues: defaultValues,
  });

  const { playlists, getAllPlaylistsOfUser } = usePlaylistStore();
  const isPaid = watch("isPaid");
  const createNewPlaylist = watch("createNewPlaylist");

  useEffect(() => {
    getAllPlaylistsOfUser();
  }, []);

  const {
    fields: testcaseFields,
    append: appendTestcase,
    remove: removeTestcase,
    replace: replaceTestcases,
  } = useFieldArray({ control, name: "testcases" });

  const {
    fields: tagFields,
    append: appendTag,
    remove: removeTag,
    replace: replaceTags,
  } = useFieldArray({ control, name: "tags" });

  const {
    fields: askedInFields,
    append: appendAskedIn,
    remove: removeAskedIn,
  } = useFieldArray({ control, name: "askedIn" });

  const { isLoading, createProblem } = useProblemStore();
  const onSubmit = async (value) => {
    console.log("Form submitted with values:", value);
    const res = await createProblem(value);
    if (res?.data?.success) navigation("/problems");
  };

  const loadSampleData = () => {
    const sampleData = sampleType === "DP" ? sampledpData : sampleStringProblem;
    replaceTags(sampleData.tags.map((tag) => tag));
    replaceTestcases(sampleData.testcases.map((tc) => tc));

    // reset form with sample data
    reset(sampleData);
  };

  const addAskedInDate = () => {
    const today = new Date();
    const formattedDate = today
      .toLocaleDateString("en-GB")
      .split("/")
      .join("-");
    appendAskedIn(formattedDate);
  };

  const handleIsPaidChange = (e) => {
    const checked = e.target.checked;
    setValue("isPaid", checked);
    if (!checked) {
      setValue("createNewPlaylist", false);
      setValue("playlistName", "");
    }
  };

  const handleCreateNewPlaylistChange = (e) => {
    const checked = e.target.checked;
    setValue("createNewPlaylist", checked);
    if (checked) {
      setValue("isPaid", true);
      setValue("playlistName", "");
    }
  };

  const handlePlaylistSelect = (e) => {
    setValue("playlistName", e.target.value);
  };

  const paidPlaylists = playlists.filter((playlist) => playlist.isPaid);

  return (
    <div className="min-h-screen min-w-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-gray-100 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="bg-gray-800/70 rounded-xl border border-gray-700 shadow-xl overflow-hidden backdrop-blur-sm">
          <div className="p-6 md:p-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 md:mb-8 pb-4 border-b border-gray-700">
              <h2 className="text-2xl md:text-3xl font-bold flex items-center gap-3 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                <FileText className="w-6 h-6 md:w-8 md:h-8 text-purple-400" />
                Create Problem
              </h2>

              <div className="flex flex-col md:flex-row gap-3 mt-4 md:mt-0">
                <div className="join bg-gray-700/50 rounded-lg overflow-hidden border border-gray-600">
                  <button
                    type="button"
                    className={`join-item px-4 py-2 ${
                      sampleType === "DP"
                        ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white"
                        : "bg-transparent text-gray-300 hover:bg-gray-600/50"
                    }`}
                    onClick={() => setSampleType("DP")}
                  >
                    DP Problem
                  </button>
                  <button
                    type="button"
                    className={`join-item px-4 py-2 ${
                      sampleType === "string"
                        ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white"
                        : "bg-transparent text-gray-300 hover:bg-gray-600/50"
                    }`}
                    onClick={() => setSampleType("string")}
                  >
                    String Problem
                  </button>
                </div>
                <button
                  type="button"
                  className="btn bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white gap-2 shadow-lg"
                  onClick={loadSampleData}
                >
                  <Download className="w-4 h-4" />
                  Load Sample
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
              {/* Basic Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="form-control md:col-span-2">
                  <label className="label">
                    <span className="label-text text-gray-300 font-medium">
                      Title
                    </span>
                  </label>
                  <input
                    type="text"
                    className="input bg-gray-700/50 border-gray-600 focus:border-purple-500 focus:ring-1 focus:ring-purple-500/30 w-full placeholder-gray-400"
                    {...register("title")}
                    placeholder="Enter problem title"
                  />
                  {errors.title && (
                    <label className="label">
                      <span className="label-text-alt text-red-400">
                        {errors.title.message}
                      </span>
                    </label>
                  )}
                </div>

                <div className="form-control md:col-span-2">
                  <label className="label">
                    <span className="label-text text-gray-300 font-medium">
                      Description
                    </span>
                  </label>
                  <textarea
                    className="textarea bg-gray-700/50 border-gray-600 focus:border-purple-500 focus:ring-1 focus:ring-purple-500/30 min-h-32 w-full p-4 resize-y placeholder-gray-400"
                    {...register("description")}
                    placeholder="Enter problem description"
                  />
                  {errors.description && (
                    <label className="label">
                      <span className="label-text-alt text-red-400">
                        {errors.description.message}
                      </span>
                    </label>
                  )}
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text text-gray-300 font-medium">
                      Difficulty
                    </span>
                  </label>
                  <div className="relative">
                    <select
                      className="select bg-gray-700/50 border-gray-600 focus:border-purple-500 focus:ring-1 focus:ring-purple-500/30 w-full appearance-none text-gray-300"
                      {...register("difficulty")}
                    >
                      <option value="EASY" className="bg-gray-800">
                        Easy
                      </option>
                      <option value="MEDIUM" className="bg-gray-800">
                        Medium
                      </option>
                      <option value="HARD" className="bg-gray-800">
                        Hard
                      </option>
                    </select>
                    <ChevronDown className="absolute right-3 top-3 h-4 w-4 text-gray-400 pointer-events-none" />
                  </div>
                  {errors.difficulty && (
                    <label className="label">
                      <span className="label-text-alt text-red-400">
                        {errors.difficulty.message}
                      </span>
                    </label>
                  )}
                </div>

                <div className="form-control flex flex-col">
                  <label className="label">
                    <span className="label-text text-gray-300 font-medium">
                      Paid Problem
                    </span>
                  </label>
                  <label className="cursor-pointer label justify-start gap-3">
                    <div
                      className={`relative w-12 h-6 transition-all duration-300 rounded-full ${
                        isPaid
                          ? "bg-gradient-to-r from-blue-500 to-purple-500"
                          : "bg-gray-600"
                      }`}
                    >
                      <input
                        type="checkbox"
                        className="sr-only"
                        {...register("isPaid")}
                        onChange={handleIsPaidChange}
                      />
                      <div
                        className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all duration-300 ${
                          isPaid ? "left-7" : "left-1"
                        }`}
                      ></div>
                    </div>
                    <span className="label-text text-gray-300">
                      {isPaid ? "Premium Content" : "Free Content"}
                    </span>
                  </label>
                </div>
              </div>

              {/* Paid Problem Fields */}
              {isPaid &&  createNewPlaylist && (
                <div className="bg-gray-700/30 rounded-lg p-6 border border-gray-600 shadow-inner">
                  <h3 className="text-xl font-semibold mb-6 flex items-center gap-2 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                    <DollarSign className="w-5 h-5 text-purple-400" />
                    Paid Problem Details
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text text-gray-300 font-medium">
                          Price (in INR)
                        </span>
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                          <span>₹</span>
                        </div>
                        <input
                          type="number"
                          className="input bg-gray-700/50 border-gray-600 focus:border-purple-500 focus:ring-1 focus:ring-purple-500/30 w-full pl-8 placeholder-gray-400"
                          {...register("price", { valueAsNumber: true })}
                          placeholder="Enter price in INR"
                          min="0"
                        />
                      </div>
                      {errors.price && (
                        <label className="label">
                          <span className="label-text-alt text-red-400">
                            {errors.price.message}
                          </span>
                        </label>
                      )}
                    </div>                    
                  </div>
                </div>
              )}

              {/* Playlist Section */}
              {isPaid && (
                <div className="bg-gray-700/30 rounded-lg p-6 border border-gray-600 shadow-inner">
                  <h3 className="text-xl font-semibold mb-6 flex items-center gap-2 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                    <ListMusic className="w-5 h-5 text-blue-400" />
                    Playlist Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="form-control flex flex-col">
                      <label className="label">
                        <span className="label-text text-gray-300 font-medium">
                          Create New Playlist
                        </span>
                      </label>
                      <label className="cursor-pointer label justify-start gap-3">
                        <div
                          className={`relative w-12 h-6 transition-all duration-300 rounded-full ${
                            createNewPlaylist
                              ? "bg-gradient-to-r from-blue-500 to-purple-500"
                              : "bg-gray-600"
                          }`}
                        >
                          <input
                            type="checkbox"
                            className="sr-only"
                            {...register("createNewPlaylist")}
                            onChange={handleCreateNewPlaylistChange}
                          />
                          <div
                            className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all duration-300 ${
                              createNewPlaylist ? "left-7" : "left-1"
                            }`}
                          ></div>
                        </div>
                        <span className="label-text text-gray-300">
                          {createNewPlaylist ? "Yes" : "No"}
                        </span>
                      </label>
                    </div>

                    {/* Show playlist select only when isPaid is true AND createNewPlaylist is false */}
                    {isPaid && !createNewPlaylist && (
                      <div className="form-control md:col-span-2">
                        <label className="label">
                          <span className="label-text text-gray-300 font-medium">
                            Select Paid Playlist
                          </span>
                        </label>
                        <select
                          className="select bg-gray-700/50 border-gray-600 focus:border-purple-500 focus:ring-1 focus:ring-purple-500/30 w-full text-gray-300"
                          {...register("playlistName", {
                            required:
                              isPaid && !createNewPlaylist
                                ? "Please select a playlist"
                                : false,
                          })}
                          onChange={handlePlaylistSelect}
                        >
                          <option
                            value=""
                            className="bg-gray-800 text-gray-400"
                          >
                            Select a playlist
                          </option>
                          {paidPlaylists.map((playlist) => (
                            <option
                              key={playlist.id}
                              value={playlist.name}
                              className="bg-gray-800"
                            >
                              {playlist.name} ({playlist.problems.length}{" "}
                              problems)
                            </option>
                          ))}
                        </select>
                        {errors.playlistName && (
                          <label className="label">
                            <span className="label-text-alt text-red-400">
                              {errors.playlistName.message}
                            </span>
                          </label>
                        )}
                      </div>
                    )}

                    {/* Show new playlist fields only when createNewPlaylist is true */}
                    {createNewPlaylist && (
                      <>
                        <div className="form-control md:col-span-2">
                          <label className="label">
                            <span className="label-text text-gray-300 font-medium">
                              New Playlist Name
                            </span>
                          </label>
                          <input
                            type="text"
                            className="input bg-gray-700/50 border-gray-600 focus:border-purple-500 focus:ring-1 focus:ring-purple-500/30 w-full placeholder-gray-400"
                            {...register("playlistName", {
                              required: createNewPlaylist
                                ? "Playlist name is required"
                                : false,
                            })}
                            placeholder="Enter new playlist name"
                          />
                          {errors.playlistName && (
                            <label className="label">
                              <span className="label-text-alt text-red-400">
                                {errors.playlistName.message}
                              </span>
                            </label>
                          )}
                        </div>

                        <div className="form-control md:col-span-2">
                          <label className="label">
                            <span className="label-text text-gray-300 font-medium">
                              Playlist Description
                            </span>
                          </label>
                          <textarea
                            className="textarea bg-gray-700/50 border-gray-600 focus:border-purple-500 focus:ring-1 focus:ring-purple-500/30 w-full placeholder-gray-400"
                            {...register("playlistDescription", {
                              required: createNewPlaylist
                                ? "Playlist description is required"
                                : false,
                            })}
                            placeholder="Enter playlist description"
                          />
                          {errors.playlistDescription && (
                            <label className="label">
                              <span className="label-text-alt text-red-400">
                                {errors.playlistDescription.message}
                              </span>
                            </label>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                </div>
              )}

              {/* Asked In Dates */}
              {
                  isPaid && (
                    <div className="bg-gray-700/30 rounded-lg p-6 border border-gray-600 shadow-inner">
                    <div className="form-control md:col-span-2">
                      <div className="flex justify-between items-center mb-2">
                        <label className="label">
                          <span className="label-text text-gray-300 font-medium">
                            Asked In Dates
                          </span>
                        </label>
                        <button
                          type="button"
                          className="btn btn-sm bg-gradient-to-r from-blue-500/80 to-purple-500/80 hover:from-blue-500 hover:to-purple-500 text-white"
                          onClick={addAskedInDate}
                        >
                          <Plus className="w-4 h-4 mr-1" /> Add Date
                        </button>
                      </div>
                      <div className="space-y-3">
                        {askedInFields.map((field, index) => (
                          <div
                            key={field.id}
                            className="flex gap-2 items-center"
                          >
                            <div className="relative flex-1">
                              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                                <Calendar className="h-4 w-4" />
                              </div>
                              <input
                                type="text"
                                className="input bg-gray-700/50 border-gray-600 focus:border-purple-500 focus:ring-1 focus:ring-purple-500/30 w-full pl-10 placeholder-gray-400"
                                {...register(`askedIn.${index}`)}
                                placeholder="DD-MM-YYYY or Company name"
                              />
                            </div>
                            <button
                              type="button"
                              className="btn btn-ghost btn-square btn-sm text-red-400 hover:text-red-300"
                              onClick={() => removeAskedIn(index)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                    </div>
                )
              }

              {/* Tags */}
              <div className="bg-gray-700/30 rounded-lg p-6 border border-gray-600 shadow-inner">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-semibold flex items-center gap-2 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                    <BookOpen className="w-5 h-5 text-purple-400" />
                    Tags
                  </h3>
                  <button
                    type="button"
                    className="btn bg-gradient-to-r from-blue-500/80 to-purple-500/80 hover:from-blue-500 hover:to-purple-500 text-white"
                    onClick={() => appendTag("")}
                  >
                    <Plus className="w-4 h-4 mr-1" /> Add Tag
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {tagFields.map((field, index) => (
                    <div key={field.id} className="flex gap-2 items-center">
                      <input
                        type="text"
                        className="input bg-gray-700/50 border-gray-600 focus:border-purple-500 focus:ring-1 focus:ring-purple-500/30 flex-1 placeholder-gray-400"
                        {...register(`tags.${index}`)}
                        placeholder="Enter tag"
                      />
                      <button
                        type="button"
                        className="btn btn-ghost btn-square btn-sm text-red-400 hover:text-red-300"
                        onClick={() => removeTag(index)}
                        disabled={tagFields.length === 1}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
                {errors.tags && (
                  <div className="mt-2">
                    <span className="text-red-400 text-sm">
                      {errors.tags.message}
                    </span>
                  </div>
                )}
              </div>

              {/* Test Cases */}
              <div className="bg-gray-700/30 rounded-lg p-6 border border-gray-600 shadow-inner">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-semibold flex items-center gap-2 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                    <CheckCircle2 className="w-5 h-5 text-green-400" />
                    Test Cases
                  </h3>
                  <button
                    type="button"
                    className="btn bg-gradient-to-r from-blue-500/80 to-purple-500/80 hover:from-blue-500 hover:to-purple-500 text-white"
                    onClick={() => appendTestcase({ input: "", output: "" })}
                  >
                    <Plus className="w-4 h-4 mr-1" /> Add Test Case
                  </button>
                </div>
                <div className="space-y-6">
                  {testcaseFields.map((field, index) => (
                    <div
                      key={field.id}
                      className="bg-gray-800/50 rounded-lg border border-gray-700"
                    >
                      <div className="p-4 md:p-6">
                        <div className="flex justify-between items-center mb-4">
                          <h4 className="text-lg font-semibold">
                            Test Case #{index + 1}
                          </h4>
                          <button
                            type="button"
                            className="btn btn-sm btn-ghost text-red-400 hover:text-red-300"
                            onClick={() => removeTestcase(index)}
                            disabled={testcaseFields.length === 1}
                          >
                            <Trash2 className="w-4 h-4 mr-1" /> Remove
                          </button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                          <div className="form-control">
                            <label className="label">
                              <span className="label-text text-gray-300 font-medium">
                                Input
                              </span>
                            </label>
                            <textarea
                              className="textarea bg-gray-700/50 border-gray-600 focus:border-purple-500 focus:ring-1 focus:ring-purple-500/30 min-h-24 w-full p-3 resize-y placeholder-gray-400"
                              {...register(`testcases.${index}.input`)}
                              placeholder="Enter test case input"
                            />
                            {errors.testcases?.[index]?.input && (
                              <label className="label">
                                <span className="label-text-alt text-red-400">
                                  {errors.testcases[index].input.message}
                                </span>
                              </label>
                            )}
                          </div>
                          <div className="form-control">
                            <label className="label">
                              <span className="label-text text-gray-300 font-medium">
                                Expected Output
                              </span>
                            </label>
                            <textarea
                              className="textarea bg-gray-700/50 border-gray-600 focus:border-purple-500 focus:ring-1 focus:ring-purple-500/30 min-h-24 w-full p-3 resize-y placeholder-gray-400"
                              {...register(`testcases.${index}.output`)}
                              placeholder="Enter expected output"
                            />
                            {errors.testcases?.[index]?.output && (
                              <label className="label">
                                <span className="label-text-alt text-red-400">
                                  {errors.testcases[index].output.message}
                                </span>
                              </label>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                {errors.testcases && !Array.isArray(errors.testcases) && (
                  <div className="mt-2">
                    <span className="text-red-400 text-sm">
                      {errors.testcases.message}
                    </span>
                  </div>
                )}
              </div>

              {/* Code Editor Sections */}
              <div className="space-y-8">
                {["PYTHON", "JAVA", "JAVASCRIPT"].map(
                  (language) => (
                    <div
                      key={language}
                      className="bg-gray-700/30 rounded-lg p-6 border border-gray-600 shadow-inner"
                    >
                      <h3 className="text-xl font-semibold mb-6 flex items-center gap-2 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                        <Code2 className="w-5 h-5 text-blue-400" />
                        {language}
                      </h3>

                      <div className="space-y-6">
                        {/* Starter Code */}
                        <div className="bg-gray-800/50 rounded-lg border border-gray-700">
                          <div className="p-4 md:p-6">
                            <h4 className="font-semibold text-lg mb-4">
                              Starter Code Template
                            </h4>
                            <div className="border border-gray-700 rounded-md overflow-hidden">
                              <Controller
                                name={`codeSnippets.${language}`}
                                control={control}
                                render={({ field }) => (
                                  <Editor
                                    height="300px"
                                    language={language.toLowerCase()}
                                    theme="vs-dark"
                                    value={field.value}
                                    onChange={field.onChange}
                                    options={{
                                      minimap: { enabled: false },
                                      fontSize: 14,
                                      lineNumbers: "on",
                                      roundedSelection: false,
                                      scrollBeyondLastLine: false,
                                      automaticLayout: true,
                                    }}
                                  />
                                )}
                              />
                            </div>
                            {errors.codeSnippets?.[language] && (
                              <div className="mt-2">
                                <span className="text-red-400 text-sm">
                                  {errors.codeSnippets[language].message}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Reference Solution */}
                        <div className="bg-gray-800/50 rounded-lg border border-gray-700">
                          <div className="p-4 md:p-6">
                            <h4 className="font-semibold text-lg mb-4 flex items-center gap-2">
                              <CheckCircle2 className="w-5 h-5 text-green-400" />
                              Reference Solution
                            </h4>
                            <div className="border border-gray-700 rounded-md overflow-hidden">
                              <Controller
                                name={`referenceSolutions.${language}`}
                                control={control}
                                render={({ field }) => (
                                  <Editor
                                    height="300px"
                                    language={language.toLowerCase()}
                                    theme="vs-dark"
                                    value={field.value}
                                    onChange={field.onChange}
                                    options={{
                                      minimap: { enabled: false },
                                      fontSize: 14,
                                      lineNumbers: "on",
                                      roundedSelection: false,
                                      scrollBeyondLastLine: false,
                                      automaticLayout: true,
                                    }}
                                  />
                                )}
                              />
                            </div>
                            {errors.referenceSolutions?.[language] && (
                              <div className="mt-2">
                                <span className="text-red-400 text-sm">
                                  {errors.referenceSolutions[language].message}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Examples */}
                        <div className="bg-gray-800/50 rounded-lg border border-gray-700">
                          <div className="p-4 md:p-6">
                            <h4 className="font-semibold text-lg mb-4">
                              Example
                            </h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                              <div className="form-control">
                                <label className="label">
                                  <span className="label-text text-gray-300 font-medium">
                                    Input
                                  </span>
                                </label>
                                <textarea
                                  className="textarea bg-gray-700/50 border-gray-600 focus:border-purple-500 focus:ring-1 focus:ring-purple-500/30 min-h-20 w-full p-3 resize-y placeholder-gray-400"
                                  {...register(`examples.${language}.input`)}
                                  placeholder="Example input"
                                />
                                {errors.examples?.[language]?.input && (
                                  <label className="label">
                                    <span className="label-text-alt text-red-400">
                                      {errors.examples[language].input.message}
                                    </span>
                                  </label>
                                )}
                              </div>
                              <div className="form-control">
                                <label className="label">
                                  <span className="label-text text-gray-300 font-medium">
                                    Output
                                  </span>
                                </label>
                                <textarea
                                  className="textarea bg-gray-700/50 border-gray-600 focus:border-purple-500 focus:ring-1 focus:ring-purple-500/30 min-h-20 w-full p-3 resize-y placeholder-gray-400"
                                  {...register(`examples.${language}.output`)}
                                  placeholder="Example output"
                                />
                                {errors.examples?.[language]?.output && (
                                  <label className="label">
                                    <span className="label-text-alt text-red-400">
                                      {errors.examples[language].output.message}
                                    </span>
                                  </label>
                                )}
                              </div>
                              <div className="form-control md:col-span-2">
                                <label className="label">
                                  <span className="label-text text-gray-300 font-medium">
                                    Explanation
                                  </span>
                                </label>
                                <textarea
                                  className="textarea bg-gray-700/50 border-gray-600 focus:border-purple-500 focus:ring-1 focus:ring-purple-500/30 min-h-24 w-full p-3 resize-y placeholder-gray-400"
                                  {...register(
                                    `examples.${language}.explanation`
                                  )}
                                  placeholder="Explain the example"
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                )}
              </div>

              {/* Additional Information */}
              <div className="bg-gray-700/30 rounded-lg p-6 border border-gray-600 shadow-inner">
                <h3 className="text-xl font-semibold mb-6 flex items-center gap-2 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  <Lightbulb className="w-5 h-5 text-yellow-400" />
                  Additional Information
                </h3>
                <div className="space-y-6">
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text text-gray-300 font-medium">
                        Constraints
                      </span>
                    </label>
                    <textarea
                      className="textarea bg-gray-700/50 border-gray-600 focus:border-purple-500 focus:ring-1 focus:ring-purple-500/30 min-h-24 w-full p-3 resize-y placeholder-gray-400"
                      {...register("constraints")}
                      placeholder="Enter problem constraints"
                    />
                    {errors.constraints && (
                      <label className="label">
                        <span className="label-text-alt text-red-400">
                          {errors.constraints.message}
                        </span>
                      </label>
                    )}
                  </div>
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text text-gray-300 font-medium">
                        Hints (Optional)
                      </span>
                    </label>
                    <textarea
                      className="textarea bg-gray-700/50 border-gray-600 focus:border-purple-500 focus:ring-1 focus:ring-purple-500/30 min-h-24 w-full p-3 resize-y placeholder-gray-400"
                      {...register("hints")}
                      placeholder="Enter hints for solving the problem"
                    />
                  </div>
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text text-gray-300 font-medium">
                        Editorial (Optional)
                      </span>
                    </label>
                    <textarea
                      className="textarea bg-gray-700/50 border-gray-600 focus:border-purple-500 focus:ring-1 focus:ring-purple-500/30 min-h-32 w-full p-3 resize-y placeholder-gray-400"
                      {...register("editorial")}
                      placeholder="Enter problem editorial/solution explanation"
                    />
                  </div>
                </div>
              </div>

              <div className="card-actions justify-end pt-4 border-t border-gray-700">
                <button
                  type="submit"
                  className="btn bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white gap-2 shadow-lg"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-5 h-5" />
                      Create Problem
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateProblemForm;
