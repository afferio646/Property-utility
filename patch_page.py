import re

with open("src/app/properties/[id]/trades/[tradeId]/page.tsx", "r") as f:
    content = f.read()

format_date_func = """
  // Format Date Helper
  const formatDate = (isoString: string | null) => {
    if (!isoString) return "";
    const date = new Date(isoString);
    return date.toLocaleDateString("en-US", {
      month: "numeric",
      day: "numeric",
      year: "2-digit"
    }) + " at " + date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true
    }).toLowerCase();
  };
"""

content = content.replace("  // Track new note text per photo card", format_date_func + "\n  // Track new note text per photo card")

note_display_replacement = """                            <div key={note.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-4 group/note p-1.5 hover:bg-gray-100 rounded transition-colors w-full">
                              <div className="flex items-start gap-3 flex-1 min-w-0">
                                <button
                                  onClick={() => toggleNote(photo.id, note.id)}
                                  className={`mt-0.5 flex-shrink-0 transition-colors drop-shadow-sm ${
                                    note.completed ? "text-green-500" : "text-gray-400 hover:text-blue-500"
                                  }`}
                                >
                                  {note.completed ? <FaCheckCircle size={16} /> : <FaRegCircle size={16} />}
                                </button>
                                <span className={`text-sm font-medium truncate ${note.completed ? "text-gray-400 line-through" : "text-gray-800"}`}>
                                  {note.text}
                                </span>
                              </div>

                              <div className="flex items-center gap-3 self-end sm:self-auto shrink-0 pl-7 sm:pl-0">
                                <div className="text-[10px] text-gray-500 whitespace-nowrap flex flex-row gap-2">
                                  <span>Start: {formatDate(note.createdAt)}</span>
                                  {note.completed && note.completedDate && (
                                    <span>Completed: {formatDate(note.completedDate)}</span>
                                  )}
                                </div>
                                <button
                                  onClick={() => deleteNote(photo.id, note.id)}
                                  className="text-gray-300 hover:text-red-500 p-0.5 opacity-0 group-hover/note:opacity-100 transition-opacity"
                                >
                                  <FaTrash size={12} />
                                </button>
                              </div>
                            </div>"""

# Find the checklist rendering part
old_note_display_pattern = r'<div key=\{note.id\} className="flex items-start gap-3 group/note p-1\.5 hover:bg-gray-100 rounded transition-colors">.*?</div>\s*</div>'

content = re.sub(
    r'<div key=\{note\.id\} className="flex items-start gap-3 group/note p-1\.5 hover:bg-gray-100 rounded transition-colors">.*?<button \n\s*onClick=\{\(\) => deleteNote\(photo\.id, note\.id\)\}\n\s*className="text-gray-300 hover:text-red-500 p-0\.5 ml-auto opacity-0 group-hover/note:opacity-100 transition-opacity"\n\s*>\n\s*<FaTrash size=\{12\} />\n\s*</button>\n\s*</div>',
    note_display_replacement,
    content,
    flags=re.DOTALL
)

with open("src/app/properties/[id]/trades/[tradeId]/page.tsx", "w") as f:
    f.write(content)
