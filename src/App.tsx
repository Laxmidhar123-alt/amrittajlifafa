import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { UserProvider } from "@/contexts/UserContext";
import HomePage from "./pages/HomePage";
import AuthPage from "./pages/AuthPage";
import TaskPage from "./pages/TaskPage";
import WithdrawPage from "./pages/WithdrawPage";
import DepositPage from "./pages/DepositPage";
import HistoryPage from "./pages/HistoryPage";
import WalletPage from "./pages/WalletPage";
import HelpPage from "./pages/HelpPage";
import TermsPage from "./pages/TermsPage";
import PayoutsPage from "./pages/PayoutsPage";
import CreateLifafaPage from "./pages/CreateLifafaPage";
import ClaimLifafaPage from "./pages/ClaimLifafaPage";
import AddTaskPage from "./pages/AddTaskPage";
import PostAdsPage from "./pages/PostAdsPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <UserProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/task" element={<TaskPage />} />
            <Route path="/withdraw" element={<WithdrawPage />} />
            <Route path="/deposit" element={<DepositPage />} />
            <Route path="/history" element={<HistoryPage />} />
            <Route path="/wallet" element={<WalletPage />} />
            <Route path="/help" element={<HelpPage />} />
            <Route path="/terms" element={<TermsPage />} />
            <Route path="/payouts" element={<PayoutsPage />} />
            <Route path="/create-lifafa" element={<CreateLifafaPage />} />
            <Route path="/claim-lifafa" element={<ClaimLifafaPage />} />
            <Route path="/add-task" element={<AddTaskPage />} />
            <Route path="/post-ads" element={<PostAdsPage />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </UserProvider>
  </QueryClientProvider>
);

export default App;