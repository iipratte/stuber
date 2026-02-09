import { useState } from "react";
import LoginView from "@/components/LoginView";
import ProfileView from "@/components/ProfileView";
import RidesView from "@/components/RidesView";
import PostRideView from "@/components/PostRideView";
import AppHeader from "@/components/AppHeader";

type View = "login" | "profile" | "rides" | "post";

const Index = () => {
  const [currentView, setCurrentView] = useState<View>("login");
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogin = () => {
    setIsLoggedIn(true);
    setCurrentView("profile");
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentView("login");
  };

  return (
    <div className="min-h-screen bg-background">
      <AppHeader
        currentView={currentView}
        onNavigate={setCurrentView}
        isLoggedIn={isLoggedIn}
        onLogout={handleLogout}
      />
      <main>
        {currentView === "login" && <LoginView onLogin={handleLogin} />}
        {currentView === "profile" && <ProfileView />}
        {currentView === "rides" && <RidesView />}
        {currentView === "post" && <PostRideView onComplete={() => setCurrentView("rides")} />}
      </main>
    </div>
  );
};

export default Index;
