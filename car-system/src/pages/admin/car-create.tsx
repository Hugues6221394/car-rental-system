import { CarCreateForm } from "@/components/CarCreateForm";
import { PageContainer } from "@/components/PageContaire";
import { PageHeader } from "@/components/PageHeaders";
import { getUser } from "@/lib/api";
import { useNavigate } from "@tanstack/react-router";


const CarCreatePage = () => {
  const user = getUser();
  const navigate = useNavigate();

  if (user.role !== "ADMIN") {
    navigate({ to: "/dashboard" });
  }
  return (
    <PageContainer className="p-0">
      <PageHeader title="Create New Car" username={user.email} />

      <div className="p-6 bg-gray-50 dark:bg-navy-900/50">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white dark:bg-navy-800 rounded-xl shadow-sm dark:shadow-navy-900/50 border border-gray-200 dark:border-navy-700">
            <div className="p-6">
              <CarCreateForm />
            </div>
          </div>
        </div>
      </div>
    </PageContainer>
  );
};

export default CarCreatePage;
