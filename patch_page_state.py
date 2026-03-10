import re

with open("src/app/properties/[id]/trades/[tradeId]/page.tsx", "r") as f:
    content = f.read()

# Add FaPencilAlt to imports
content = content.replace("FaTrash,", "FaTrash,\n  FaPencilAlt,")

# Add editing state and handlers
editing_state_and_handlers = """
  // Track new note text per photo card
  const [newNotes, setNewNotes] = useState<{ [key: string]: string }>({});

  // Editing state: { photoId: string, noteId: string } or null
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [editingText, setEditingText] = useState("");

  const startEditing = (noteId: string, currentText: string) => {
    setEditingNoteId(noteId);
    setEditingText(currentText);
  };

  const cancelEditing = () => {
    setEditingNoteId(null);
    setEditingText("");
  };

  const saveEdit = (photoId: string, noteId: string) => {
    if (editingText.trim()) {
      editNote(photoId, noteId, editingText.trim());
    }
    cancelEditing();
  };

  const handleEditKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, photoId: string, noteId: string) => {
    if (e.key === 'Enter') {
      saveEdit(photoId, noteId);
    } else if (e.key === 'Escape') {
      cancelEditing();
    }
  };
"""

content = content.replace("  // Track new note text per photo card\n  const [newNotes, setNewNotes] = useState<{ [key: string]: string }>({});", editing_state_and_handlers)

with open("src/app/properties/[id]/trades/[tradeId]/page.tsx", "w") as f:
    f.write(content)
