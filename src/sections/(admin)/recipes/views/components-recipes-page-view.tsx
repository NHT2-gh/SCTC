"use client";
import { ComponentCard } from "@/components/common/component-card";
import { MainContainer } from "@/components/common/page-layout";
import { SearchBar } from "@/components/search-bar";
import {
  useComponents,
  useGetComponentRecipeItems,
} from "@/hooks/queries/use-component";
import { useEffect, useState } from "react";
import {
  AddComponentForm,
  ItemSearch,
  ModalComponentRecipeItems,
} from "../components";
import { useModal } from "@/hooks/useModal";
import { Component } from "@/types/component";
import { useUrlState } from "@/hooks/use-url-state";

export default function ComponentsRecipesPageView() {
  const [searchText, setSearchText] = useState<string | undefined>(undefined);
  const [componentSelected, setComponentSelected] = useState<Component | null>(
    null,
  );
  const modalViewComponentItems = useModal();
  const [viewComponentRecipe, setViewComponentRecipe] =
    useUrlState<string>("component_id ");
  const { data: componentsData, error, isLoading } = useComponents(searchText);
  const { data: componentRecipeItems } = useGetComponentRecipeItems(
    componentSelected?.id,
  );

  useEffect(() => {
    if (!viewComponentRecipe) return;
    const component = componentsData?.data.find(
      (item) => item.id === viewComponentRecipe,
    );

    if (component) {
      setComponentSelected(component);
      modalViewComponentItems.openModal();
    } else {
      modalViewComponentItems.closeModal();
    }
  }, [viewComponentRecipe, componentsData]);
  return (
    <MainContainer title="Công thức thành phần">
      <ComponentCard title={"Tìm kiếm công thức thành phần"}>
        <SearchBar
          handleKeyDown={(value) => {
            setSearchText(value);
          }}
          handleOnChange={(value) => {
            if (!value.trim()) setSearchText(undefined);
          }}
          placeholder="Nhập tên thành phần để tìm kiếm"
          className="max-w-full"
        />
        {componentsData?.data && searchText && (
          <div className="border absolute bg-white z-[10] top-32 left-6 right-6 rounded-lg mt-3 min-h-fit">
            {isLoading && <span>...Đang tải</span>}
            {componentsData?.data.length > 0 ? (
              componentsData?.data?.map((item) => (
                <ItemSearch
                  key={item.id}
                  data={item}
                  onSelect={(id) => {
                    setViewComponentRecipe(id);
                  }}
                />
              ))
            ) : (
              <p>Không tìm thấy dữ liệu</p>
            )}

            {error && <span>Lỗi tìm kiếm. Vui lòng thử lại</span>}
          </div>
        )}
      </ComponentCard>

      <ComponentCard title={"Tạo công thức thành phần"}>
        <AddComponentForm />
      </ComponentCard>
      {modalViewComponentItems.isOpen && (
        <ModalComponentRecipeItems
          component={componentSelected!}
          items={componentRecipeItems?.data || []}
          isOpen={modalViewComponentItems.isOpen}
          onClose={modalViewComponentItems.closeModal}
        />
      )}
    </MainContainer>
  );
}
