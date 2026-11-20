import AnimatedContent from "./AnimatedContent";


export default function StudioSection() {
  return (
    <section className="relative min-h-[900px] w-full overflow-hidden rounded-xl bg-[#EBFAFF] dark:bg-[#030A1B]">
      <AnimatedContent distance={150} direction="vertical" duration={0.8} ease="power3.out" blur={0} stagger={0.08} threshold={0.1}>
        <div className="mx-auto flex w-full flex-col items-center text-center max-w-[800px]">
        <h2 className="text-3xl space-grotesk-bold text-slate-900 dark:text-white">
          Studios
        </h2>
      </div>
      <div className="mx-auto max-w-[900px] pt-10 grid grid-cold-5">

      </div>
      </AnimatedContent>
    </section>
  )
}
