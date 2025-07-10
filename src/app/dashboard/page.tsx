import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import prisma from "../../lib/prisma";
import { Artwork } from "@prisma/client";
import Image from "next/image";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    redirect("/api/auth/signin");
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: { artworks: true },
  });

  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold mb-4">Your Uploaded Artworks</h1>
      <ul>
        {user?.artworks.map((artwork: Artwork) => (
          <li key={artwork.id} className="mb-2">
            <p>{artwork.title}</p>
            <div className="relative w-full h-64 mb-4"> {/* responsive parent container */}
                <Image
                    src={artwork.imageUrl}
                    alt={artwork.title ?? "Artwork"}
                    fill
                    style={{ objectFit: "cover" }}
                />
            </div>
          </li>
        ))}
      </ul>
    </main>
  );
}
