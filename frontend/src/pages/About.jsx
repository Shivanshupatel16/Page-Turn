import { motion } from 'framer-motion';
import { BookOpenIcon, AcademicCapIcon, GlobeAltIcon, PhoneIcon, EnvelopeIcon } from '@heroicons/react/24/outline';

const AboutPage = () => {
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-gradient-to-br from-slate-800 to-slate-900 text-white py-20">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-6xl mx-auto px-4 text-center"
        >
          <BookOpenIcon className="h-16 w-16 mx-auto text-emerald-400" />
          <h1 className="text-4xl font-bold mt-6 mb-4">About PageTurn</h1>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto">
            Revolutionizing textbook exchange for sustainable education
          </p>
        </motion.div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-16">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="grid md:grid-cols-2 gap-12"
        >
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-slate-800 mb-4">Our Mission</h2>
            <p className="text-slate-600 leading-relaxed">
              At PageTurn, we're committed to creating an sustainable academic ecosystem by 
              connecting students through textbook sharing. Since 2023, we've facilitated
              the exchange of over 50,000 books, saving students $1.2M+ while reducing
              academic waste.
            </p>
            
            <div className="grid grid-cols-2 gap-4 mt-8">
              {[
                { icon: BookOpenIcon, title: "Books Shared", value: "50K+" },
                { icon: AcademicCapIcon, title: "Campuses", value: "120+" },
                { icon: GlobeAltIcon, title: "CO₂ Saved", value: "12T" },
              ].map((stat, idx) => (
                <motion.div 
                  key={idx}
                  whileHover={{ y: -5 }}
                  className="bg-white p-6 rounded-xl shadow-sm border border-slate-200"
                >
                  <stat.icon className="h-8 w-8 text-emerald-500 mb-3" />
                  <h3 className="text-2xl font-bold text-slate-800">{stat.value}</h3>
                  <p className="text-slate-600">{stat.title}</p>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-slate-800 mb-4">The Team</h2>
            <div className="grid grid-cols-2 gap-4">
              {['Leadership', 'Support', 'Tech', 'Community'].map((team, idx) => (
                <motion.div
                  key={idx}
                  whileHover={{ scale: 1.02 }}
                  className="bg-white p-6 rounded-xl shadow-sm border border-slate-200"
                >
                  <div className="h-40 bg-slate-100 rounded-lg mb-4 flex items-center justify-center">
                    <AcademicCapIcon className="h-12 w-12 text-slate-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-800">{team} Team</h3>
                  <p className="text-slate-600 text-sm">Dedicated professionals</p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      <div className="bg-white py-16">
        <div className="max-w-6xl mx-auto px-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid md:grid-cols-2 gap-12"
          >
            <div className="space-y-6">
              <h2 className="text-3xl font-bold text-slate-800">Get in Touch</h2>
              <form className="space-y-4">
                <div>
                  <input 
                    type="text" 
                    placeholder="Your Name"
                    className="w-full p-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-emerald-400"
                  />
                </div>
                <div>
                  <input 
                    type="email" 
                    placeholder="Email Address"
                    className="w-full p-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-emerald-400"
                  />
                </div>
                <div>
                  <textarea
                    rows="4"
                    placeholder="Message"
                    className="w-full p-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-emerald-400"
                  />
                </div>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  className="w-full bg-emerald-500 text-white py-3 rounded-lg font-medium"
                >
                  Send Message
                </motion.button>
              </form>
            </div>
            <div className="space-y-8">
              <div className="bg-emerald-50 p-8 rounded-xl">
                <h3 className="text-xl font-semibold text-slate-800 mb-6">Contact Information</h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-white rounded-lg shadow-sm">
                      <GlobeAltIcon className="h-6 w-6 text-emerald-500" />
                    </div>
                    <div>
                      <p className="font-medium text-slate-800">Headquarters</p>
                      <p className="text-slate-600">123 Campus Drive<br/>Academic City, AC 12345</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-white rounded-lg shadow-sm">
                      <PhoneIcon className="h-6 w-6 text-emerald-500" />
                    </div>
                    <div>
                      <p className="font-medium text-slate-800">Phone</p>
                      <p className="text-slate-600">(555) 123-4567</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-white rounded-lg shadow-sm">
                      <EnvelopeIcon className="h-6 w-6 text-emerald-500" />
                    </div>
                    <div>
                      <p className="font-medium text-slate-800">Email</p>
                      <p className="text-slate-600">contact@pageturn.edu</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Social Proof */}
              <div className="bg-slate-800 text-white p-8 rounded-xl">
                <h3 className="text-xl font-semibold mb-4">Partner Universities</h3>
                <div className="grid grid-cols-3 gap-4 opacity-75">
                  {['KIET', 'AKGEC', 'ABES', 'GLA', 'SRM', 'BBD'].map((uni, idx) => (
                    <div key={idx} className="h-12 bg-slate-700 rounded-lg flex items-center justify-center">
                      {uni}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;