import re

with open("src/contexts/DemoContext.tsx", "r") as f:
    content = f.read()

# The first patch for addNote didn't work because we had already changed the string format slightly in the file,
# or my regex didn't match. Let's fix addNote specifically.

# Let's read the file again
with open("src/contexts/DemoContext.tsx", "r") as f:
    content = f.read()

content = content.replace(
"""    const newNote: Note = {
      id: Date.now().toString(),
      text,
      completed: false,""",
"""    const newNote: Note = {
      id: Date.now().toString(),
      text,
      createdAt: new Date().toISOString(),
      completed: false,""")

with open("src/contexts/DemoContext.tsx", "w") as f:
    f.write(content)
