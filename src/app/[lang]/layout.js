import clsx from 'clsx'
import engine from '@/engine/index.js'
import Footer from '../layout/footer/index.jsx'
import Header from '../layout/header'

export default async function RootLayout({ children }) {
  const menuTop = await engine('./content')
    .from('pages')
    .filter(
      (page) =>
        page.slug.length === 1 &&
        (page.slug[0] !== 'instructions' ||
          process.env.NODE_ENV === 'development')
    )
    .map((page) => ({
      lang: page.lang,
      title: page.data.nav_title || page.data.title,
      slug: page.slug,
    }))
  return (
    <>
      <Header
        menuTop={menuTop}
        className={clsx(
          'fixed top-0 w-full z-10 h-[60px] border-b border-slate-500',
          'flex'
        )}
        style={{
          background: `radial-gradient(50% 50% at 50% 50%, rgba(14, 11, 22, 0.12) 0%, rgba(0, 0, 0, 0) 100%), radial-gradient(17.86% 94.3% at 87.98% 36.67%, rgba(27, 83, 83, 0.18) 0%, rgba(0, 0, 0, 0) 100%), radial-gradient(50.96% 97.73% at 18.2% 68.08%, rgba(28, 74, 74, 0.26) 0%, rgba(0, 0, 0, 0) 100%), rgba(44, 48, 49, 0.90)`,
        }}
      />
      <div
        className="w-full h-full flex min-h-screen"
        style={{
          background: `radial-gradient(23.91% 23.92% at 14.33% 30.99%, rgba(19, 10, 39, 0.2) 0%, rgba(32, 10, 39, 0) 100%), radial-gradient(37.93% 37.93% at 85.72% 23.89%, rgba(4, 11, 18, 0.2) 0%, rgba(58, 95, 129, 0) 100%), radial-gradient(25.52% 25.52% at 24.55% 76.74%, rgba(95, 116, 97, 0.2) 0%, rgba(45, 67, 48, 0) 100%), radial-gradient(42.95% 42.95% at 21.12% 25.63%, rgba(97, 130, 120, 0.2) 0%, rgba(122, 159, 132, 0) 100%), radial-gradient(63.47% 63.46% at 31.32% 63.18%, rgba(64, 86, 142, 0.2) 0%, rgba(0, 0, 0, 0) 100%), radial-gradient(19.87% 43.71% at 73.92% 40.01%, rgba(122, 159, 132, 0.116) 0%, rgba(40, 52, 59, 0.056) 100%), #263134`,
        }}
      >
        {children}
      </div>
      <div
        className="p-10 border-t-2 border-slate-500"
        style={{
          background: `linear-gradient(154.09deg, rgba(0, 0, 0, 0.2) 16.35%, rgba(0, 0, 0, 0) 39.32%), radial-gradient(14.08% 17.22% at 86.26% 77.02%, rgba(255, 255, 255, 0.04) 0%, rgba(255, 255, 255, 0) 100%), radial-gradient(31.27% 31.27% at 81.13% 24.31%, rgba(86, 80, 28, 0.2) 0%, rgba(11, 36, 32, 0) 100%), radial-gradient(26.56% 26.56% at 19.78% 70.31%, rgba(54, 22, 28, 0.2) 0%, rgba(10, 14, 27, 0) 100%), linear-gradient(180deg, #2F3A44 0%, #202B2B 100%)`,
        }}
      >
        <Footer />
      </div>
    </>
  )
}
