// about-page.tsx
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Eye, Cpu, Gem } from "lucide-react";
import { useLanguage } from "@/hooks/use-language";




export default function AboutPage() {
  const { t } = useLanguage();
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      <main className="flex-grow bg-white py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-24 pt-24 ">
          {/* Giới thiệu chung */}
          <section className="text-center">
            <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-6xl">
            {t("about.tilte")}
            </h1>
            <p className="mt-6 text-lg text-gray-600 max-w-3xl mx-auto">
            {t("about.des")}
            </p>
          </section>

          {/* Tầm nhìn */}
          <section className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="bg-gray-50 p-6 rounded-2xl shadow">
            <Eye className="h-10 w-10 text-primary mx-auto mb-4" />

              <h3 className="text-xl font-semibold text-gray-800">{t("about.tilte1")}</h3>
              <p className="mt-4 text-gray-600">
              {t("about.des1")}
              </p>
            </div>
            <div className="bg-gray-50 p-6 rounded-2xl shadow">
            <Cpu className="h-10 w-10 text-primary mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-800">{t("about.tilte2")}</h3>
              <p className="mt-4 text-gray-600">
              {t("about.des2")}
              </p>
            </div>
            <div className="bg-gray-50 p-6 rounded-2xl shadow">
            <Gem className="h-10 w-10 text-primary mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-800">{t("about.tilte3")}</h3>
              <p className="mt-4 text-gray-600">
              {t("about.des3")}
              </p>
            </div>
          </section>

          {/* Giải pháp minh bạch */}
          <section>
            <h2 className="text-3xl font-bold text-center text-gray-800">
            {t("about.tilte4")}
            </h2>
            <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                <h4 className="text-lg font-semibold text-gray-800">
                {t("about.tilte5")}
                </h4>
                <p className="mt-2 text-gray-600">
                {t("about.des4")}
                </p>
              </div>
              <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                <h4 className="text-lg font-semibold text-gray-800">
                {t("about.tilte7")}
                </h4>
                <p className="mt-2 text-gray-600">
                {t("about.des6")}
                </p>
              </div>
              <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                <h4 className="text-lg font-semibold text-gray-800">
                {t("about.tilte6")}
                </h4>
                <p className="mt-2 text-gray-600">
                {t("about.des5")}
                </p>
              </div>
              <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                <h4 className="text-lg font-semibold text-gray-800">
                {t("about.tilte8")}
                </h4>
                <p className="mt-2 text-gray-600">
                {t("about.des7")}
                </p>
              </div>
            </div>
          </section>

          {/* CTA */}
          <section className="text-center">
            <h3 className="text-2xl font-semibold text-gray-900">
            {t("about.des8")}
            </h3>
            <p className="mt-4 text-gray-600">
            {t("about.des9")}
            </p>
            <div className="mt-6">
              <a href="/auth">
                <Button size="lg" className="px-6 py-3 text-lg">
                {t("auth.signup")}
                </Button>
              </a>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
