"use client";

import { MessageCircle } from "lucide-react";
import { whatsappLink } from "@/lib/site-config";

export function WhatsappButton() {
  return (
    <a
      href={whatsappLink("Hello Meedway, I would like to know more.")}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      className="fixed bottom-5 right-5 z-40 inline-flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg shadow-black/20 transition-transform hover:scale-105 active:scale-95"
    >
      <MessageCircle className="h-7 w-7" />
    </a>
  );
}
