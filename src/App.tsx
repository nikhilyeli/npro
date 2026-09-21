import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import SiteRoute from "./pages/SiteRoute";
import NotFound from "./pages/NotFound";
import { installDevTools } from "./lib/brand";

const queryClient = new QueryClient();

// Adds `npro.unlockThemes()` etc. to the browser DevTools console
installDevTools();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* /npro = default theme, /npro/<company> = that company's theme */}
          <Route path="/npro/:company?" element={<SiteRoute />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
