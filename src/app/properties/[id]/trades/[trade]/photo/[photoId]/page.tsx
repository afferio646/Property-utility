"use client";

import { useDemo, PhotoStatus } from "@/contexts/DemoContext";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { FaArrowLeft, FaCheck, FaTimes, FaRegSquare, FaCheckSquare, FaPlus } from "react-icons/fa";

export default function PhotoDetail() {
  const { id: propertyId, trade, photoId } = useParams() as { id: string; trade: string; photoId: string };
  const { photos, addNote, toggleNote, deleteNote, updatePhotoStatus } = useDemo();
  const router = useRouter();

  const [newNoteText, setNewNoteText] = useState("");
  const [isEditingStatus, setIsEditingStatus] = useState(false);

  const photo = photos.find((p) => p.id === photoId);

  if (!photo) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white">
        <p className="mb-4 text-xl">Photo not found</p>
        <button onClick={() => router.back()} className="text-blue-400 underline">Go Back</button>
      </div>
    );
  }

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (newNoteText.trim()) {
      addNote(photoId, newNoteText);
      setNewNoteText("");
    }
  };

  const statusOptions: PhotoStatus[] = ["Work to be Done", "Work Started", "Work Completed"];

  return (
    <div className="min-h-screen bg-gray-900 text-white pb-20 flex flex-col">
      <header className="p-4 bg-black/60 backdrop-blur-md sticky top-0 z-20 flex justify-between items-center border-b border-gray-800">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.push(`/properties/${propertyId}/trades/${trade}`)}
            className="p-2 text-gray-300 hover:text-white hover:bg-gray-800 rounded-full transition"
          >
            <FaArrowLeft />
          </button>
          <span className="font-medium text-lg capitalize">{trade} Photo</span>
        </div>

        {/* Status Badge Toggle */}
        <div className="relative">
           <button
             onClick={() => setIsEditingStatus(!isEditingStatus)}
             className={`px-3 py-1.5 rounded-full text-sm font-semibold border-2 transition ${
               photo.status === "Work Completed"
                 ? "bg-green-900/40 text-green-400 border-green-500"
                 : photo.status === "Work Started"
                 ? "bg-orange-900/40 text-orange-400 border-orange-500"
                 : "bg-red-900/40 text-red-400 border-red-500"
             }`}
           >
             {photo.status}
           </button>

           {isEditingStatus && (
             <div className="absolute top-12 right-0 bg-gray-800 border border-gray-700 rounded-xl shadow-2xl p-2 w-48 z-30">
               {statusOptions.map(s => (
                 <button
                   key={s}
                   onClick={() => {
                     updatePhotoStatus(photoId, s);
                     setIsEditingStatus(false);
                   }}
                   className={`w-full text-left px-3 py-2 rounded-lg text-sm mb-1 last:mb-0 transition ${
                     photo.status === s ? "bg-blue-600/20 text-blue-400 font-bold" : "text-gray-300 hover:bg-gray-700"
                   }`}
                 >
                   {s}
                 </button>
               ))}
             </div>
           )}
        </div>
      </header>

      {/* Image Area */}
      <div className="flex-1 w-full bg-black flex items-center justify-center p-2">
         {/* eslint-disable-next-line @next/next/no-img-element */}
         <img
           src={photo.url}
           alt="Work detail"
           className="max-w-full max-h-[45vh] object-contain rounded-lg shadow-2xl"
         />
      </div>

      {/* Intelligent Notes Engine */}
      <div className="bg-gray-900 p-4 border-t border-gray-800 flex-1 rounded-t-3xl -mt-4 relative z-10 shadow-[0_-10px_40px_rgba(0,0,0,0.5)]">
        <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
          Notes & Tasks
          <span className="bg-blue-600 text-xs px-2 py-0.5 rounded-full text-white">
            {photo.notes.length}
          </span>
        </h3>

        {/* Note Form */}
        <form onSubmit={handleAddNote} className="mb-6 flex gap-2">
          <input
            type="text"
            placeholder="Add a new task or note..."
            className="flex-1 bg-gray-800 border border-gray-700 text-white p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-500"
            value={newNoteText}
            onChange={(e) => setNewNoteText(e.target.value)}
          />
          <button
            type="submit"
            disabled={!newNoteText.trim()}
            className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white p-3 rounded-xl transition flex items-center justify-center w-12"
          >
            <FaPlus />
          </button>
        </form>

        {/* Notes List */}
        <div className="space-y-3">
          {photo.notes.length === 0 ? (
            <p className="text-gray-500 text-center py-6 text-sm italic">
              No notes added yet. Add tasks above.
            </p>
          ) : (
            photo.notes.map((note) => (
              <div
                key={note.id}
                className={`flex items-start gap-3 p-4 rounded-xl transition ${
                  note.completed ? "bg-green-900/10 border border-green-900/30" : "bg-gray-800 border border-gray-700"
                }`}
              >
                <button
                  onClick={() => toggleNote(photoId, note.id)}
                  className={`mt-0.5 text-xl transition ${
                    note.completed ? "text-green-500 hover:text-green-400" : "text-gray-400 hover:text-white"
                  }`}
                >
                  {note.completed ? <FaCheckSquare /> : <FaRegSquare />}
                </button>

                <div className="flex-1">
                  <p className={`text-base leading-snug ${note.completed ? "text-gray-400 line-through" : "text-white"}`}>
                    <span className="mr-2 text-blue-500 font-bold">•</span>
                    {note.text}
                  </p>

                  {note.completed && note.completedDate && (
                    <p className="text-xs text-green-500 mt-1.5 flex items-center gap-1 font-mono">
                      <FaCheck size={10} /> Completed: {new Date(note.completedDate).toLocaleString(undefined, {
                        month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
                      })}
                    </p>
                  )}
                </div>

                <button
                  onClick={() => deleteNote(photoId, note.id)}
                  className="text-gray-600 hover:text-red-400 p-1 transition opacity-50 hover:opacity-100"
                >
                  <FaTimes size={14} />
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
