import AddTutorForm from "./AppTutorForm";


export const metadata = {
  title: "Add Tutor | MediQueue",
  description: "Add a new tutor to MediQueue",
};

export default function AddTutorPage() {
  return (
    <>
      <div>
        <AddTutorForm />
      </div>
    </>
  )
}
