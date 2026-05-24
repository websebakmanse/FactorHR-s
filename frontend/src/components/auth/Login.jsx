import React,{useState} from 'react'

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    console.log('Email:', email)
    console.log('Password:', password)

    alert("Login successful")
    setEmail('')
    setPassword('')
  }


  return (
    <div className="relative min-h-screen flex items-center justify-center bg-slate-950 overflow-hidden p-4">
      {/* Background Glowing Blobs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600 rounded-full mix-blend-screen filter blur-[128px] opacity-70"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-600 rounded-full mix-blend-screen filter blur-[128px] opacity-70"></div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-pink-600 rounded-full mix-blend-screen filter blur-[128px] opacity-40"></div>

      {/* Enhanced Glassmorphism Card */}
      <div className="relative w-full max-w-md bg-white/10 backdrop-blur-2xl border-t border-l border-white/30 border-r border-b border-white/10 p-10 rounded-3xl shadow-[0_8px_32px_0_rgba(0,0,0,0.5)] z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent opacity-20 rounded-3xl pointer-events-none"></div>
        <h2 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white to-white/60 text-center mb-8 relative z-10">Welcome Back</h2>
        
        <form className="space-y-6 relative z-10" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium text-white/80 mb-2" htmlFor="email">
              Email Address
            </label>
            <input 
              type="email" 
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-5 py-3 rounded-xl bg-black/20 border border-white/10 text-white placeholder-white/40 focus:outline-none focus:border-purple-400 focus:bg-black/40 focus:ring-1 focus:ring-purple-400 transition-all duration-300 backdrop-blur-sm"
              placeholder="you@example.com"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-white/80 mb-2" htmlFor="password">
              Password
            </label>
            <input 
              type="password" 
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-5 py-3 rounded-xl bg-black/20 border border-white/10 text-white placeholder-white/40 focus:outline-none focus:border-purple-400 focus:bg-black/40 focus:ring-1 focus:ring-purple-400 transition-all duration-300 backdrop-blur-sm"
              placeholder="••••••••"
              required
            />
          </div>

          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center text-white/70 hover:text-white cursor-pointer transition-colors">
              <input type="checkbox" className="mr-2 rounded border-white/20 bg-black/20 accent-purple-500 cursor-pointer" />
              Remember me
            </label>
            <a href="#" className="text-white/70 hover:text-white transition-colors">
              Forgot Password?
            </a>
          </div>

          <button 
            type="submit" 
            className="w-full py-3.5 px-4 rounded-xl font-bold text-white bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-400 hover:to-indigo-500 border border-white/10 shadow-lg hover:shadow-purple-500/30 transform hover:-translate-y-0.5 transition-all duration-300 ease-in-out"
          >
            Sign In
          </button>
        </form>

        <p className="mt-8 text-center text-sm text-white/60">
          Don't have an account?{' '}
          <a href="#" className="text-white hover:underline transition-all">
            Sign up
          </a>
          <a href="#" className="text-white hover:underline transition-all">
            Sign up
          </a>
        </p>
      </div>
    </div>
  )
}

export default Login
