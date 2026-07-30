import { Button } from "@/components/ui/button";
import { ProductRecipeVersion } from "@/types/product";
import { formatCurrency } from "@/utils/format-data";
import React from "react";

interface ListProductRecipesProps {
  recipes: ProductRecipeVersion[];
  onEditRecipe: (recipe: ProductRecipeVersion) => void;
  onDeleteRecipe: (recipe: ProductRecipeVersion) => void;
}

export default function ListProductRecipes({
  recipes,
  onEditRecipe,
  onDeleteRecipe,
}: ListProductRecipesProps) {
  return (
    <div className="space-y-3 ">
      {recipes.map((recipe) => (
        <div
          key={recipe.id}
          className="flex items-center justify-between p-2 rounded-lg bg-amber-50"
        >
          <div className="">
            <p>Version: {recipe.version_number}</p>
            <p className="text-sm">
              Ghi chú: {recipe.note ? recipe.note : "Không có ghi chú"}
            </p>

            <p>Cost: {formatCurrency(recipe.products.cost)}</p>
          </div>
          <div className="flex items-center gap-2 justify-end">
            <Button size="sm" onClick={() => onEditRecipe(recipe)}>
              Edit
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => onDeleteRecipe(recipe)}
            >
              Delete
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}
