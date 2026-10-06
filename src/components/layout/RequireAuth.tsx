import { Session } from "@supabase/supabase-js";
import { Navigate, Outlet } from "react-router-dom";

export function RequireAuth({ session }: { session: Session | null }){
    if (session) return <Outlet />;
    return <Navigate to="/login" replace />;
}