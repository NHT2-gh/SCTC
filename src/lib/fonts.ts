import localFont from "next/font/local";

export const delagothic = localFont({
  src: [
    {
      path: "../assets/fonts/DelaGothicOne-Regular.ttf",
      weight: "400",
      style: "normal",
    },
  ],
  variable: "--font-delagothic",
  display: "swap",
});

export const itim = localFont({
  src: [
    {
      path: "../assets/fonts/Itim-Regular.ttf",
      weight: "400",
      style: "normal",
    },
  ],
  variable: "--font-itim",
  display: "swap",
});

export const roboto = localFont({
  src: [
    {
      path: "../assets/fonts/roboto/Roboto-Regular.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../assets/fonts/roboto/Roboto-Medium.ttf",
      weight: "500",
      style: "normal",
    },
    {
      path: "../assets/fonts/roboto/Roboto-Bold.ttf",
      weight: "600",
      style: "normal",
    },
    {
      path: "../assets/fonts/roboto/Roboto-Italic.ttf",
      weight: "400",
      style: "italic",
    },
  ],
  variable: "--font-roboto",
  display: "swap",
});

export const outfit = localFont({
  src: [
    {
      path: "../assets/fonts/outfit/Outfit-Regular.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../assets/fonts/outfit/Outfit-Medium.ttf",
      weight: "500",
      style: "normal",
    },
    {
      path: "../assets/fonts/outfit/Outfit-SemiBold.ttf",
      weight: "600",
      style: "normal",
    },
    {
      path: "../assets/fonts/outfit/Outfit-Bold.ttf",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-outfit",
  display: "swap",
});
