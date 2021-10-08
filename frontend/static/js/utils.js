export const data = [
  {
    name: "Shoping list",
    created: new Date(2021, 3, 20),
    category: "Task",
    content: "Tomatos, bread",
    archived: false
  },
  {
    name: "The theory of evolution",
    created: new Date(2021, 3, 27),
    category: "Random Thought",
    content: "The evolution ...",
    archived: false
  },
  {
    name: "New Feature",
    created: new Date(2021, 4, 5),
    category: "Idea",
    content: "Implement new ...",
    archived: false,
    dates: [
      new Date(2021, 4, 3),
      new Date(2021, 4, 5)
    ]
  },
  {
    name: "Free Guy",
    created: new Date(2021, 4, 6),
    category: "Random Thought",
    content: "Watch the movie",
    archived: false
  },
  {
    name: "Workout plan",
    created: new Date(2021, 4, 7),
    category: "Task",
    content: "Create a new training program",
    archived: false
  },
  {
    name: "Meal plan",
    created: new Date(2021, 4, 8),
    category: "Task",
    content: "Create a new meal program",
    archived: false
  },
  {
    name: "Pass the test tasks",
    created: new Date(2021, 4, 10),
    category: "Task",
    content: "Need to do all tasks",
    archived: true
  },
]

export const getIconPathByCategory = (category) => {
  switch (category) {
    case "Task":
      return "https://img.icons8.com/external-kiranshastry-solid-kiranshastry/25/000000/external-shopping-cart-interface-kiranshastry-solid-kiranshastry.png";
    case "Random Thought":
      return "https://img.icons8.com/ios-filled/25/000000/development-skill.png";
    case "Idea":
      return "https://img.icons8.com/ios/25/000000/idea--v2.png";
  }
}

export const editIconPath = "https://img.icons8.com/ios-glyphs/20/000000/edit--v1.png";
export const archiveIconPath = "https://img.icons8.com/pastel-glyph/20/000000/archive--v4.png";
export const deleteIconPath = "https://img.icons8.com/ios-glyphs/20/000000/trash--v1.png";
export const restoreIconPath = "https://img.icons8.com/ios/20/000000/restore-page.png";
export const createdFormat = { month: 'long', day: 'numeric', year: 'numeric' };
export const datesFormat = { day: 'numeric', month: 'numeric', year: 'numeric' };