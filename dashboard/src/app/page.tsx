import { redirect } from 'next/navigation';

export default function RootPage() {
  // Automatically redirect anyone visiting the bare domain straight to their dashboard
  redirect('/home');
}
