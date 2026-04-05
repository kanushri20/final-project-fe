import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

const clubs = [
  {
    name: "AI Club",
    icon: "🤖",
    color: "from-blue-500/20 to-blue-500/5 border-blue-500/30",
    iconBg: "bg-blue-500/20",
    accent: "text-blue-400",
    coordinators: ["Dr. Priya Mehta", "Prof. Rahul Sharma"],
    members: 84,
    eventsHosted: 12,
    founded: "2019",
    desc: "To foster innovation in artificial intelligence and machine learning among students, through workshops, hackathons, and research projects.",
    longDesc: "The AI Club at PCCOER is a student-driven community passionate about the cutting edge of technology. We host workshops on ML frameworks, organize hackathons, run reading groups on latest research papers, and collaborate with industry mentors. Whether you're a beginner or an experienced developer, the AI Club has something for you.",
    upcomingEvents: ["AI Hackathon 2026", "ML Workshop Series"],
    tags: ["Machine Learning", "Deep Learning", "NLP", "Computer Vision"],
  },
  {
    name: "Music Club",
    icon: "🎵",
    color: "from-pink-500/20 to-pink-500/5 border-pink-500/30",
    iconBg: "bg-pink-500/20",
    accent: "text-pink-400",
    coordinators: ["Prof. Anjali Desai"],
    members: 60,
    eventsHosted: 8,
    founded: "2017",
    desc: "To create a vibrant musical community that nurtures talent and celebrates diverse genres through regular jams, concerts, and performances.",
    longDesc: "The Music Club is the creative heartbeat of PCCOER. From classical Indian music to western pop and rock, we celebrate all genres. We organize jam sessions, inter-college competitions, Annual Crescendo music fest, and acoustic nights. Every student with a love for music is welcome — instruments provided!",
    upcomingEvents: ["Spring Music Fest", "Battle of Bands"],
    tags: ["Classical", "Western", "Folk", "Acoustic"],
  },
  {
    name: "E-Cell",
    icon: "💡",
    color: "from-yellow-500/20 to-yellow-500/5 border-yellow-500/30",
    iconBg: "bg-yellow-500/20",
    accent: "text-yellow-400",
    coordinators: ["Prof. Vikram Joshi", "Dr. Sneha Patil"],
    members: 110,
    eventsHosted: 15,
    founded: "2018",
    desc: "Entrepreneurship Cell — cultivating the entrepreneurial mindset through startup challenges, mentorship sessions, and networking with industry leaders.",
    longDesc: "E-Cell PCCOER is the launchpad for student entrepreneurs. We connect students with founders, investors, and mentors from the startup ecosystem. Our programs include Startup Weekend, Business Plan Competitions, VC Talks, and the annual E-Summit. We've helped 10+ student startups get off the ground.",
    upcomingEvents: ["E-Summit 2026", "Startup Weekend"],
    tags: ["Startups", "Entrepreneurship", "Innovation", "Leadership"],
  },
  {
    name: "Photography Club",
    icon: "📷",
    color: "from-green-500/20 to-green-500/5 border-green-500/30",
    iconBg: "bg-green-500/20",
    accent: "text-green-400",
    coordinators: ["Prof. Meera Nair"],
    members: 45,
    eventsHosted: 9,
    founded: "2020",
    desc: "To capture the world through different perspectives and develop visual storytelling skills through photo walks, workshops, and exhibitions.",
    longDesc: "The Photography Club is for everyone who sees the world through a lens. We conduct photo walks, editing workshops (Lightroom, Photoshop), street photography sessions, and put up an annual exhibition of student work. We also cover all major college events officially. Beginners and DSLR veterans both welcome.",
    upcomingEvents: ["Photography Walk", "Annual Exhibition"],
    tags: ["Portrait", "Street", "Nature", "Event Photography"],
  },
  {
    name: "InfoSec Club",
    icon: "🔒",
    color: "from-red-500/20 to-red-500/5 border-red-500/30",
    iconBg: "bg-red-500/20",
    accent: "text-red-400",
    coordinators: ["Dr. Arun Kumar", "Prof. Rohit Verma"],
    members: 72,
    eventsHosted: 11,
    founded: "2019",
    desc: "To build a community of ethical hackers and cybersecurity enthusiasts who can protect digital infrastructure through CTFs, workshops, and certifications.",
    longDesc: "InfoSec Club is where future ethical hackers and security engineers are made. We organize Capture The Flag (CTF) competitions, workshops on penetration testing, network security, and secure coding. Our members have won national-level CTFs and gone on to certifications like CEH and OSCP.",
    upcomingEvents: ["CTF Challenge 2026", "Network Security Workshop"],
    tags: ["Ethical Hacking", "CTF", "Network Security", "Cryptography"],
  },
  {
    name: "Literary Club",
    icon: "📚",
    color: "from-purple-500/20 to-purple-500/5 border-purple-500/30",
    iconBg: "bg-purple-500/20",
    accent: "text-purple-400",
    coordinators: ["Prof. Kavitha Rao"],
    members: 38,
    eventsHosted: 7,
    founded: "2016",
    desc: "To ignite the love for literature and creative expression among students through debates, poetry, open mics, and the annual literary festival.",
    longDesc: "The Literary Club is a sanctuary for readers, writers, debaters, and spoken word artists. We host weekly book discussions, inter-college debate tournaments, open mic nights, creative writing contests, and the flagship annual literary festival 'Akshar'. Everyone from a casual reader to an aspiring author finds their tribe here.",
    upcomingEvents: ["Akshar Lit Fest", "Debate Championship"],
    tags: ["Poetry", "Debate", "Creative Writing", "Book Club"],
  },
];

const Clubs = () => {
  const navigate = useNavigate();
  const [selected, setSelected] = useState(null);

  return (
    <div className="min-h-screen bg-[#0B0E13] text-[#E7EBEF]">
      <Navbar />

      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Campus Clubs</h1>
          <p className="text-[#737B8C]">Explore and connect with student organizations at PCCOER</p>
        </div>

        {/* Grid */}
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {clubs.map((club, index) => (
            <div key={index}
              className={`bg-gradient-to-br ${club.color} border rounded-2xl p-6 flex flex-col transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_16px_40px_rgba(249,121,36,0.10)]`}>

              <div className="flex items-start gap-4 mb-4">
                <div className={`w-14 h-14 rounded-xl flex items-center justify-center text-2xl ${club.iconBg}`}>
                  {club.icon}
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold mb-0.5">{club.name}</h3>
                  <div className="flex gap-3 text-xs text-[#737B8C]">
                    <span>👥 {club.members} members</span>
                    <span>📅 {club.eventsHosted} events</span>
                  </div>
                </div>
              </div>

              <p className="text-sm text-[#737B8C] mb-4 flex-1">{club.desc}</p>

              {/* Tags */}
              <div className="flex flex-wrap gap-1.5 mb-5">
                {club.tags.slice(0, 3).map((tag) => (
                  <span key={tag} className="text-xs px-2 py-0.5 rounded-full bg-[#0B0E13]/50 text-[#737B8C]">
                    {tag}
                  </span>
                ))}
              </div>

              <button onClick={() => setSelected(club)}
                className={`flex items-center gap-1 ${club.accent} text-sm font-medium hover:underline`}>
                View Details
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Club Info Modal */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
          onClick={() => setSelected(null)}>
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
          <div className="relative bg-[#12151C] border border-[#252832] rounded-2xl max-w-lg w-full p-6 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}>

            {/* Close */}
            <button onClick={() => setSelected(null)}
              className="absolute top-4 right-4 text-[#737B8C] hover:text-white transition text-xl leading-none">×</button>

            {/* Header */}
            <div className="flex items-center gap-4 mb-6">
              <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-3xl ${selected.iconBg}`}>
                {selected.icon}
              </div>
              <div>
                <h2 className="text-2xl font-bold">{selected.name}</h2>
                <p className="text-xs text-[#737B8C]">Founded {selected.founded}</p>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-3 mb-6">
              {[
                { label: "Members", value: selected.members },
                { label: "Events Hosted", value: selected.eventsHosted },
                { label: "Coordinators", value: selected.coordinators.length },
              ].map((s) => (
                <div key={s.label} className="bg-[#1D212A] rounded-lg p-3 text-center">
                  <div className={`text-xl font-bold ${selected.accent}`}>{s.value}</div>
                  <div className="text-[#737B8C] text-xs mt-0.5">{s.label}</div>
                </div>
              ))}
            </div>

            {/* Description */}
            <p className="text-sm text-[#737B8C] mb-6 leading-relaxed">{selected.longDesc}</p>

            {/* Coordinators */}
            <div className="mb-5">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-[#737B8C] mb-2">Coordinators</h3>
              <div className="space-y-2">
                {selected.coordinators.map((c, i) => (
                  <div key={i} className="flex items-center gap-2 bg-[#1D212A] rounded-lg px-3 py-2">
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${selected.iconBg} ${selected.accent}`}>
                      {c[0]}
                    </div>
                    <span className="text-sm">{c}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Upcoming Events */}
            <div className="mb-6">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-[#737B8C] mb-2">Upcoming Events</h3>
              <div className="space-y-1.5">
                {selected.upcomingEvents.map((ev, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm">
                    <span className="text-[#F97924]">→</span>
                    <span>{ev}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-1.5">
              {selected.tags.map((tag) => (
                <span key={tag} className={`text-xs px-3 py-1 rounded-full border ${selected.color}`}>
                  {tag}
                </span>
              ))}
            </div>

            <button onClick={() => { setSelected(null); navigate("/upcomingevents"); }}
              className="mt-6 w-full py-3 rounded-xl bg-gradient-to-r from-orange-500 to-orange-400 font-semibold text-[#0B0E13] hover:shadow-lg transition">
              View Club Events →
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Clubs;