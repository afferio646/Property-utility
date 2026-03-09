"use client";

import { useDemo, TradeType } from "@/contexts/DemoContext";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  FaWrench,
  FaBolt,
  FaBorderAll,
  FaColumns,
  FaPaintRoller,
  FaBorderNone,
  FaDoorOpen,
  FaLayerGroup,
  FaTools,
  FaArrowLeft
} from "react-icons/fa";

interface TradeIconProps {
  type: TradeType;
  label: string;
  icon: React.ElementType;
  propertyId: string;
}

const tradeConfig: Omit<TradeIconProps, "propertyId">[] = [
  { type: "plumbing", label: "Plumbing", icon: FaWrench },
  { type: "electric", label: "Electric", icon: FaBolt },
  { type: "tile", label: "Tile", icon: FaBorderAll },
  { type: "cabinets", label: "Cabinets", icon: FaColumns },
  { type: "paint", label: "Paint", icon: FaPaintRoller },
  { type: "windows", label: "Windows", icon: FaBorderNone },
  { type: "doors", label: "Doors", icon: FaDoorOpen },
  { type: "floors", label: "Floors", icon: FaLayerGroup },
  { type: "misc", label: "Misc", icon: FaTools },
];

export default function PropertyTrades() {
  const { id } = useParams() as { id: string };
  const { properties } = useDemo();
  const router = useRouter();

  const property = properties.find((p) => p.id === id);

  if (!property) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <h1 className="text-xl font-bold mb-4">Property Not Found</h1>
        <button onClick={() => router.push("/")} className="text-blue-600 underline">
          Go Back Home
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <header className="bg-white p-4 shadow-sm flex items-center gap-4 sticky top-0 z-10">
        <button
          onClick={() => router.push("/")}
          className="p-2 text-gray-600 hover:bg-gray-100 rounded-full transition"
        >
          <FaArrowLeft />
        </button>
        <div>
          <h1 className="text-xl font-bold text-gray-900 line-clamp-1">{property.name}</h1>
          <p className="text-sm text-gray-500">Select a trade to manage work</p>
        </div>
      </header>

      <div className="p-4 mt-4">
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4">
          {tradeConfig.map((trade) => {
            const Icon = trade.icon;
            return (
              <Link
                href={`/properties/${id}/trades/${trade.type}`}
                key={trade.type}
              >
                <div className="flex flex-col items-center justify-center bg-white p-6 rounded-2xl shadow-sm border border-gray-100 cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition group h-full">
                  <div className="bg-blue-100 p-4 rounded-full text-blue-600 mb-3 group-hover:bg-blue-600 group-hover:text-white transition shadow-sm">
                    <Icon size={28} />
                  </div>
                  <span className="text-sm font-semibold text-gray-700 text-center">{trade.label}</span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
