import { Suspense, lazy } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "@/components/ProtectedRoute";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

// Create a client with better error handling
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 30000,
      // Prevent automatic refetching on window focus which can cause unexpected refreshes
      refetchOnWindowFocus: false,
      refetchOnMount: true,
    },
  },
});

// Improved preloading strategy for common routes
// Preload essential routes immediately to avoid white screens
const Index = lazy(() => import("./pages/Index"));
const SignIn = lazy(() => {
  // Preload other auth-related pages when SignIn is loaded
  import("./pages/SignUp");
  return import("./pages/SignIn");
});
const SignUp = lazy(() => import("./pages/SignUp"));

// Other lazy-loaded components remain the same
const Search = lazy(() => import("./pages/Search"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const CreateListing = lazy(() => import("./pages/CreateListing"));
const NotFound = lazy(() => import("./pages/NotFound"));
const About = lazy(() => import("./pages/About"));
const Contact = lazy(() => import("./pages/Contact"));
const Blog = lazy(() => import("./pages/Blog"));
const BlogPost = lazy(() => import("./pages/BlogPost"));
const CreateBlog = lazy(() => import("./pages/CreateBlog"));
const FAQ = lazy(() => import("./pages/FAQ"));
const Terms = lazy(() => import("./pages/Terms"));
const Privacy = lazy(() => import("./pages/Privacy"));
const Cookies = lazy(() => import("./pages/Cookies"));
const Careers = lazy(() => import("./pages/Careers"));
const PropertyDetail = lazy(() => import("./pages/PropertyDetail"));
const PropertyEdit = lazy(() => import("./pages/PropertyEdit"));
const Messages = lazy(() => import("./pages/Messages"));
const Conversation = lazy(() => import("./pages/Conversation"));
const SellerProfile = lazy(() => import("./pages/SellerProfile"));

// Updated loading fallback to use our standardized component
const LoadingFallback = () => <LoadingSpinner fullScreen />;

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <Suspense fallback={<LoadingFallback />}>
        <Routes>
          <Route path="/signin" element={<SignIn />} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Index />
              </ProtectedRoute>
            }
          />
          <Route
            path="/search"
            element={
              <ProtectedRoute>
                <Search />
              </ProtectedRoute>
            }
          />
          <Route path="/signup" element={<SignUp />} />
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/sell/create" 
            element={
              <ProtectedRoute>
                <CreateListing />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/sell/create-blog" 
            element={
              <ProtectedRoute>
                <CreateBlog />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/messages" 
            element={
              <ProtectedRoute>
                <Messages />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/messages/:id" 
            element={
              <ProtectedRoute>
                <Conversation />
              </ProtectedRoute>
            } 
          />
          <Route
            path="/about"
            element={
              <ProtectedRoute>
                <About />
              </ProtectedRoute>
            }
          />
          <Route
            path="/contact"
            element={
              <ProtectedRoute>
                <Contact />
              </ProtectedRoute>
            }
          />
          <Route
            path="/blog"
            element={
              <ProtectedRoute>
                <Blog />
              </ProtectedRoute>
            }
          />
          <Route
            path="/blog/:id"
            element={
              <ProtectedRoute>
                <BlogPost />
              </ProtectedRoute>
            }
          />
          <Route
            path="/faq"
            element={
              <ProtectedRoute>
                <FAQ />
              </ProtectedRoute>
            }
          />
          <Route
            path="/terms"
            element={
              <ProtectedRoute>
                <Terms />
              </ProtectedRoute>
            }
          />
          <Route
            path="/privacy"
            element={
              <ProtectedRoute>
                <Privacy />
              </ProtectedRoute>
            }
          />
          <Route
            path="/cookies"
            element={
              <ProtectedRoute>
                <Cookies />
              </ProtectedRoute>
            }
          />
          <Route
            path="/careers"
            element={
              <ProtectedRoute>
                <Careers />
              </ProtectedRoute>
            }
          />
          <Route
            path="/property/:id"
            element={
              <ProtectedRoute>
                <PropertyDetail />
              </ProtectedRoute>
            }
          />
          <Route 
            path="/property/:id/edit" 
            element={
              <ProtectedRoute>
                <PropertyEdit />
              </ProtectedRoute>
            } 
          />
          {/* Redirect the /pricing route to the home page */}
          <Route path="/pricing" element={<Navigate to="/" replace />} />
          <Route
            path="/seller/:sellerId"
            element={
              <ProtectedRoute>
                <SellerProfile />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
