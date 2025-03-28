import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/authStore";
import { useRouter } from "next/navigation";

const WithAuth = (Component: React.FC, requiredRole: "Admin" | "User") => {
  return () => {
    const { token, role } = useAuthStore();
    console.log("🚀 ~ return ~ token:", token)
    console.log("🚀 ~ return ~ role:", role)
    const router = useRouter();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
      const storedToken = localStorage.getItem("token");
      const storedRole = localStorage.getItem("role") as "Admin" | "User";

      if (!storedToken || storedRole !== requiredRole) {
        router.push("/");
      } else {
        setLoading(false);
      }
    }, [role, router]);

    if (loading) {
      return (
        <p className="text-center mt-10 text-white">
          Checking authentication...
        </p>
      );
    }

    return <Component />;
  };
};

export default WithAuth;
