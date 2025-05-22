import React, { useEffect } from "react";
import { Loader } from "lucide-react";
import { useProblemStore } from "../store/useProblemStore";
import ProblemTable from "./ProblemTable";

const AllProblemsPage = () => {
    const {getAllProblems, problems, isLoading} = useProblemStore();
      
    useEffect(() => {
        getAllProblems();
    }, [getAllProblems]);
    
if(isLoading) {
  return (
    <div className="flex items-center justify-center h-screen">
      <Loader className="size-10 animate-spin" />
    </div>
  )
} 

  return (
    <div>
        {
        problems.length > 0 ? <ProblemTable problems={problems}/> : (
          <p className="mt-10 text-center text-lg font-semibold text-gray-500 dark:text-gray-400 z-10 border
          border-primary px-4 py-2 rounded-md border-dashed"
          >No Problems Found</p>
        )
      }
    </div>
  )
}

export default AllProblemsPage