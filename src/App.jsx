import { useLenis } from './hooks/useLenis'
import { Navbar } from './components/ui/Navbar'
import { Hero } from './components/sections/Hero'
import { Results } from './components/sections/Results'
import { Differentials } from './components/sections/Differentials'
import { Methodology } from './components/sections/Methodology'
import { Testimonials } from './components/sections/Testimonials'
import { CTAFinal } from './components/sections/CTAFinal'
import { Footer } from './components/sections/Footer'

export default function App() {
  useLenis()

  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Results />
        <Differentials />
        <Methodology />
        <Testimonials />
        <CTAFinal />
      </main>
      <Footer />
    </>
  )
}
