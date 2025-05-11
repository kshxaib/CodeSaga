import { Code, Terminal, FileCode, Braces } from "lucide-react"
import { useEffect, useState } from "react"

const CodeBackground = ({ title, subtitle }) => {
  const [activeIndex, setActiveIndex] = useState(0)

  const codeSnippets = [
    `function welcomeUser(name) {
  // Beautiful animations with Framer Motion
  const controls = useAnimation();
  
  useEffect(() => {
    controls.start({
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 }
    });
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={controls}
      className="text-primary"
    >
      Hello, {name}!
    </motion.div>
  );
}`,
    `// Secure authentication with Zod validation
const schema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

function LoginForm() {
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({ resolver: zodResolver(schema) });

  return (
    <form onSubmit={handleSubmit(data => console.log(data))}>
      <input {...register("email")} />
      {errors.email && <span>{errors.email.message}</span>}
      <button type="submit">Login</button>
    </form>
  );
}`,
    `// Modern UI with Tailwind CSS
function Card({ title, children }) {
  return (
    <div className="bg-base-100 rounded-xl shadow-lg overflow-hidden">
      <div className="p-6">
        <h3 className="text-xl font-bold text-primary">{title}</h3>
        <div className="mt-4 text-base-content/80">
          {children}
        </div>
      </div>
    </div>
  );
}`
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % codeSnippets.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [codeSnippets.length])

  return (
    <div className="hidden lg:flex flex-col items-center justify-center bg-gradient-to-br from-primary to-primary-focus text-primary-content p-12 relative overflow-hidden">
      {/* Animated code symbols in background */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-[10%] left-[15%] animate-float">
          <Braces size={40} />
        </div>
        <div className="absolute top-[30%] left-[80%] animate-float delay-300">
          <FileCode size={50} />
        </div>
        <div className="absolute top-[70%] left-[20%] animate-float delay-700">
          <Terminal size={45} />
        </div>
        <div className="absolute top-[60%] left-[75%] animate-float delay-500">
          <Code size={55} />
        </div>
      </div>

      <div className="z-10 max-w-md flex flex-col items-center">
        {/* Code editor mockup */}
        <div className="w-full bg-neutral/20 backdrop-blur-sm rounded-lg shadow-2xl mb-8 overflow-hidden border border-primary/20">
          {/* Editor header */}
          <div className="bg-primary/30 px-4 py-2 flex items-center">
            <div className="flex space-x-2 mr-4">
              <div className="w-3 h-3 rounded-full bg-primary-content/80"></div>
              <div className="w-3 h-3 rounded-full bg-primary-content/80"></div>
              <div className="w-3 h-3 rounded-full bg-primary-content/80"></div>
            </div>
            <div className="text-xs font-mono opacity-80">example.jsx</div>
          </div>

          {/* Code content */}
          <div className="p-4 font-mono text-sm overflow-hidden relative h-64">
            <pre className="whitespace-pre-wrap text-primary-content/90 transition-opacity duration-1000">
              {codeSnippets[activeIndex]}
            </pre>
            <div className="absolute bottom-4 right-4 w-2 h-6 bg-primary-content animate-pulse"></div>
          </div>
        </div>

        {/* Text content */}
        <h2 className="text-4xl font-bold mb-4 text-center">{title}</h2>
        <p className="text-primary-content/80 text-center text-lg">{subtitle}</p>
      </div>
    </div>
  )
}

export default CodeBackground