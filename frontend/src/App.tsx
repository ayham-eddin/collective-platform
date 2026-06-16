import { SiteSettingsProvider } from "./components/SiteSettingsProvider";
import { LanguageProvider } from "./contexts/LanguageContext";
import { AppRouter } from "./routes/AppRouter";

const App = () => {
  return (
    <LanguageProvider>
      <SiteSettingsProvider>
        <AppRouter />
      </SiteSettingsProvider>
    </LanguageProvider>
  );
};

export default App;
