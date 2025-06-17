import { useLanguage } from "@/contexts/LanguageContext";
import HomeSearchForm from "./HomeSearchForm";

const HeroSection = () => {
  const { t } = useLanguage();

  return (
    <section className="relative bg-gradient-to-r from-primary to-primary/80 text-white py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 animate-fade-in">
            {t("hero.title")}
          </h1>
          <p className="text-xl md:text-2xl mb-12 opacity-90 animate-fade-in">
            {t("hero.subtitle")}
          </p>
          <HomeSearchForm />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
