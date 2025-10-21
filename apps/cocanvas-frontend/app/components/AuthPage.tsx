export function AuthPage({ isSignin }: { isSignin: boolean }) {
    return (
        <div className="w-screen h-screen flex justify-center items-center bg-gray-50">
            <div className="p-6 bg-white rounded-2xl shadow-lg flex flex-col gap-3 w-80">
                <input type="text" placeholder="Email" className="border border-gray-300 rounded-lg px-3 py-2 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                <input type="password" placeholder="Password" className="border border-gray-300 rounded-lg px-3 py-2 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                <button className="mt-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg py-2 font-semibold transition-all duration-200">{isSignin ? "Sign In" : "Sign Up"}</button>
            </div>
        </div>
    )
}
