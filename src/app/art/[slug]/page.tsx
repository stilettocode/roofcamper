import { PrismaClient } from "@prisma/client";
import Image from "next/image"; //research later

const prisma = new PrismaClient();

export default async function ArtworkPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  const artwork = await prisma.artwork.findUnique({
    where: { slug },
  });

  if (!artwork) {
    return <div>Artwork not found</div>;
  }

  return (
    <main className="p-8 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">{artwork.title}</h1>
      <div className="relative w-full h-64 mb-4">
              <Image
                src={artwork.imageUrl}
                alt={artwork.title ?? "Artwork"}
                fill
                style={{ objectFit: "cover" }}
              />
            </div>
    </main>
  );
}
