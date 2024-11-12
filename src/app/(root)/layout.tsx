import Navbar from "@/components/customComponents/Navbar";
import ReduxProvider from "@/provider/ReduxProvider";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <ReduxProvider>
      <main className="container-max py-8 mt-2 p-5">
        <div className="w-full flex justify-center items-center mb-10">
          <Navbar />
        </div>

        {children}
      </main>
    </ReduxProvider>
  );
}
