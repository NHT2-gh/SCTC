import Modal from "@/components/ui/modal/modal";
import { useModal } from "@/hooks/useModal";
import Image from "next/image";
import React from "react";
import { ContactInfo, ListAnnouncement } from ".";

interface ModalViewProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ModalView({ isOpen, onClose }: ModalViewProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      isFullScreen
      className="rounded-2xl max-h-[85vh] !max-w-[600px] pt-0 p-3"
    >
      <div className="w-full flex flex-col">
        <div className=" w-full h-[12.5rem]">
          <Image
            src={"/images/backgrounds/bill-bg-3.webp"}
            alt={"background"}
            height={200}
            width={400}
            className="object-cover rounded-2xl h-[12.5rem] w-full"
          />
        </div>

        <div className="bg-amber-50 px-4 w-full h-fit relative z-[10] before:content-[''] before:bg-amber-50 before:absolute before:w-[150%] before:h-[100%] before:rounded-[200%]  before:left-[50%] before:translate-x-[-50%] before:-top-[20%] before:z-[-1]">
          <div className=" bg-amber-50 rounded-full p-2 aspect-square size-[120px] absolute -mt-[10rem] left-1/2 -translate-x-1/2  ">
            <Image
              src={"/images/logo/logo-sctc-v1.webp"}
              alt={"logo"}
              width={100}
              height={100}
              className="w-full"
            />
          </div>

          <div className="space-y-5 -mt-[2.5rem]">
            <h1 className="text-black font-delagothic text-center text-[1.25rem] ">
              Sáng Cà Tối Cồn
            </h1>
            <ContactInfo />
            <ListAnnouncement />
          </div>
        </div>
      </div>
    </Modal>
  );
}
