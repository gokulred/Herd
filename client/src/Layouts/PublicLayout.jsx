import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";

export default function PublicLayout() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main>
        <Outlet />{" "}
        {/* This will render the child routes like HomePage and EventPage */}
      </main>
      <footer className="bg-white mt-12">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 text-center text-gray-500">
          <p>&copy; 2025 EventHub. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
