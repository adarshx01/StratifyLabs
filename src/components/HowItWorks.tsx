export function HowItWorks() {
  return (
    <section className="py-20 bg-[#f8faff]">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="bg-[#1a73e8] text-white w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
              1
            </div>
            <h3 className="text-xl font-semibold mb-2">Register/Login</h3>
            <p className="text-gray-600">Create an account or log in to access our services.</p>
          </div>
          <div className="text-center">
            <div className="bg-[#1a73e8] text-white w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
              2
            </div>
            <h3 className="text-xl font-semibold mb-2">Explore Tools</h3>
            <p className="text-gray-600">Discover our education and grievance management tools.</p>
          </div>
          <div className="text-center">
            <div className="bg-[#1a73e8] text-white w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
              3
            </div>
            <h3 className="text-xl font-semibold mb-2">Engage Marketplace</h3>
            <p className="text-gray-600">Participate in our book donation and marketplace activities.</p>
          </div>
        </div>
      </div>
    </section>
  )
}

