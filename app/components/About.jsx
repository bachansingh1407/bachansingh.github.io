
export default function About() {
  return (
    <section className="py-16">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Left - Title */}
          <div>
            <h2 className="text-4xl font-bold text-gray-900 mb-6">About me</h2>
            <div className="w-20 h-1 bg-blue-600 rounded-full"></div>
          </div>

          {/* Right - Content */}
          <div className="space-y-6">
            <p className="text-lg text-gray-700 leading-relaxed">
                I'm a frontend developer with a BCA and MCA background, specializing in modern web technologies. 
              I build full-stack applications using the MERN stack, with experience in API development, 
                        authentication, and system integration. Focused on creating clean, efficient solutions.
            </p>
            <p className="text-lg text-gray-700 leading-relaxed">
              I believe in writing clean, maintainable code and continuously learning
              new technologies and best practices.
            </p>
            <p className="text-lg text-gray-700 leading-relaxed">
              Currently, I work with React, Next.js, and TypeScript to build scalable applications
              with great user experiences.
            </p>
            <div className="flex gap-4 pt-4">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                <span>Creative Design</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                <span>Clean Code</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                <span>User Focused</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}