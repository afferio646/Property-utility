import re

with open("src/app/properties/[id]/trades/[tradeId]/page.tsx", "r") as f:
    content = f.read()

# Make sure FaPencilAlt is imported correctly.
if 'FaPencilAlt' not in content:
  content = content.replace("FaTrash,", "FaTrash,\n  FaPencilAlt,")

new_note_display = """
                            <div key={note.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-4 group/note p-1.5 hover:bg-gray-100 rounded transition-colors w-full">
                              <div className="flex items-start gap-3 flex-1 min-w-0">
                                <button
                                  onClick={() => toggleNote(photo.id, note.id)}
                                  className={`mt-0.5 flex-shrink-0 transition-colors drop-shadow-sm ${
                                    note.completed ? "text-green-500" : "text-gray-400 hover:text-blue-500"
                                  }`}
                                >
                                  {note.completed ? <FaCheckCircle size={16} /> : <FaRegCircle size={16} />}
                                </button>

                                {editingNoteId === note.id ? (
                                  <div className="flex-1 flex gap-2 w-full">
                                    <input
                                      type="text"
                                      autoFocus
                                      className="flex-1 bg-white border border-blue-400 text-gray-900 text-sm px-2 py-0.5 rounded shadow-[inset_0_2px_4px_rgba(0,0,0,0.05)] focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition w-full"
                                      value={editingText}
                                      onChange={(e) => setEditingText(e.target.value)}
                                      onKeyDown={(e) => handleEditKeyDown(e, photo.id, note.id)}
                                      onBlur={() => saveEdit(photo.id, note.id)}
                                    />
                                  </div>
                                ) : (
                                  <span
                                    className={`text-sm font-medium truncate flex-1 cursor-pointer ${note.completed ? "text-gray-400 line-through" : "text-gray-800 hover:text-blue-600 transition-colors"}`}
                                    onClick={() => startEditing(note.id, note.text)}
                                    title="Click to edit task"
                                  >
                                    {note.text}
                                  </span>
                                )}
                              </div>

                              <div className="flex items-center gap-2 self-end sm:self-auto shrink-0 pl-7 sm:pl-0">
                                <div className="text-[10px] text-gray-500 whitespace-nowrap flex flex-row gap-2">
                                  <span>Start: {formatDate(note.createdAt)}</span>
                                  {note.completed && note.completedDate && (
                                    <span>Completed: {formatDate(note.completedDate)}</span>
                                  )}
                                </div>
                                <div className="flex items-center gap-1 opacity-0 group-hover/note:opacity-100 transition-opacity">
                                  <button
                                    onClick={(e) => { e.stopPropagation(); startEditing(note.id, note.text); }}
                                    className="text-gray-300 hover:text-blue-500 p-1"
                                    title="Edit task"
                                  >
                                    <FaPencilAlt size={12} />
                                  </button>
                                  <button
                                    onClick={(e) => { e.stopPropagation(); deleteNote(photo.id, note.id); }}
                                    className="text-gray-300 hover:text-red-500 p-1"
                                    title="Delete task"
                                  >
                                    <FaTrash size={12} />
                                  </button>
                                </div>
                              </div>
                            </div>
"""

# Replace old display block
content = re.sub(
    r'<div key=\{note\.id\} className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-4 group/note p-1\.5 hover:bg-gray-100 rounded transition-colors w-full">.*?<button \n\s*onClick=\{\(\) => deleteNote\(photo\.id, note\.id\)\}\n\s*className="text-gray-300 hover:text-red-500 p-0\.5 opacity-0 group-hover/note:opacity-100 transition-opacity"\n\s*>\n\s*<FaTrash size=\{12\} />\n\s*</button>\n\s*</div>\n\s*</div>',
    new_note_display.strip(),
    content,
    flags=re.DOTALL
)

with open("src/app/properties/[id]/trades/[tradeId]/page.tsx", "w") as f:
    f.write(content)
