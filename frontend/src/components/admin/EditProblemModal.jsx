import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Code2, FileText, Lightbulb, BookOpen, CheckCircle2, X } from "lucide-react";
import Editor from '@monaco-editor/react';
import { problemSchema } from "../../schema/problemSchema";
import { useEffect } from 'react';

const EditProblemModal = ({ 
  isOpen, 
  onClose, 
  problem, 
  onSubmit,
  isLoading
}) => {
  const defaultValues = {
    title: "",
    description: "",
    difficulty: "EASY",
    tags: [],
    testcases: [],
    codeSnippets: {
      PYTHON: "",
      JAVA: "",
      JAVASCRIPT: ""
    },
    referenceSolutions: {
      PYTHON: "",
      JAVA: "",
      JAVASCRIPT: ""
    },
    constraints: "",
    hints: "",
    editorial: ""
  };

  const { 
    register,
    control,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm({
    resolver: zodResolver(problemSchema),
    defaultValues
  });

  const {
    fields: testcaseFields, 
    append: appendTestcase, 
    remove: removeTestcase
  } = useFieldArray({ control, name: "testcases" });

  const {
    fields: tagFields, 
    append: appendTag, 
    remove: removeTag
  } = useFieldArray({ control, name: "tags" });

  useEffect(() => {
  if (isOpen && problem) {
    reset({
      ...defaultValues,
      ...problem,
      testcases: problem.testcases || [],
      tags: problem.tags || [],
      codeSnippets: {
        PYTHON: problem.codeSnippets?.PYTHON || "",
        JAVA: problem.codeSnippets?.JAVA || "",
        JAVASCRIPT: problem.codeSnippets?.JAVASCRIPT || ""
      },
      referenceSolutions: {
        PYTHON: problem.referenceSolutions?.PYTHON || "",
        JAVA: problem.referenceSolutions?.JAVA || "",
        JAVASCRIPT: problem.referenceSolutions?.JAVASCRIPT || ""
      },
    });
  }
}, [isOpen, problem, reset]);

useEffect(() => {
  if (!isOpen) {
    reset(defaultValues);
  }
}, [isOpen, reset]);


  const handleFormSubmit = (data) => {
    onSubmit(data);
  };

  if (!isOpen) return null;  

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex items-center justify-center px-4 overflow-y-auto">
      <div className="bg-white max-w-6xl w-full max-h-screen overflow-y-auto rounded-lg shadow-lg p-6 relative">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <FileText className="w-6 h-6 text-primary" />
            Edit Problem
          </h2>
          <button onClick={onClose} className="btn btn-ghost btn-circle absolute top-4 right-4">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="form-control md:col-span-2">
              <label className="label font-semibold">Title</label>
              <input className="input input-bordered w-full" {...register("title")} />
              {errors.title && <p className="text-error text-sm">{errors.title.message}</p>}
            </div>

            <div className="form-control md:col-span-2">
              <label className="label font-semibold">Description</label>
              <textarea className="textarea textarea-bordered min-h-32 w-full" {...register("description")} />
              {errors.description && <p className="text-error text-sm">{errors.description.message}</p>}
            </div>

            <div className="form-control">
              <label className="label font-semibold">Difficulty</label>
              <select className="select select-bordered w-full" {...register("difficulty")}>
                <option value="EASY">Easy</option>
                <option value="MEDIUM">Medium</option>
                <option value="HARD">Hard</option>
              </select>
              {errors.difficulty && <p className="text-error text-sm">{errors.difficulty.message}</p>}
            </div>
          </div>

          {/* Tags */}
          <div className="card bg-base-200 p-4 shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold flex items-center gap-2"><BookOpen className="w-5 h-5" /> Tags</h3>
              <button type="button" className="btn btn-primary btn-sm" onClick={() => appendTag("")}>Add Tag</button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {tagFields.map((field, index) => (
                <div key={field.id} className="flex gap-2 items-center">
                  <input className="input input-bordered flex-1" {...register(`tags.${index}`)} />
                  <button type="button" className="btn btn-ghost btn-square btn-sm" onClick={() => removeTag(index)}>
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
            {errors.tags && <p className="text-error text-sm">{errors.tags.message}</p>}
          </div>

          {/* Test Cases */}
          <div className="card bg-base-200 p-4 shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold flex items-center gap-2"><CheckCircle2 className="w-5 h-5" /> Test Cases</h3>
              <button type="button" className="btn btn-primary btn-sm" onClick={() => appendTestcase({ input: "", output: "" })}>Add Test Case</button>
            </div>
            <div className="space-y-4">
              {testcaseFields.map((field, index) => (
                <div key={field.id} className="card bg-base-100 p-4 shadow-xs">
                  <div className="flex justify-between items-center mb-3">
                    <h4 className="font-medium">Test Case #{index + 1}</h4>
                    <button type="button" className="btn btn-ghost btn-sm text-error" onClick={() => removeTestcase(index)}>Remove</button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="form-control">
                      <label className="label">Input</label>
                      <textarea className="textarea textarea-bordered min-h-20" {...register(`testcases.${index}.input`)} />
                      {errors.testcases?.[index]?.input && (
                        <p className="text-error text-sm">{errors.testcases[index].input.message}</p>
                      )}
                    </div>
                    <div className="form-control">
                      <label className="label">Output</label>
                      <textarea className="textarea textarea-bordered min-h-20" {...register(`testcases.${index}.output`)} />
                      {errors.testcases?.[index]?.output && (
                        <p className="text-error text-sm">{errors.testcases[index].output.message}</p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Code Editor Sections */}
          {["PYTHON", "JAVA", "JAVASCRIPT"].map((lang) => (
            <div key={lang} className="card bg-base-200 p-4 shadow-sm">
              <h3 className="font-semibold mb-4 flex items-center gap-2"><Code2 className="w-5 h-5" /> {lang}</h3>
              
              <div className="form-control">
                <label className="label">Starter Code</label>
                <Controller
                  name={`codeSnippets.${lang}`}
                  control={control}
                  render={({ field }) => (
                    <Editor
                      height="200px"
                      language={lang.toLowerCase()}
                      theme="vs-dark"
                      value={field.value}
                      onChange={field.onChange}
                      options={{ minimap: { enabled: false }, fontSize: 14 }}
                    />
                  )}
                />
              </div>

              <div className="form-control mt-4">
                <label className="label">Reference Solution</label>
                <Controller
                  name={`referenceSolutions.${lang}`}
                  control={control}
                  render={({ field }) => (
                    <Editor
                      height="200px"
                      language={lang.toLowerCase()}
                      theme="vs-dark"
                      value={field.value}
                      onChange={field.onChange}
                      options={{ minimap: { enabled: false }, fontSize: 14 }}
                    />
                  )}
                />
              </div>
            </div>
          ))}

          {/* Additional Info */}
          <div className="card bg-base-200 p-4 shadow-sm">
            <h3 className="font-semibold mb-4 flex items-center gap-2"><Lightbulb className="w-5 h-5" /> Additional Info</h3>
            <textarea className="textarea textarea-bordered min-h-20" placeholder="Constraints" {...register("constraints")} />
            <textarea className="textarea textarea-bordered min-h-20 mt-4" placeholder="Hints" {...register("hints")} />
            <textarea className="textarea textarea-bordered min-h-32 mt-4" placeholder="Editorial" {...register("editorial")} />
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 mt-6">
            <button type="button" className="btn btn-ghost" onClick={onClose} disabled={isLoading}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={isLoading}>
              {isLoading ? <span className="loading loading-spinner" /> : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProblemModal;
