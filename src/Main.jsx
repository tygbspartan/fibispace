import Footer from "./components/Footer";
import Navbar from "./components/Navbar";

const Main = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <header>
        <Navbar />
      </header>

      <main className="flex-grow p-4">
        <p className="text-3xl font-bold italic">Body</p>
        <p className="text-3xl font-bold italic">Body</p>
        <p className="text-3xl font-bold italic">Body</p>
        <p className="text-3xl font-bold italic">Body</p>
        <p className="text-3xl font-bold italic">Body</p>
        <p className="text-3xl font-bold italic">Body</p>
        <p className="text-3xl font-bold italic">Body</p>
        <p className="text-3xl font-bold italic">Body</p>
        <p className="text-3xl font-bold italic">Body</p>
        <p className="text-3xl font-bold italic">Body</p>
        <p className="text-3xl font-bold italic">Body</p>
        <p className="text-3xl font-bold italic">Body</p>
        <p className="text-3xl font-bold italic">Body</p>
        <p className="text-3xl font-bold italic">Body</p>
        <p className="text-3xl font-bold italic">Body</p>
        <p className="text-3xl font-bold italic">Body</p>
        <p className="text-3xl font-bold italic">Body</p>
        <p className="text-3xl font-bold italic">Body</p>
        <p className="text-3xl font-bold italic">Body</p>
        <p className="text-3xl font-bold italic">Body</p>
        <p className="text-3xl font-bold italic">Body</p>
        <p className="text-3xl font-bold italic">Body</p>
        <p className="text-3xl font-bold italic">Body</p>
        <p className="text-3xl font-bold italic">Body</p>
        <p className="text-3xl font-bold italic">Body</p>
        <p className="text-3xl font-bold italic">Body</p>
        <p className="text-3xl font-bold italic">Body</p>
      </main>
      <footer className="bg-gray-900 text-gray-300 pt-12 pb-6 items-center">
        <Footer />
      </footer>
    </div>
  );
};

export default Main;
