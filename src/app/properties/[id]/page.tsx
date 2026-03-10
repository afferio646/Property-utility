"use client";

import React, { useState } from "react";
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
  FaArrowLeft,
  FaPlus
} from "react-icons/fa";

interface TradeIconProps {
  type: TradeType;
  label: string;
  icon: React.ElementType;
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
  const { properties, photos, userRole, addCustomTrade } = useDemo();
  const router = useRouter();

  const [isAddingTrade, setIsAddingTrade] = useState(false);
  const [newTradeName, setNewTradeName] = useState("");

  const property = properties.find((p) => p.id === id);

  const handleAddTrade = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTradeName.trim()) {
      addCustomTrade(id, newTradeName.trim());
      setNewTradeName("");
      setIsAddingTrade(false);
    }
  };


  if (!property) {
    return (
      <div className="min-h-screen bg-black text-gray-200 flex flex-col items-center justify-center p-4">
        <h1 className="text-2xl font-bold mb-4 text-white">Property Not Found</h1>
        <button onClick={() => router.push("/")} className="text-blue-500 hover:text-blue-400 font-medium">
          &larr; Return to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0b101e] text-gray-200 font-sans">
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Navigation / Header */}
        <button
          onClick={() => router.push("/")}
          className="flex items-center gap-2 text-xs text-gray-400 hover:text-white transition-colors mb-6 font-bold tracking-widest uppercase"
        >
          <FaArrowLeft size={10} /> Back
        </button>

        <div className="mb-8 pb-8 border-b border-gray-800/50">
          <h1 className="text-xl font-bold text-white tracking-widest uppercase mb-2">{property.name}</h1>
          <p className="text-xs text-gray-500 uppercase tracking-widest">
            Select a trade to manage work
          </p>
        </div>

        {/* Trades Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 max-w-[1000px] justify-items-center sm:justify-items-start">
          {userRole === "manager" && (
            <div className="w-full max-w-[280px]">
              {isAddingTrade ? (
                <div className="p-4 rounded-xl bg-[#111827] border border-blue-500/50 h-32 flex flex-col justify-center">
                  <form onSubmit={handleAddTrade}>
                    <input
                      type="text"
                      autoFocus
                      placeholder="Trade Name..."
                      value={newTradeName}
                      onChange={(e) => setNewTradeName(e.target.value)}
                      className="w-full bg-[#1f2937] border border-gray-600 rounded p-2 text-white text-xs mb-2 outline-none focus:border-blue-500"
                    />
                    <div className="flex gap-2">
                      <button type="button" onClick={() => setIsAddingTrade(false)} className="text-[10px] text-gray-400 hover:text-white px-2 py-1 uppercase tracking-wider font-bold">Cancel</button>
                      <button type="submit" className="text-[10px] bg-blue-600 hover:bg-blue-500 text-white px-3 py-1 rounded font-bold uppercase tracking-wider">Add</button>
                    </div>
                  </form>
                </div>
              ) : (
                <button
                  onClick={() => setIsAddingTrade(true)}
                  className="w-full rounded-xl bg-[#121927] border border-dashed border-[#3b82f6]/60 hover:border-[#3b82f6] hover:bg-[#1a2333] transition-colors group flex flex-col items-center justify-center h-32"
                >
                  <div className="text-[#3b82f6] mb-3 group-hover:scale-110 transition-transform">
                    <FaPlus size={20} />
                  </div>
                  <span className="text-[11px] font-bold text-[#3b82f6] tracking-widest uppercase">ADD TRADE</span>
                </button>
              )}
            </div>
          )}

          {/* Standard Trades + Custom Trades */}
          {[...tradeConfig, ...(property?.customTrades || []).map(ct => ({ type: ct.type as TradeType, label: ct.label, icon: FaTools }))].map((trade) => {
            const Icon = trade.icon;

            const tradePhotos = photos.filter(p => p.propertyId === id && p.trade === trade.type);
            const hasPhotos = tradePhotos.length > 0;
            const allCompleted = hasPhotos && tradePhotos.every(p => p.status === 'Work Completed');

            const isActive = hasPhotos && !allCompleted;
            const isCompleted = allCompleted;

            let buttonStyles = "w-full rounded-xl flex flex-col items-center justify-center h-32 transition-all duration-200 relative overflow-hidden group-hover:-translate-y-1 group-hover:shadow-[0_10px_20px_rgba(0,0,0,0.3)]";
            let iconStyles = "mb-3 transition-transform group-hover:scale-110 z-10 relative";
            let textStyles = "text-[11px] font-bold tracking-widest uppercase z-10 relative";

            if (isCompleted) {
              buttonStyles += " bg-gradient-to-b from-green-400 to-green-600 shadow-[inset_0_1px_1px_rgba(255,255,255,0.4),0_4px_10px_rgba(34,197,94,0.3)] border border-green-500";
              iconStyles += " text-white drop-shadow-md";
              textStyles += " text-white drop-shadow-md";
            } else if (isActive) {
              buttonStyles += " bg-gradient-to-b from-[#4b5563] to-[#1f2937] shadow-[inset_0_1px_1px_rgba(255,255,255,0.2),0_4px_15px_rgba(0,0,0,0.5)] border-t border-t-[#6b7280] border-b border-b-black border-l border-l-[#4b5563] border-r border-r-[#4b5563]";
              iconStyles += " text-white drop-shadow-md";
              textStyles += " text-white drop-shadow-md";
            } else {
              buttonStyles += " bg-gradient-to-b from-white to-gray-100 shadow-[inset_0_1px_1px_rgba(255,255,255,0.8),0_4px_6px_rgba(0,0,0,0.1)] border border-gray-200 hover:shadow-[0_6px_12px_rgba(0,0,0,0.15)]";
              iconStyles += " text-[#4b5563]";
              textStyles += " text-[#1f2937]";
            }

            return (
              <Link
                href={`/properties/${id}/trades/${trade.type}`}
                key={trade.type}
                className="block group w-full max-w-[280px]"
              >
                <div className={buttonStyles}>
                  {/* Top gloss reflection for 3D effect */}
                  <div className="absolute top-0 left-0 right-0 h-1/3 bg-gradient-to-b from-white/30 to-transparent pointer-events-none rounded-t-xl opacity-70"></div>

                  <div className={iconStyles}>
                    <Icon size={22} />
                  </div>
                  <h2 className={textStyles}>{trade.label}</h2>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
