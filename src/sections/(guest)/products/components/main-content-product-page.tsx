import React from "react";
import ProductInfo from "./product-info";
import { ProductDetail } from "@/types/product";
import { APP_ROUTES } from "@/config/app-routes";
import { NavigationBar } from "@/components/common/navigation-bar";
import FloatingCartButton from "@/components/cart/floaing-cart-button";

interface MainContentProductPageProps {
  product: ProductDetail;
}

export default function MainContentProductPage({
  product,
}: MainContentProductPageProps) {
  return (
    <section className="bg-[#8D1111] [&_hr]:border-[#E2DDCD] relative flex flex-col h-dvh">
      <NavigationBar backHref={APP_ROUTES.GUEST.ROOT} />
      <ProductInfo
        info={product.info}
        options={product.options}
        isAllowOrder={product.isAllowOrder}
      />
      <FloatingCartButton />
    </section>
  );
}
