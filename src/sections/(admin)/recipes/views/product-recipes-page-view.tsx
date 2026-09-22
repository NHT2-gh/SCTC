"use client";
import { ComponentCard } from "@/components/common/component-card";
import { MainContainer } from "@/components/common/page-layout";
import { SearchBar } from "@/components/search-bar";
import { useEffect, useState } from "react";
import { useModal } from "@/hooks/useModal";
import {
  useUpsertProductRecipeVersion,
  useGetAllProduct,
  useGetProductRecipe,
} from "@/hooks/queries/use-product";
import { ProductType } from "@/types/product";
import { ListProductRecipes, ModalProductRecipeEdit } from "../components";
import { ProductRecipeVersion } from "@/types/product";
import { formatCurrency } from "@/utils/format-data";
import ModalAlert from "@/components/modal/alerts/modal-alert";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { showToast } from "@/lib/toast";
import { v4 } from "uuid";
import { AddProductPageView } from "../../products/views";

export default function ComponentsRecipesPageView() {
  const [searchText, setSearchText] = useState<string>();
  const [productSelected, setProductSelected] = useState<string | null>(null);
  const [idRecipeEdit, setIdRecipeEdit] = useState<ProductRecipeVersion | null>(
    null,
  );
  const modalEditRecipe = useModal();
  const modalAlertCreateRecipe = useModal();
  const upsertProductRecipeVersion = useUpsertProductRecipeVersion();
  const {
    data: products,
    error,
    isLoading,
  } = useGetAllProduct({
    searchText: searchText,
  });
  const {
    data: recipes,
    error: recipesError,
    isLoading: isLoadingRecipes,
    refetch: refetchRecipes,
  } = useGetProductRecipe(productSelected);

  const handleCreateNewRecipe = async () => {
    let versionNumber = 1;
    if (recipes?.data?.length) {
      versionNumber = recipes.data[recipes.data.length - 1].version_number + 1;
    }
    try {
      const result = await upsertProductRecipeVersion.mutateAsync({
        id: v4(),
        product_id: productSelected!,
        version_number: versionNumber,
        is_active: recipes?.data.length === 0 ? true : false,
      });
      if (result.success) {
        if (modalAlertCreateRecipe.isOpen) {
          modalAlertCreateRecipe.closeModal();
        }
        showToast.success({ title: "Thêm công thức thành công" });
      }
    } catch (error) {}
  };

  useEffect(() => {
    if (recipes && recipes.data && recipes.data.length === 0) {
      modalAlertCreateRecipe.openModal();
    }
  }, [recipes]);
  return (
    <MainContainer title="Công thức đồ uống">
      <ComponentCard title={"Tìm kiếm công thức đồ uống"}>
        <SearchBar
          handleKeyDown={(value) => {
            setSearchText(value);
          }}
          handleOnChange={(value) => {
            if (!value.trim()) setSearchText(undefined);
          }}
          placeholder="Nhập tên sản phẩm để tìm kiếm"
          className="max-w-full"
        />

        {searchText && (
          <div className="border absolute z-[10] bg-white top-[7.5rem] left-6 right-6 rounded-lg mt-3 h-fit max-h-[40vh] overflow-y-scroll">
            {products?.data && products?.data?.length > 0 ? (
              products?.data?.map((item) => (
                <article
                  key={item.id}
                  onClick={() => {
                    setProductSelected(item.id);
                    setSearchText(undefined);
                  }}
                  className="w-full flex justify-between gap-2 border-b p-3 last:border-none hover:bg-gray-100 transition-colors cursor-pointer"
                >
                  <div className="">
                    <h4 className="font-semibold text-sm">{item.name}</h4>
                    <p className="text-sm text-gray-700 line-clamp-1">
                      {item.description}
                    </p>

                    <p className="text-xs text-gray-500 mt-2 capitalize">
                      Phân loại: {ProductType[item.product_type]}
                    </p>
                  </div>
                  <p className="text-md text-right font-semibold text-nowrap">
                    Giá cost: {formatCurrency(item.cost)}
                  </p>
                </article>
              ))
            ) : (
              <article className="w-full border-b p-3 last:border-none hover:bg-gray-100 transition-colors cursor-pointer">
                {isLoading
                  ? "...Đang tải"
                  : error
                    ? "Lỗi tìm kiếm. Vui lòng thử lại"
                    : "Không tìm thấy dữ liệu"}
              </article>
            )}
          </div>
        )}
      </ComponentCard>

      {recipes && recipes.data[0] && recipes.data[0].products.name && (
        <ComponentCard
          className="space-y-3"
          title={`Công thức của ${recipes.data[0].products.name}`}
        >
          <div className="flex items-center gap-4">
            <Button onClick={() => modalAlertCreateRecipe.openModal()}>
              Add Recipe Version
            </Button>
            <Button variant="outline" onClick={() => refetchRecipes()}>
              <RefreshCw />
            </Button>
          </div>

          {recipes?.data.length > 0 ? (
            <ListProductRecipes
              recipes={recipes.data}
              onDeleteRecipe={(id) => {}}
              onEditRecipe={(recipe) => {
                setIdRecipeEdit(recipe);
                modalEditRecipe.openModal();
              }}
            />
          ) : (
            <article className="w-full border-b p-3 last:border-none hover:bg-gray-100 transition-colors cursor-pointer">
              {isLoadingRecipes
                ? "...Đang tải"
                : recipesError
                  ? "Lỗi tìm kiếm. Vui lòng thử lại"
                  : "Không tìm thấy dữ liệu"}
            </article>
          )}
        </ComponentCard>
      )}

      {recipesError && <p>Lỗi không tìm thấy phiên bản công thức</p>}

      {modalEditRecipe.isOpen && idRecipeEdit && (
        <ModalProductRecipeEdit
          currentRecipe={idRecipeEdit}
          isOpen={modalEditRecipe.isOpen}
          onClose={() => {
            modalEditRecipe.closeModal();
            setIdRecipeEdit(null);
          }}
        />
      )}

      {modalAlertCreateRecipe.isOpen && recipes && (
        <ModalAlert
          isOpen={modalAlertCreateRecipe.isOpen}
          onClose={modalAlertCreateRecipe.closeModal}
          type="success"
          title="Thêm công thức mới"
          description={`Bạn có muốn tạo thêm một công thức mới cho ${products?.data.find((item) => item.id === productSelected)?.name} không?`}
          onConfirm={() => handleCreateNewRecipe()}
          confirmText="Thêm mới"
        />
      )}

      <AddProductPageView />
    </MainContainer>
  );
}
