// "use client";

// import { useReadUserShares } from "@/hooks/read/useReadUserShares";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Loader2 } from "lucide-react";

// const UserSharesPage = () => {
//   const {
//     userSupplySharesAmountParsed,
//     userSupplySharesAmount,
//     sharesError,
//     sharesLoading,,
//     lendingPoolAddress,
//     usdcAddress,
//   } = useReadUserShares();

//   return (
//     <div className="max-w-xl mx-auto mt-10">
//       <Card>
//         <CardHeader>
//           <CardTitle>User Supply Shares Info</CardTitle>
//         </CardHeader>
//         <CardContent className="space-y-4">
//           {positionLoading ? (
//             <div className="flex items-center gap-2 text-blue-500">
//               <Loader2 className="animate-spin" size={20} />
//               Loading supply shares...
//             </div>
//           ) : positionError ? (
//             <div className="text-red-500">
//               Error: {String(positionError.message || positionError)}
//             </div>
//           ) : (
//             <>
//               <div>
//                 <strong>Supply Shares:</strong>{" "}
//                 {userSupplySharesAmount?.toString() ?? "N/A"}
//                 <p>{userSupplySharesAmountParsed}</p>
//               </div>
//               <div>
//                 <strong>Lending Pool Address:</strong>{" "}
//                 {lendingPoolAddress ?? "Unknown"}
//               </div>
//               <div>
//                 <strong>USDC Address:</strong>{" "}
//                 {usdcAddress ?? "Not available on this chain"}
//               </div>
//             </>
//           )}
//         </CardContent>
//       </Card>
//     </div>
//   );
// };

// export default UserSharesPage;
