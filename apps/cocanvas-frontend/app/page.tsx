
import Link from "next/link";
import { Pencil, Users, Zap } from "lucide-react";

export default function LandingPage() {
  return (
    <main className="min-h-screen flex flex-col bg-gray-50 text-gray-900">
      {/* Navbar */}
      <nav className="flex items-center justify-between px-8 py-4 shadow-sm bg-white/80 backdrop-blur-md">
        <Link
          href="/"
          className="text-2xl font-bold bg-linear-to-r from-indigo-500 to-blue-600 bg-clip-text text-transparent"
        >
          Cocanvas 🎨
        </Link>

        <div className="flex gap-4">
          <Link
            href="/signin"
            className="px-5 py-2 text-indigo-600 border border-indigo-600 rounded-xl hover:bg-indigo-50 transition-all duration-200"
          >
            Sign In
          </Link>
          <Link
            href="/signup"
            className="px-5 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-all duration-200"
          >
            Sign Up
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="flex flex-col items-center text-center mt-24 px-6">
        <h1 className="text-5xl font-bold mb-4 bg-linear-to-r from-indigo-500 to-blue-600 bg-clip-text text-transparent">
          Welcome to Cocanvas
        </h1>
        <p className="text-lg text-gray-600 max-w-xl mb-8">
          A collaborative whiteboard where creativity meets real-time teamwork.
          Draw, brainstorm, and create — together.
        </p>
        <Link
          href="/canvas"
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl shadow-md transition-all duration-200"
        >
          Start Drawing →
        </Link>
      </section>

      {/* Features */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-8 px-6 mt-20 max-w-5xl mx-auto">
        <FeatureCard
          icon={<Pencil className="w-8 h-8 text-indigo-600" />}
          title="Smooth Drawing"
          desc="Experience fast and intuitive drawing with infinite canvas support."
        />
        <FeatureCard
          icon={<Users className="w-8 h-8 text-indigo-600" />}
          title="Real-time Collaboration"
          desc="Invite teammates and create together in real-time."
        />
        <FeatureCard
          icon={<Zap className="w-8 h-8 text-indigo-600" />}
          title="Instant Sharing"
          desc="Share your workspace with a single link — no setup required."
        />
      </section>

      {/* Footer */}
      <footer className="mt-20 mb-6 text-gray-500 text-sm text-center">
        Built with ❤️ by <span className="font-semibold">Abhinandan Kaushik</span> —{" "}
        <a
          href="https://github.com/yourusername/cocanvas"
          target="_blank"
          className="underline hover:text-indigo-600"
        >
          View on GitHub
        </a>
      </footer>
    </main>
  );
}

function FeatureCard({
  icon,
  title,
  desc,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
}) {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-lg transition-shadow text-center">
      <div className="flex justify-center mb-4">{icon}</div>
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-gray-600 text-sm">{desc}</p>
    </div>
  );
}
