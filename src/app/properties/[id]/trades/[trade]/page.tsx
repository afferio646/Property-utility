"use client";

import { useDemo, PhotoStatus, TradeType } from "@/contexts/DemoContext";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { FaArrowLeft, FaCamera, FaCheck } from "react-icons/fa";

export default function TradePhotos() {
  const { id: propertyId, trade } = useParams() as { id: string; trade: TradeType };
  const { photos, properties, addPhoto, updatePhotoStatus } = useDemo();
  const router = useRouter();

  const [confirmStatusModal, setConfirmStatusModal] = useState<{
    isOpen: boolean;
    photoId: string | null;
  }>({ isOpen: false, photoId: null });

  const property = properties.find((p) => p.id === propertyId);
  const tradePhotos = photos.filter((p) => p.propertyId === propertyId && p.trade === trade);

  const currentWorkPhotos = tradePhotos.filter((p) => p.status !== "Work Completed");
  const completedWorkPhotos = tradePhotos.filter((p) => p.status === "Work Completed");

  const handleAddDemoPhoto = () => {
    // Generate a random placeholder image
    const randomId = Math.floor(Math.random() * 1000);
    const mockUrl = `https://placehold.co/400x400/eeeeee/666666/png?text=New+Photo+${randomId}`;
    addPhoto(propertyId, trade, mockUrl);
  };

  const attemptStatusChange = (photoId: string, currentStatus: PhotoStatus) => {
    if (currentStatus === "Work Completed") {
      // It's already completed, so moving it out doesn't require confirmation
      updatePhotoStatus(photoId, "Work to be Done"); // Or toggle to something else
    } else {
      // It's current work moving to completed
      setConfirmStatusModal({ isOpen: true, photoId });
    }
  };

  const confirmMoveToCompleted = () => {
    if (confirmStatusModal.photoId) {
      updatePhotoStatus(confirmStatusModal.photoId, "Work Completed");
      setConfirmStatusModal({ isOpen: false, photoId: null });
    }
  };

  if (!property) return null;

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <header className="bg-white p-4 shadow-sm flex items-center gap-4 sticky top-0 z-10 justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.push(`/properties/${propertyId}`)}
            className="p-2 text-gray-600 hover:bg-gray-100 rounded-full transition"
          >
            <FaArrowLeft />
          </button>
          <div>
            <h1 className="text-xl font-bold text-gray-900 capitalize">{trade}</h1>
            <p className="text-sm text-gray-500 line-clamp-1">{property.name}</p>
          </div>
        </div>
        <button
          onClick={handleAddDemoPhoto}
          className="bg-blue-600 text-white p-3 rounded-full shadow-md hover:bg-blue-700 transition flex items-center gap-2"
        >
          <FaCamera /> <span className="hidden sm:inline">Add Photo</span>
        </button>
      </header>

      <div className="p-4 space-y-8 mt-2">
        {/* Current Work Section */}
        <section>
          <h2 className="text-lg font-bold text-gray-800 mb-4 border-b-2 border-orange-400 pb-2 inline-block">
            Current Work ({currentWorkPhotos.length})
          </h2>
          {currentWorkPhotos.length === 0 ? (
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-6 text-center text-orange-600 shadow-inner">
              No current work photos.
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {currentWorkPhotos.map((photo) => (
                <div key={photo.id} className="relative rounded-xl overflow-hidden shadow-sm border-2 border-orange-400 bg-white cursor-pointer group hover:shadow-md transition">
                   <div
                     className="w-full aspect-square relative"
                     onClick={() => router.push(`/properties/${propertyId}/trades/${trade}/photo/${photo.id}`)}
                   >
                     {/* eslint-disable-next-line @next/next/no-img-element */}
                     <img src={photo.url} alt="Current work" className="w-full h-full object-cover group-hover:opacity-90 transition" />
                   </div>
                   <div className="p-2 flex justify-between items-center bg-white">
                      <span className="text-xs font-semibold text-orange-600">{photo.status}</span>
                      <button
                        onClick={(e) => { e.stopPropagation(); attemptStatusChange(photo.id, photo.status); }}
                        className="p-1.5 bg-green-100 text-green-700 rounded-full hover:bg-green-200 transition"
                        title="Mark as Completed"
                      >
                        <FaCheck size={12} />
                      </button>
                   </div>
                   {photo.notes.length > 0 && (
                     <div className="absolute top-2 left-2 bg-black/60 text-white text-[10px] px-2 py-1 rounded-full backdrop-blur-sm">
                       {photo.notes.length} note(s)
                     </div>
                   )}
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Completed Work Section */}
        <section>
          <h2 className="text-lg font-bold text-gray-800 mb-4 border-b-2 border-green-500 pb-2 inline-block">
            Completed Work ({completedWorkPhotos.length})
          </h2>
          {completedWorkPhotos.length === 0 ? (
            <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center text-green-700 shadow-inner">
              No completed work photos.
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {completedWorkPhotos.map((photo) => (
                <div key={photo.id} className="relative rounded-xl overflow-hidden shadow-sm border-2 border-green-500 bg-white cursor-pointer group hover:shadow-md transition opacity-80 hover:opacity-100">
                   <div
                     className="w-full aspect-square relative"
                     onClick={() => router.push(`/properties/${propertyId}/trades/${trade}/photo/${photo.id}`)}
                   >
                     {/* eslint-disable-next-line @next/next/no-img-element */}
                     <img src={photo.url} alt="Completed work" className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition duration-300" />
                   </div>
                   <div className="p-2 flex justify-between items-center bg-green-50">
                      <span className="text-xs font-semibold text-green-700">{photo.status}</span>
                      <button
                        onClick={(e) => { e.stopPropagation(); attemptStatusChange(photo.id, photo.status); }}
                        className="text-xs underline text-gray-500 hover:text-gray-800"
                      >
                        Undo
                      </button>
                   </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>

      {/* Confirmation Modal */}
      {confirmStatusModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white p-6 rounded-2xl shadow-xl max-w-sm w-full">
            <h3 className="text-xl font-bold text-gray-900 mb-2">Move to Completed?</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to move this work to Completed? This will lock its status visually.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setConfirmStatusModal({ isOpen: false, photoId: null })}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg font-medium transition"
              >
                No, cancel
              </button>
              <button
                onClick={confirmMoveToCompleted}
                className="px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition shadow-sm"
              >
                Yes, complete it
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
