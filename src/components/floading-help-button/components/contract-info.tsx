import { IcInstagram, IcThread, IcTiktok } from "@/assets/svgs";
import Link from "next/link";
import React from "react";

const socialNetworks = [
  {
    name: "Thread",

    icon: <IcThread size={24} />,
    link: "https://www.threads.com/@sangcatoicon",
  },
  {
    name: "Instagram",
    icon: <IcInstagram size={24} />,
    link: "https://www.instagram.com/sangcatoicon",
  },
  {
    name: "TikTok",
    icon: <IcTiktok size={24} />,
    link: "https://www.tiktok.com/@sangcatoicon",
  },
];

export default function ContactInfo() {
  return (
    <>
      <div className="w-full flex gap-4 justify-center items-center">
        {socialNetworks.map((item) => (
          <Link
            href={item.link}
            key={item.name}
            className=" p-2 bg-neutral-200 rounded-full"
          >
            {item.icon}
          </Link>
        ))}
      </div>
      <iframe
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3918.5506234587415!2d106.64936261170449!3d10.845660889262836!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x317529faecf8fc83%3A0xfe5bcc12a80a6ea5!2zU8OhbmcgQ8OgIFThu5FpIEPhu5Nu!5e0!3m2!1svi!2s!4v1784794423397!5m2!1svi!2s"
        height="200"
        style={{ border: "0" }}
        allowFullScreen
        loading="lazy"
        referrerPolicy="strict-origin-when-cross-origin"
        className="w-full aspect-square rounded-2xl"
      ></iframe>
    </>
  );
}
