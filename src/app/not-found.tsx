// app/not-found.tsx
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className='min-h-screen flex flex-col gap-5 items-center justify-center'>
      <h1 className='text-3xl text-darkbrownText'>Page <span className='text-red-500'>Not Found</span></h1>
      <p className='text-2xl text-darkbrownText text-center'>Sorry, we couldn&apos;t find the page you&apos;re looking for.</p>
      <Link href="/" className='text-xl text-darkbrownText'>Go back home</Link>
    </div>
  );
}
