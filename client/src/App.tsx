import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Redirect, Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import Webinar from "./pages/Webinar";
import Coaches from "./pages/Coaches";
import Programs from "./pages/Programs";
import AdminDashboard from "./pages/AdminDashboard";
import Corporate, { Contact, Privacy, Terms } from "./pages/StaticPages";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/webinar" component={Webinar} />
      <Route path="/coaches" component={Coaches} />
      <Route path="/coaches/:slug" component={Coaches} />
      <Route path="/instructors/:slug">{(params) => <Redirect to={`/coaches/${params.slug}`} />}</Route>
      <Route path="/instructors"><Redirect to="/coaches" /></Route>
      <Route path="/programs" component={Programs} />
      <Route path="/programs/:slug" component={Programs} />
      <Route path="/corporate" component={Corporate} />
      <Route path="/contact" component={Contact} />
      <Route path="/privacy" component={Privacy} />
      <Route path="/terms" component={Terms} />
      <Route path="/admin/instructors"><Redirect to="/admin/coaches" /></Route>
      <Route path="/admin" component={AdminDashboard} />
      <Route path="/admin/:section" component={AdminDashboard} />
      <Route path="/404" component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light" switchable>
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}
