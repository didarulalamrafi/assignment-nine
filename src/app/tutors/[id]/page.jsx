import { notFound } from "next/navigation";
import TutorDetails from "@/components/TutorDetails";


export async function generateMetadata({ params }) {
  const { id } = await params;
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_SERVER_URL}/tutors/${id}`,
    {
      cache: "no-store",
    },
  );
  if (!res.ok) return { title: "Tutor | MediQueue" };
  const tutor = await res.json();
  return {
    title: `${tutor.name} | MediQueue`,
    description: `Book a session with ${tutor.name} on MediQueue`,
  };
}

async function getTutor(id) {
  try {

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_SERVER_URL}/tutors/${id}`,
      {
        cache: "no-store"
      },
    );
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export default async function TutorDetailsPage({ params }) {
  const { id } = await params;
  const tutor = await getTutor(id);

  if (!tutor) return notFound();

  return <TutorDetails tutor={tutor} />;
}


