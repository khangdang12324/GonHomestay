import Image from "next/image";
import { cn } from "@/lib/utils";

export function ImageFrame({
  src,
  alt,
  className,
  priority,
}: {
  src: string;
  alt: string;
  className?: string;
  priority?: boolean;
}) {
  const isExternal = src.startsWith("http");

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-lg bg-[linear-gradient(135deg,#eadbc2,#8fae8b)]",
        className,
      )}
    >
      {isExternal ? (
        // Supabase Storage URLs are managed from admin, so render directly.
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src} alt={alt} className="absolute inset-0 h-full w-full object-cover" />
      ) : (
        <Image
          src={src}
          alt={alt}
          fill
          priority={priority}
          sizes="(min-width: 1024px) 50vw, 100vw"
          className="object-cover"
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
    </div>
  );
}
