import Link from 'next/link';
import Loading from '@/components/LoadingComponent';

export default function Page() {
  return (
    <>
      <h1>Hello, Next.js!</h1>
      <Link href="/signup">
        Signup Page
      </Link>
    </>
  )
}
