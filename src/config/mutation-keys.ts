export const mutationKeys = {
  ingredient: {
    add: ["ingredient", "add"],
    update: ["ingredient", "update"],
  },

  componentRecipe: {
    add: ["component-recipe", "add"],
    upsert: ["component-recipe", "upsert"],
    delete: ["component-recipe", "delete"],
  },

  menuItems: {
    add: ["menu-items", "add"],
    updateLayout: ["menu-item", "update-layout"],
    updateOptions: ["menu-item", "update-options"],
    addOption: ["menu-item", "add-option"],
    deleteOption: ["menu-item", "delete-option"],
    delete: ["menu-item", "delete"],
  },

  order: {
    add: ["order", "add"],
    update: ["order", "updated"],
  },

  product: {
    add: ["product", "add"],
    update: ["product", "update"],
    calculateCost: ["product", "calculate-cost"],
    newRecipe: ["product", "new-recipe"],
  },

  promotion: {
    add: ["promotion", "add"],
    update: ["promotion", "update"],
    apply: ["promotion", "apply"],
  },
};
