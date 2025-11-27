import { BarChart, Target, Zap } from 'lucide-react';

const heroImageUrl = 'https://storage.googleapis.com/dala-prod-public-storage/generated-images/45976324-34f6-4205-bcc4-56ccf3f0e2bd/skillworth-hero-3d61s7t-1764248990731.webp';
const founderImageUrl = 'https://storage.googleapis.com/dala-prod-public-storage/generated-images/45976324-34f6-4205-bcc4-56ccf3f0e2bd/skillworth-founder-1fulgqa-1764248997902.webp';

export default function Home() {
  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section 
        className="relative bg-cover bg-center text-white py-40 px-6"
        style={{ backgroundImage: `url(${heroImageUrl})` }}
      >
        <div className="absolute inset-0 bg-black opacity-50"></div>
        <div className="relative container mx-auto text-center">
          <h1 className="text-5xl font-extrabold mb-4 leading-tight">SkillWorth</h1>
          <p className="text-2xl font-light mb-8">Your Net Worth is Your Skillset.</p>
          <div className="space-x-4">
            <a href="#" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-full transition-transform transform hover:scale-105 duration-300">Find Your Mentor</a>
            <a href="#" className="bg-transparent border-2 border-white hover:bg-white hover:text-blue-600 text-white font-bold py-3 px-8 rounded-full transition duration-300">Become a Mentor</a>
          </div>
        </div>
      </section>

      {/* Problem & Solution Section */}
      <section className="py-20 px-6 bg-gray-50">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            {/* The Problem */}
            <div className="bg-red-50 p-8 rounded-lg shadow-lg">
              <h2 className="text-3xl font-bold text-red-800 mb-6">The Problem with EdTech Today</h2>
              <p className="text-gray-700 mb-4">Traditional EdTech focuses on course completion, not career outcomes. This leaves a critical gap between acquired skills and job market demands, especially in Africa.</p>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-start"><span className="font-bold text-red-600 mr-2">-</span>Lack of measurable ROI for learners.</li>
                <li className="flex items-start"><span className="font-bold text-red-600 mr-2">-</span>Ineffective, unvetted mentorship.</li>
                <li className="flex items-start"><span className="font-bold text-red-600 mr-2">-</span>Focus on theoretical knowledge over practical, analytical thinking.</li>
              </ul>
            </div>

            {/* The Solution */}
            <div className="bg-green-50 p-8 rounded-lg shadow-lg">
              <h2 className="text-3xl font-bold text-green-800 mb-6">SkillWorth's Analytical Solution</h2>
              <p className="text-gray-700 mb-4">We bridge the gap with a data-driven platform that makes career success predictable and measurable.</p>
              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="bg-green-200 p-3 rounded-full mr-4"><BarChart className="text-green-800" size={24} /></div>
                  <div>
                    <h3 className="font-bold text-lg text-green-900">Predictive Placement Score</h3>
                    <p className="text-gray-600">Analytics to forecast a learner's job-readiness.</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="bg-green-200 p-3 rounded-full mr-4"><Target className="text-green-800" size={24} /></div>
                  <div>
                    <h3 className="font-bold text-lg text-green-900">Measurable Mentor Efficacy</h3>
                    <p className="text-gray-600">Data-backed insights into mentor effectiveness.</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="bg-green-200 p-3 rounded-full mr-4"><Zap className="text-green-800" size={24} /></div>
                  <div>
                    <h3 className="font-bold text-lg text-green-900">Analytical Thinking Focus</h3>
                    <p className="text-gray-600">Training the most in-demand skill for today's jobs.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Founder's Story Section */}
      <section className="py-20 px-6 bg-white">
        <div className="container mx-auto max-w-4xl text-center">
            <img src={founderImageUrl} alt="Founder of SkillWorth" className="w-32 h-32 rounded-full mx-auto mb-6 shadow-xl"/>
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Our Founder's Vision</h2>
            <div className="text-xl text-gray-600 italic leading-relaxed border-l-4 border-blue-500 pl-6">
              <p>"I saw brilliant minds across Africa struggle to translate their education into meaningful careers. SkillWorth was born from a desire to replace guesswork with certainty, using data to light a clear, predictable path from learning to earning."</p>
            </div>
        </div>
      </section>

    </div>
  );
}