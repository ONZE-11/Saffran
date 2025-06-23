// "use client";

// import { useEffect, useState } from "react";
// import { useUser } from "@clerk/nextjs";

// export default function AdminDashboard() {
//   const [data, setData] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");
//   const { isLoaded, isSignedIn } = useUser();

//   useEffect(() => {
//     if (!isLoaded || !isSignedIn) return;

//     fetch("/api/admin")
//       .then((res) => {
//         if (!res.ok) throw new Error("Unauthorized or error fetching data");
//         return res.json();
//       })
//       .then((json) => {
//         setData(json);
//         setLoading(false);
//       })
//       .catch((e) => {
//         setError(e.message);
//         setLoading(false);
//       });
//   }, [isLoaded, isSignedIn]);

//   if (loading) return <div>Loading...</div>;
//   if (error) return <div>Error: {error}</div>;

//   return (
//     <div className="p-4">
//       <h1 className="text-2xl font-bold">Admin Panel</h1>
//       <pre>{JSON.stringify(data, null, 2)}</pre>
//     </div>
//   );
// }
