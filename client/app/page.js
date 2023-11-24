import Image from "next/image";
import Background from "@/public/authBg.webp";

export default function Home() {
  return (
    <div className="flex h-screen text-xl overflow-hidden">
      <div className="flex flex-col gap-4 justify-center items-center w-1/2 h-full ">
        <h1 className="text-5xl tracking-tighter font-semibold">Register</h1>
        <form className="p-8 flex-col flex gap-8">
          <input placeholder="username" />
          <input placeholder="password" />

          <button className="bg-neutral-800 text-white p-2 ">Submit</button>
        </form>
      </div>
      <div>
        <Image src={Background} className="min-h-screen min-w-0 object-cover" />
      </div>
    </div>
  );
}
