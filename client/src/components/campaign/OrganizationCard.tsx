// import { Card } from "@/components/ui/card";
// export default function OrganizationCard({ organization }) {
//   const { fullName, bio, website, profileImage } = organization;

// return (
//   <div className="border rounded-lg p-4 bg-white shadow-md flex flex-col items-center">
//     <img
//       src={profileImage }
//       alt={fullName}
//       className="w-24 h-24 rounded-full object-cover mb-4"
//     />
//     <h2 className="text-xl font-semibold mb-2">{fullName}</h2>
//     <p className="text-gray-600 mb-4">{bio}</p>
//     {website && (
//       <a
//         href={website}
//         target="_blank"
//         rel="noopener noreferrer"
//         className="text-blue-500 hover:underline"
//       >
//         Visit Website
//       </a>
//     )}
//   </div>
// );
// }




import { useLocation } from "wouter";
import { Card } from "@/components/ui/card";

export default function OrganizationCard({ organization }) {
  const { id, fullName, bio, website, profileImage } = organization;
  const [, navigate] = useLocation();

  return (
    <div
      className="border rounded-lg p-4 bg-white shadow-md flex flex-col items-center cursor-pointer hover:shadow-lg transition"
      onClick={() => navigate(`/organization-page/${id}`)}
      role="button"
      tabIndex={0}
      onKeyPress={e => { if (e.key === "Enter") navigate(`/organization-page/${id}`); }}
    >
      <img
        src={profileImage}
        alt={fullName}
        className="w-24 h-24 rounded-full object-cover mb-4"
      />
      <h2 className="text-xl font-semibold mb-2">{fullName}</h2>
      <p className="text-gray-600 mb-4">{bio}</p>
      {website && (
        <a
          href={website}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-500 hover:underline"
          onClick={e => e.stopPropagation()}
        >
          Visit Website
        </a>
      )}
    </div>
  );
}