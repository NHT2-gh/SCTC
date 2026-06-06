"use client";
import { ComponentCard } from "@/components/common/component-card";
import { MainContainer } from "@/components/common/page-layout";
import { SearchBar } from "@/components/search-bar";
import {
  useComponents,
  useGetComponentRecipeItems,
} from "@/hooks/queries/use-component";
import { useState } from "react";
import { ItemSearch, ModalComponentRecipeItems } from "../components";
import { Loader2 } from "lucide-react";
import { useModal } from "@/hooks/useModal";

export default function ComponentsRecipesPageView() {
  const [searchText, setSearchText] = useState<string | undefined>(undefined);
  const [componentSelected, setComponentSelected] = useState<string | null>(
    null,
  );
  const modalViewComponentItems = useModal();
  const { data: componentsData, error, isLoading } = useComponents(searchText);
  const {
    data: componentRecipeItems,
    error: ComponentRecipeError,
    isLoading: isLoadingComponentRecipe,
  } = useGetComponentRecipeItems(componentSelected);
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
          <div className="border rounded-lg mt-3 min-h-fit">
            {isLoading && <span>...Đang tải</span>}
            {componentsData?.data.length > 0 ? (
              componentsData?.data?.map((item) => (
                <ItemSearch
                  key={item.id}
                  data={item}
                  onSelect={(id) => {
                    modalViewComponentItems.openModal();
                    setComponentSelected(id);
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
      {componentSelected && componentRecipeItems?.data && (
        <ModalComponentRecipeItems
          items={componentRecipeItems?.data}
          isOpen={modalViewComponentItems.isOpen}
          onClose={modalViewComponentItems.closeModal}
        />
      )}
    </MainContainer>
  );
}
