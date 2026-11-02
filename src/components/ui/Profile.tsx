import { supabase } from "@/lib/supabaseClient";
import { useState } from "react";

export default function Profile(){ 

    const [loading, setLoading] = useState(false);

    const handleLogout = async () => {
        setLoading(true);
        const { error } = await supabase.auth.signOut();
        if(error) {
            setLoading(false);
            console.error;
        };
    }

    return(
        <>
        <div className= {`dropdown dropdown-end ${loading ? "dropdown-open" : ""}`} >
            <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
                <div className="w-10 rounded-full">
                <img
                    alt="Tailwind CSS Navbar component"
                    src="https://static.wikia.nocookie.net/reverse1999/images/d/d9/Ramona_Happy_Icon.png/revision/latest?cb=20260530145225" />
                </div>
            </div>
            <ul
                tabIndex={-1}
                className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow">
                <li>
                <a className="justify-between">
                    Profile
                    <span className="badge">New</span>
                </a>
                </li>
                <li><a>Settings</a></li>
                <li><button onClick={handleLogout} disabled={loading} className="w-full">
                    {loading ? (
                        <span className="loading loading-spinner loading-xs">Keluar...</span>
                    ) : (
                        <>
                        <span>Logout</span>
                        </>
                    )}
                </button></li>
            </ul>
        </div>
        </>
    )
 }