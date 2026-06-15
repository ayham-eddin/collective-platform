import { SiteSettingsProvider } from "./components/SiteSettingsProvider";
import { AppRouter } from "./routes/AppRouter";

const App = () => {
  return (
    <SiteSettingsProvider>
      <AppRouter />
    </SiteSettingsProvider>
  );
};

export default App;
