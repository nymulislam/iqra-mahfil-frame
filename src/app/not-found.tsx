import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center bg-slate-50">
      <h2 className="text-3xl font-extrabold text-slate-900 mb-2">পৃষ্ঠাটি পাওয়া যায়নি</h2>
      <p className="text-slate-600 mb-6">অনুগ্রহ করে প্রধান পাতায় ফিরে যান।</p>
      <Link
        href="/"
        className="px-6 py-2.5 rounded-full bg-sky-700 text-white font-bold text-sm shadow hover:bg-sky-800 transition"
      >
        হোমে ফিরুন
      </Link>
    </div>
  );
}
