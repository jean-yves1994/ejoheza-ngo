import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";

export const useAdminCheck = () => {
  const { user } = useAuth();

  const { data: isAdmin, isLoading } = useQuery({
    queryKey: ["admin-check", user?.id],
    queryFn: async () => {
      if (!user?.id) return false;
      
      const { data, error } = await supabase.rpc("is_admin");
      
      if (error) {
        console.error("Error checking admin status:", error);
        return false;
      }
      
      return data;
    },
    enabled: !!user?.id,
  });

  return { isAdmin: !!isAdmin, isLoading };
};