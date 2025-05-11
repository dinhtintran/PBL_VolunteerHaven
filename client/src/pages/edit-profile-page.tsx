import { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/hooks/use-language";
import { useAuth } from "@/hooks/use-auth";

export default function EditProfilePage() {
  const { t } = useLanguage();
  const { user } = useAuth();

  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [bio, setBio] = useState(user?.bio || "");
  const [profileImage, setProfileImage] = useState(user?.profileImage || "");
  const [gender, setGender] = useState(user?.gender || "other");
  const [birthdate, setBirthdate] = useState(user?.birthdate || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [address, setAddress] = useState(user?.address || "");

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log({ name, email, bio, profileImage, gender, birthdate, phone, address });
    alert("Profile updated!");
  };

  if (!user) {
    return <div className="text-center p-10">{t("auth.requireLogin")}</div>;
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      <div className="w-full max-w-screen-xl mx-auto px-6 py-12 pt-24">
        <h1 className="text-3xl font-bold mb-10 text-center text-primary">
          {t("profile.editTitle")}
        </h1>

        {/* Ảnh đại diện */}
        <div className="flex justify-center mb-10">
          <div className="relative group">
            <img
              src={profileImage || `https://ui-avatars.com/api/?name=${name}&background=random`}
              alt="Ảnh đại diện"
              className="w-44 h-44 sm:w-48 sm:h-48 rounded-full border-4 border-primary shadow-xl object-cover transition duration-300 ease-in-out hover:scale-110"
            />
            <label className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-primary/90 text-white text-sm py-1.5 px-4 rounded-full cursor-pointer hover:bg-primary-dark shadow-md transition">
              Chọn ảnh
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </label>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white p-10 rounded-xl shadow-xl w-full">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Họ tên */}
            <div>
              <label className="block text-sm font-medium text-gray-700">{t("auth.fullname")}</label>
              <Input value={user?.fullName} onChange={(e) => setName(e.target.value)} required />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700">{t("auth.email")}</label>
              <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>

            {/* Giới tính */}
            <div>
              <label className="block text-sm font-medium text-gray-700">{t("auth.sex")}</label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-primary"
              >
                <option value="male">{t("auth.sexboy")}</option>
                <option value="female">{t("auth.sexgirl")}</option>
                <option value="other">{t("auth.sexother")}</option>
              </select>
            </div>

            {/* Ngày sinh */}
            <div>
              <label className="block text-sm font-medium text-gray-700">{t("auth.bday")}</label>
              <Input type="date" value={birthdate} onChange={(e) => setBirthdate(e.target.value)} />
            </div>

            {/* Số điện thoại */}
            <div>
              <label className="block text-sm font-medium text-gray-700">{t("auth.phone")}</label>
              <Input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} />
            </div>

            {/* Địa chỉ */}
            <div>
              <label className="block text-sm font-medium text-gray-700">{t("auth.address")}</label>
              <Input value={address} onChange={(e) => setAddress(e.target.value)} />
            </div>

            {/* Bio */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700">{t("auth.intro")}</label>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                rows={4}
                className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-primary"
      
              />
            </div>
          </div>

          {/* Nút lưu */}
          <div className="mt-10">
            <Button type="submit" className="w-full py-3 bg-primary hover:bg-primary-dark text-white rounded-lg">
              {t("button.save") }
            </Button>
          </div>
        </form>
      </div>

      <Footer />
    </div>
  );
}
