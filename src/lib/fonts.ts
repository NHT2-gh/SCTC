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
