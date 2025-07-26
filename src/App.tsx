import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { MessageCircle } from "lucide-react";
import IPhoneFrame from "@/components/ui/iphone-frame";
import { useMobileDetection } from "@/hooks/useMobileDetection";
import Home from "./pages/Home";
import Chat from "./pages/Chat";
import Calendar from "./pages/Calendar";
import Discover from "./pages/Discover";
import GetStarted from "./pages/GetStarted";
import SpinPage from "./pages/SpinPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const FloatingChatButton = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Don't show chat button on the spin page or get started page
  if (location.pathname === '/spin' || location.pathname === '/') {
    return null;
  }
  
  return (
    <Button
      onClick={() => navigate('/chat')}
      size="icon"
      className="absolute bottom-20 right-6 z-[9999] h-12 w-12 rounded-full bg-primary hover:bg-primary/90 shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
    >
      <MessageCircle className="h-5 w-5 text-primary-foreground" />
    </Button>
  );
};

const AppContent = () => (
  <div className="relative h-full w-full">
    <Routes>
      <Route path="/" element={<GetStarted />} />
      <Route path="/home" element={<Home />} />
      <Route path="/chat" element={<Chat />} />
      <Route path="/spin" element={<SpinPage />} />
      <Route path="/discover" element={<Discover />} />
      <Route path="/calendar" element={<Calendar />} />
      {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
      <Route path="*" element={<NotFound />} />
    </Routes>
    {/* <FloatingChatButton /> */}
  </div>
);

const App = () => {
  const { isMobile, isChecking } = useMobileDetection();

  // Show a brief loading state while detecting device type
  if (isChecking) {
    return (
      <div className="w-full h-screen bg-white flex items-center justify-center">
        <div className="text-lg text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          {isMobile ? (
            // On mobile devices, render content directly without iPhone frame
            <div className="w-full h-screen bg-white overflow-hidden mobile-native">
              <AppContent />
            </div>
          ) : (
            // On desktop/tablet, use iPhone frame for mobile simulation
            <IPhoneFrame>
              <AppContent />
            </IPhoneFrame>
          )}
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
