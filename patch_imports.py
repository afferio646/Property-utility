import re

with open("src/app/properties/[id]/trades/[tradeId]/page.tsx", "r") as f:
    content = f.read()

# Add editNote to the destructuring from useDemo()
content = content.replace(
"""    addNote,
    toggleNote,
    deleteNote,
    userRole
  } = useDemo();""",
"""    addNote,
    toggleNote,
    deleteNote,
    editNote,
    userRole
  } = useDemo();"""
)

with open("src/app/properties/[id]/trades/[tradeId]/page.tsx", "w") as f:
    f.write(content)
