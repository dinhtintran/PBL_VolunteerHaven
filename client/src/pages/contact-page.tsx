import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Mail, MessageCircle, Phone } from "lucide-react";
import { useState } from "react";
import { useLanguage } from "@/hooks/use-language";

export default function ContactPage() {
  const { t } = useLanguage();
  const [form, setForm] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: handle sending logic here (e.g. API call)
    alert("Message sent!");
    setForm({ name: "", email: "", message: "" });
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      {/* Header */}
      <div className="bg-white py-12 pt-24">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl">{t("footer.contact")}</h1>
          <p className="mt-4 text-lg text-gray-600">
            {t("contact.subtitle")}
          </p>
        </div>
      </div>

      {/* Contact Form */}
      <div className="flex-grow bg-gray-50 py-12">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <form onSubmit={handleSubmit} className="space-y-6 bg-white p-8 shadow rounded-2xl">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t("contact.name")}
              </label>
              <Input name="name" value={form.name} onChange={handleChange} required />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t("contact.email") }
              </label>
              <Input type="email" name="email" value={form.email} onChange={handleChange} required />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t("contact.message") }
              </label>
              <Textarea
                name="message"
                rows={6}
                value={form.message}
                onChange={handleChange}
                required
              />
            </div>

            <div className="pt-4">
              <Button type="submit" size="lg" className="w-full">
                {t("contact.send")}
              </Button>
            </div>
          </form>
        </div>
      </div>

      {/* Contact Info (Optional) */}
      <div className="bg-white py-12">
        <div className="max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-8 text-center px-4">
          <div>
            <Mail className="mx-auto mb-2 text-primary" />
            <p className="font-semibold">Email</p>
            <p className="text-gray-600">support@givehope.org</p>
          </div>
          <div>
            <Phone className="mx-auto mb-2 text-primary" />
            <p className="font-semibold">{t("contact.phone")}</p>
            <p className="text-gray-600">+1 (123) 456-7890</p>
          </div>
          <div>
            <MessageCircle className="mx-auto mb-2 text-primary" />
            <p className="font-semibold">{t("contact.time")}</p>
            <p className="text-gray-600">{t("contact.time1")}</p>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
