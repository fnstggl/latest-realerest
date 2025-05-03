import { Suspense, lazy } from "react";
import { Toaster } from "@/components/ui/sonner";
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

// New guide pages
const Guide = lazy(() => import("./pages/Guide"));
const GuideBuying = lazy(() => import("./pages/GuideBuying"));
const GuideSelling = lazy(() => import("./pages/GuideSelling"));
const GuideWholesale = lazy(() => import("./pages/GuideWholesale"));

// Updated loading fallback to use our standardized component
const LoadingFallback = () => <LoadingSpinner fullScreen />;

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster 
        position="bottom-right"
        expand={false}
        visibleToasts={1}
        closeButton
      />
      <Suspense fallback={<LoadingFallback />}>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/search" element={<Search />} />
          <Route path="/signin" element={<SignIn />} />
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
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/guide" element={<Guide />} />
          <Route path="/guide/buying" element={<GuideBuying />} />
          <Route path="/guide/selling" element={<GuideSelling />} />
          <Route path="/guide/wholesale" element={<GuideWholesale />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:id" element={<BlogPost />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/cookies" element={<Cookies />} />
          <Route path="/careers" element={<Careers />} />
          <Route path="/property/:id" element={<PropertyDetail />} />
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
          <Route path="/seller/:sellerId" element={<SellerProfile />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
