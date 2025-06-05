import React, { useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import SignupPage from "./components/auth/SignupPage";
import LoginPage from "./components/auth/LoginPage";
import HomePage from "./components/HomePage";
import { useAuthStore } from "./store/useAuthStore";
import { Loader } from "lucide-react";
import Layout from "./layout/Layout";
import AddProblem from "./components/admin/AddProblem";
import AdminRoute from "./components/admin/AdminRoute";
import ForgotPasswordPage from "./components/auth/ForgotPasswordPage";
import VerifyCodePage from "./components/auth/VerifyCodePage";
import ProblemPage from "./components/problemSolvingPage/ProblemPage";
import CodeSagaLanding from "./components/CodeSagaLanding ";
import AllProblemsPage from "./components/AllProblemsPage";
import ReportTable from "./components/admin/ReportTable";
import Profile from "./components/Profile";
import MyPlaylists from "./components/MyPlaylists";
import StorePage from "./components/StorePage";
import BreakZone from "./components/BreakZone/BreakZone";
import GuessTheOutput from "./components/BreakZone/CodingGames/GuessTheOutput";
import RegexRush from "./components/BreakZone/CodingGames/RegexRush";
import SpeedTypingTest from "./components/BreakZone/CodingGames/SpeedTypingTest";
import BugHunt from "./components/BreakZone/CodingGames/BugHunt";
import BinaryClicker from "./components/BreakZone/CodingGames/BinaryClicker ";
import ShortcutNinja from "./components/BreakZone/CodingGames/ShortcutNinja";
import EmojiPictionary from "./components/BreakZone/CodingGames/EmojiPictionary";
import RopeBurning from "./components/BreakZone/BrainTeasers/RopeBurning";
import RiverCrossing from "./components/BreakZone/BrainTeasers/RiverCrossing";
import DevLogComponent from "./components/DevLog/DevLogComponent";


const App = () => {
  const { authUser, checkAuth, isCheckingAuth } = useAuthStore();
    
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);


  if (isCheckingAuth && !authUser) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="size-10 animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-start">
      <Routes>
        {/* Public routes */}
        <Route path="/" element={authUser ? <Navigate to="/home" /> : <CodeSagaLanding />} />
        <Route path="/login" element={!authUser ? <LoginPage /> : <Navigate to="/home" />} />
        <Route path="/signup" element={!authUser ? <SignupPage /> : <Navigate to="/home" />} />
        <Route path="/forgot-password" element={!authUser ? <ForgotPasswordPage /> : <Navigate to="/home" />} />
        <Route path="/verify-otp/:email" element={!authUser ? <VerifyCodePage /> : <Navigate to="/home" />} />

        {/* Authenticated routes with Layout */}
        <Route element={<Layout />}>
        <Route path="break-zone" element={<BreakZone/>}/>
        <Route path="/games/bug-hunt" element={<BugHunt/>}/>
        <Route path="/games/guess-output" element={<GuessTheOutput/>}/>
        <Route path="/games/regex-rush" element={<RegexRush/>}/>
        <Route path="/games/typing-test" element={<SpeedTypingTest/>}/>
        <Route path="/games/binary-clicker" element={<BinaryClicker/>}/>
        <Route path="/games/shortcut-ninja" element={<ShortcutNinja/>}/>
        <Route path="/games/emoji-pictionary" element={<EmojiPictionary/>}/>
        <Route path="/puzzles/rope-burning" element={<RopeBurning/>}/>
        <Route path="/puzzles/river-crossing" element={<RiverCrossing/>}/>

        <Route path="/dev-log" element={<DevLogComponent/>}/>
          
          <Route path="/home" element={authUser ? <HomePage /> : <Navigate to="/login" />} />
          <Route path="/store" element={authUser ? <StorePage /> : <Navigate to="/login" />} />
          <Route path="/profile" element={authUser ? <Profile /> : <Navigate to="/login" />} />
          <Route path="/my-playlists" element={authUser ? <MyPlaylists /> : <Navigate to="/login" />} />
          <Route path="/problems" element={authUser ? <AllProblemsPage /> : <Navigate to="/login" />} />
          <Route path="/problem/:id" element={authUser ? <ProblemPage /> : <Navigate to="/login" />} />
          <Route path="/reports" element={authUser ? <ReportTable /> : <Navigate to="/login" />} />

          {/* Admin protected routes */}
          <Route element={<AdminRoute />}>
            <Route path="/add-problem" element={<AddProblem />} />
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </div>
  );
}

export default App