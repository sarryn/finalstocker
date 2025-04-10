import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import Dashboard from "@/pages/Dashboard";
import Inventory from "@/pages/Inventory";
import Scanner from "@/pages/Scanner";
import Suppliers from "@/pages/Suppliers";
import Locations from "@/pages/Locations";
import Taxes from "@/pages/Taxes";
import PriceManagement from "@/pages/PriceManagement";
import PaymentTracker from "@/pages/PaymentTracker";
import Settings from "@/pages/Settings";
import MainLayout from "@/components/layouts/MainLayout";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Dashboard} />
      <Route path="/dashboard" component={Dashboard} />
      <Route path="/inventory" component={Inventory} />
      <Route path="/scanner" component={Scanner} />
      <Route path="/suppliers" component={Suppliers} />
      <Route path="/locations" component={Locations} />
      <Route path="/taxes" component={Taxes} />
      <Route path="/price-management" component={PriceManagement} />
      <Route path="/payment-tracker" component={PaymentTracker} />
      <Route path="/settings" component={Settings} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <MainLayout>
        <Router />
      </MainLayout>
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;
