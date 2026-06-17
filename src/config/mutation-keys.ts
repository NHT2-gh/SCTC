export const mutationKeys = {
  ingredient: {
    add: ["ingredient", "add"],
  },

  componentRecipe: {
    add: ["component-recipe", "add"],
    upsert: ["component-recipe", "upsert"],
    delete: ["component-recipe", "delete"],
  },

  menuItems: {
    add: ["menu-items", "add"],
    initLayout: ["menu-items", "init-layout"],
    updateLayout: ["menu-item", "update-layout"],
  },

  order: {
    add: ["order", "add"],
  },
};
