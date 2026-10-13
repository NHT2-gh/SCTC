import React, { CSSProperties } from "react";

export default function ICCartIcon({
  className,
  style,
}: {
  className: string;
  style?: CSSProperties;
}) {
  return (
    <svg
      width="60"
      height="60"
      viewBox="0 0 55 55"
      fill="none"
      className={className}
      style={style}
      xmlns="http://www.w3.org/2000/svg"
    >
      <g filter="url(#filter0_d_167_17)">
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M5.12691 20.3907C5.75598 13.9503 8.90894 6.81043 10.4218 3.89237C11.1844 2.2762 14.7738 3.21897 16.4733 3.89237C16.2888 4.6479 15.9176 5.74662 15.4951 6.99693C14.4743 10.0185 14.2068 14.4119 14.5 16.5C14.8782 19.1936 17.8654 20.596 19 21C22.7822 22.3468 32.5961 22.6936 36 20C40.2968 16.5999 38.2837 9.16734 36.1405 3.89237C37.7795 3.21897 41.2843 2.27622 42.192 3.89237C43.3267 5.91262 45.218 9.28 46.7307 14.6668C48.2436 20.054 49 29.4815 49 38.2357C49 46.9899 40.3009 48 39.5445 48H13.0693C1.86696 48 3.76618 31.9969 4.81987 23.1183C4.94015 22.1048 5.04941 21.1841 5.12691 20.3907Z"
          fill="#8D1111"
        />
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M15.4951 6.99693C15.9176 5.74662 16.2888 4.6479 16.4733 3.89237C16.7254 7.48384 18.0618 14.9361 21.3901 16.0136C25.5505 17.3604 30.8455 16.687 32.3584 16.0136C33.8712 15.3402 35.3841 13.6566 36.1405 3.89237C38.2837 9.16734 40.2968 16.5999 36 20C32.5961 22.6936 22.7822 22.3468 19 21C17.8654 20.596 14.8782 19.1936 14.5 16.5C14.2068 14.4119 14.4743 10.0185 15.4951 6.99693Z"
          fill="#8D1111"
          fillOpacity="0.5"
        />
        <path
          d="M10.0513 23.2019C10.0513 24.58 10.0513 34.2269 19.1285 38.0167"
          stroke="#C08282"
          strokeLinecap="round"
        />
        <path
          d="M33.5007 44.0775C36.906 43.4041 43.6381 39.4984 43.3237 29.2627"
          stroke="#C08282"
          strokeLinecap="round"
        />
      </g>
      <defs>
        <filter
          id="filter0_d_167_17"
          x="0"
          y="0"
          width="55"
          height="55"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          />
          <feOffset dx="1" dy="2" />
          <feGaussianBlur stdDeviation="2.5" />
          <feComposite in2="hardAlpha" operator="out" />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.35 0"
          />
          <feBlend
            mode="normal"
            in2="BackgroundImageFix"
            result="effect1_dropShadow_167_17"
          />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="effect1_dropShadow_167_17"
            result="shape"
          />
        </filter>
      </defs>
    </svg>
  );
}
