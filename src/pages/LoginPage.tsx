import { supabase } from "@/lib/supabaseClient";
import { AlertCircle, CheckCircle2, Eye, EyeOff } from "lucide-react";
import { FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function LoginPage(){
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [toast, setToast] = useState({ show: false, message: '', type: '' });
    const navigate = useNavigate();

    // Function to display toast notifications
    const triggerToast = (message:string, type = 'success') => {
        setToast({ show: true, message, type });
        setTimeout(() => {
        setToast({ show: false, message: '', type: '' });
        }, 3500);
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!email.trim() || !password) {
        triggerToast('Please enter your email and password', 'error');
        return;
    }

    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
        setLoading(false);

        if (error) {
            triggerToast(
            error.code === 'invalid_credentials'
                ? 'Incorrect email or password.'
                : 'Something went wrong. Try again.',
            'error'
            );
            return;
        }

        triggerToast('Login successful! Redirecting...', 'success');
        navigate('/dashboard');
    };


    return(
        <>
        <div className="min-h-screen w-full bg-primary-content flex items-center justify-center p-4 font-sans text-gray-800 relative overflow-hidden">
            {toast.show && (
                <div
                className={`fixed top-6 right-6 z-50 flex items-center space-x-3 px-5 py-3.5 rounded-xl shadow-lg border text-sm font-medium transition-all duration-300 transform translate-y-0 ${
                    toast.type === 'error'
                    ? 'bg-rose-50 border-rose-200 text-rose-700'
                    : 'bg-emerald-50 border-emerald-200 text-emerald-700'
                }`}
                >
                {toast.type === 'error' ? (
                    <AlertCircle className="w-5 h-5 text-rose-500 flex-shrink-0" />
                ) : (
                    <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                )}
                <span>{toast.message}</span>
                </div>
            )}
            <div className="w-full max-w-md bg-white rounded-card p-8 sm:p-12 relative z-10 transition-all duration-300 over:shadow-2x shadow-card">
                <figure className="flex items-center justify-center m-8">
                    <img src="img/LogoKemnakerKecil.svg" alt="KEMNAKER" className="size-24"/>
                </figure>
                <form onSubmit={handleSubmit}>
                    <div className="relative group">
                        <div className="relative flex items-center">
                            <input
                                type="text"
                                id="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Email"
                                className="w-full pb-2 pt-3 px-1 text-gray-700 bg-transparent border-b-2 border-gray-300 focus:border-[#0080ff] focus:outline-none transition-colors duration-200 text-sm font-medium placeholder-gray-400"
                                autoComplete="email"
                            />
                        </div>
                    </div>
                    <div className="relative group">
                        <div className="relative flex items-center">
                        <input
                            type={showPassword ? 'text' : 'password'}
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Password"
                            className="w-full pb-2 pt-3 px-1 text-gray-700 bg-transparent border-b-2 border-gray-300 focus:border-[#0080ff] focus:outline-none transition-colors duration-200 text-sm font-medium placeholder-gray-400 pr-8"
                            autoComplete="current-password"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-1 bottom-2.5 text-gray-400 hover:text-gray-600 focus:outline-none transition-colors duration-200"
                            tabIndex={-1}
                            aria-label={showPassword ? "Hide password" : "Show password"}
                        >
                            {showPassword ? (
                            <EyeOff className="w-4 h-4" />
                            ) : (
                            <Eye className="w-4 h-4" />
                            )}
                        </button>
                        </div>
                    </div>
                    {/* Submit Button with Gradient Styling */}
                    <div className="pt-4">
                        <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3 px-6 rounded-full text-white font-bold tracking-wider text-sm shadow-md hover:shadow-lg transition-all duration-300 transform active:scale-95 disabled:opacity-75 disabled:cursor-not-allowed bg-gradient-to-r from-[#22c1c3] via-[#00a8ff] to-[#a832fe] hover:brightness-105 flex items-center justify-center space-x-2"
                        >
                        {loading ? (
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                            <>
                            <span>LOGIN</span>
                            </>
                        )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
        </>
    )
}