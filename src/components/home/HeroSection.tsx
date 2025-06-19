import { useLanguage } from "@/contexts/LanguageContext";
import HomeSearchForm from "./HomeSearchForm";

const HeroSection = () => {
  const { t } = useLanguage();

  return (
    <section className="relative bg-[url('https://images.unsplash.com/photo-1560184897-ae75f418493e?ixlib=rb-4.0.3')] bg-cover bg-center py-20 md:py-32">
      <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/40" />
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 animate-fade-in">
            {t("hero.title")}
          </h1>
          <p className="text-xl md:text-2xl mb-12 opacity-90 animate-fade-in text-gray-200">
            {t("hero.subtitle")}
          </p>
          <HomeSearchForm />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
