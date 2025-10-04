import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./hooks/useAuth";
import Header from "./components/Layout/Header";
import Footer from "./components/Layout/Footer";
import HomePage from "./pages/HomePage";
import VolunteerPage from "./pages/VolunteerPage";
import DonatePage from "./pages/DonatePage";
import AboutPage from "./pages/AboutPage";
import NewsPage from "./pages/NewsPage";
import ContactPage from "./pages/ContactPage";
import DashboardPage from "./pages/DashboardPage";
import AuthPage from "./pages/AuthPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Public routes with header/footer */}
            <Route path="/" element={
              <div className="min-h-screen flex flex-col">
                <Header />
                <main className="flex-1">
                  <HomePage />
                </main>
                <Footer />
              </div>
            } />
            <Route path="/volunteer" element={
              <div className="min-h-screen flex flex-col">
                <Header />
                <main className="flex-1">
                  <VolunteerPage />
                </main>
                <Footer />
              </div>
            } />
            <Route path="/get-involved" element={
              <div className="min-h-screen flex flex-col">
                <Header />
                <main className="flex-1">
                  <VolunteerPage />
                </main>
                <Footer />
              </div>
            } />
            <Route path="/donate" element={
              <div className="min-h-screen flex flex-col">
                <Header />
                <main className="flex-1">
                  <DonatePage />
                </main>
                <Footer />
              </div>
            } />
            <Route path="/about" element={
              <div className="min-h-screen flex flex-col">
                <Header />
                <main className="flex-1">
                  <AboutPage />
                </main>
                <Footer />
              </div>
            } />
            <Route path="/news" element={
              <div className="min-h-screen flex flex-col">
                <Header />
                <main className="flex-1">
                  <NewsPage />
                </main>
                <Footer />
              </div>
            } />
            <Route path="/contact" element={
              <div className="min-h-screen flex flex-col">
                <Header />
                <main className="flex-1">
                  <ContactPage />
                </main>
                <Footer />
              </div>
            } />
            
            {/* Auth routes */}
            <Route path="/auth" element={<AuthPage />} />
            
            {/* Admin dashboard routes (no header/footer) */}
            <Route path="/dashboard/*" element={<DashboardPage />} />
            
            {/* 404 route */}
            <Route path="*" element={
              <div className="min-h-screen flex flex-col">
                <Header />
                <main className="flex-1">
                  <NotFound />
                </main>
                <Footer />
              </div>
            } />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
