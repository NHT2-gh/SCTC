import { Button } from "@/components/ui/button";
import { Radio } from "@/components/ui/input";
import { useUpsertProductRecipeVersion } from "@/hooks/queries/use-product";
import { mapErrorToMessage } from "@/lib/error/app-error";
import { showToast } from "@/lib/toast";
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
  const updateRecipe = useUpsertProductRecipeVersion();

  async function handleActivateRecipe(recipeId: string, productId: string) {
    try {
      await updateRecipe.mutateAsync({
        id: recipeId,
        is_active: true,
        product_id: productId,
      });
      showToast.success({ title: "Cập nhật công thức thành công" });
    } catch (e) {
      showToast.error({
        title: "Lỗi cập nhật công thức",
        description: mapErrorToMessage(e),
      });
    }
  }
  return (
    <div className="space-y-3 ">
      {recipes.map((recipe) => (
        <div key={recipe.id} className="flex gap-5 p-2 rounded-lg bg-amber-50">
          <Radio
            id={recipe.id}
            name="active-recipe"
            value={recipe.id}
            checked={recipe.is_active}
            onChange={(value) => {
              handleActivateRecipe(value, recipe.product_id);
            }}
          />
          <div className="grow">
            <p>Version: {recipe.version_number}</p>
            <p>Note: {recipe.note}</p>
            <p>Cost: {formatCurrency(recipe.cost)}</p>
          </div>
          <div className="flex self-center gap-2 justify-end">
            <Button onClick={() => onEditRecipe(recipe)}>Edit</Button>
            <Button variant="outline" onClick={() => onDeleteRecipe(recipe)}>
              Delete
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}
