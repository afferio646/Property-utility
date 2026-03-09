"use client";

import { useState } from "react";
import { useDemo } from "@/contexts/DemoContext";
import Link from "next/link";
import { FaPlus, FaBuilding } from "react-icons/fa";

export default function Home() {
  const { properties, addProperty, userRole } = useDemo();
  const [newPropName, setNewPropName] = useState("");
  const [newPropAddress, setNewPropAddress] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);

  const handleAddProperty = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPropName.trim()) {
      addProperty(newPropName, newPropAddress);
      setNewPropName("");
      setNewPropAddress("");
      setShowAddForm(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 pb-20">
      <header className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Properties</h1>
          <p className="text-sm text-gray-500">Role: <span className="capitalize">{userRole}</span></p>
        </div>
        {userRole === "manager" && (
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 transition"
          >
            <FaPlus />
          </button>
        )}
      </header>

      {showAddForm && userRole === "manager" && (
        <form onSubmit={handleAddProperty} className="mb-8 bg-white p-4 rounded-xl shadow-sm border border-gray-200">
          <h2 className="text-lg font-semibold mb-4">Add New Property</h2>
          <div className="space-y-3">
            <input
              type="text"
              placeholder="Property Name (e.g., 123 Main St)"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              value={newPropName}
              onChange={(e) => setNewPropName(e.target.value)}
              required
            />
            <input
              type="text"
              placeholder="Address (Optional)"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              value={newPropAddress}
              onChange={(e) => setNewPropAddress(e.target.value)}
            />
            <div className="flex gap-2 justify-end">
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Save
              </button>
            </div>
          </div>
        </form>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {properties.map((prop) => (
          <Link href={`/properties/${prop.id}`} key={prop.id}>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 cursor-pointer hover:border-blue-500 hover:shadow-md transition group">
              <div className="flex items-start gap-4">
                <div className="bg-blue-100 p-3 rounded-lg text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition">
                  <FaBuilding size={24} />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 line-clamp-1">{prop.name}</h2>
                  {prop.address && (
                    <p className="text-sm text-gray-500 line-clamp-1 mt-1">{prop.address}</p>
                  )}
                  <p className="text-xs text-blue-600 mt-3 font-medium">Tap to view trades &rarr;</p>
                </div>
              </div>
            </div>
          </Link>
        ))}

        {properties.length === 0 && (
          <div className="col-span-full text-center py-12 bg-white rounded-xl border border-dashed border-gray-300">
            <p className="text-gray-500">No properties found.</p>
            {userRole === "manager" && (
              <button
                onClick={() => setShowAddForm(true)}
                className="mt-2 text-blue-600 font-medium hover:underline"
              >
                Add your first property
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
