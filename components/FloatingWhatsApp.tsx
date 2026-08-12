import { whatsappLink } from "@/lib/site";
import { IconWhatsapp } from "@/components/icons";

export default function FloatingWhatsApp() {
  return (
    <a
      href={whatsappLink(
        "Olá! Vim pelo site da Perfumaria Suanne e gostaria de atendimento personalizado."
      )}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Falar no WhatsApp"
      className="fixed bottom-6 right-6 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-xl shadow-black/20 transition-transform duration-300 hover:scale-110"
    >
      <IconWhatsapp className="h-7 w-7" />
    </a>
  );
}
