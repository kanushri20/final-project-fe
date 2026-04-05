import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import CoordinatorNavbar from "../components/CoordinatorNavbar";

const BASE_URL = "https://final-project-be-o1ei.vercel.app";

const CoordinatorDashboard = () => {
  const navigate = useNavigate();
  const [coordinator, setCoordinator] = useState(null);
  const [statEvents, setStatEvents] = useState(0);
  const [statStudents, setStatStudents] = useState(0);
  const [statFeedback] = useState(0); // feedback endpoint not yet active
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Auth guard
    const stored = localStorage.getItem("coordinator");
    if (!stored) {
      navigate("/coordinatorlogin");
      return;
    }
    setCoordinator(JSON.parse(stored));
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      // Fetch events count
      const eventsRes = await fetch(`${BASE_URL}/events`);
      const events = await eventsRes.json();
      setStatEvents(events.length);

      // Fetch all users and count students
      const usersRes = await fetch(`${BASE_URL}/register`);
      const users = await usersRes.json();
      const students = users.filter((u) => u.role === "student");
      setStatStudents(students.length);
    } catch (err) {
      console.error("Failed to fetch stats:", err);
    } finally {
      setLoading(false);
    }
  };

  const dashCards = [
    {
      title: "Manage Events",
      desc: "Create, edit, and delete club events. Set capacity, schedule, and details.",
      iconBg: "bg-[rgba(249,121,36,0.15)]",
      iconBorder: "border-[rgba(249,121,36,0.2)]",
      iconColor: "text-[#F97924]",
      link: "/manageevents",
      actionText: "Go to Events",
    },
    {
      title: "Create Poster",
      desc: "Design and generate professional event posters with custom templates.",
      iconBg: "bg-[rgba(236,72,153,0.15)]",
      iconBorder: "border-[rgba(236,72,153,0.2)]",
      iconColor: "text-[#F472B6]",
      link: "/createposter",
      actionText: "Design Poster",
    },
    {
      title: "Budget Documentation",
      desc: "Track expenses, add budget items, and export official PDF budget reports.",
      iconBg: "bg-[rgba(245,158,11,0.15)]",
      iconBorder: "border-[rgba(245,158,11,0.2)]",
      iconColor: "text-[#FBBF24]",
      link: "/budgetdocumentation",
      actionText: "Manage Budget",
    },
    {
      title: "Student Feedback",
      desc: "View ratings and feedback submitted by students for your events.",
      iconBg: "bg-[rgba(16,185,129,0.15)]",
      iconBorder: "border-[rgba(16,185,129,0.2)]",
      iconColor: "text-[#34D399]",
      link: "/studentfeedback",
      actionText: "View Feedback",
    },
    {
      title: "Notify Students",
      desc: "Send targeted notifications to students by year and department.",
      iconBg: "bg-[rgba(59,130,246,0.15)]",
      iconBorder: "border-[rgba(59,130,246,0.2)]",
      iconColor: "text-[#60A5FA]",
      link: "/notifystudent",
      actionText: "Send Notification",
    },
    {
      title: "Registered Students",
      desc: "View registered members, mark attendance, and access detailed analytics.",
      iconBg: "bg-[rgba(167,85,247,0.15)]",
      iconBorder: "border-[rgba(167,85,247,0.2)]",
      iconColor: "text-[#C084FC]",
      link: "/studentanalytics",
      actionText: "View Students",
    },
  ];

  return (
    <div className="min-h-screen bg-[#0B0E13] text-[#E7EBEF]">
      <CoordinatorNavbar active="dashboard" />

      <div className="max-w-[1280px] mx-auto px-6 py-8">
        <div className="mb-8">
          <p className="text-[#737B8C] text-sm mb-1">Welcome back,</p>
          <h1 className="font-syne text-3xl font-bold">
            {coordinator?.name || "Coordinator"} Dashboard
          </h1>
          <p className="text-[#737B8C] mt-1">
            Manage all aspects of your club events from here.
          </p>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-[rgba(18,21,28,0.85)] rounded-xl border border-[rgba(37,40,50,0.5)] p-6 text-center">
            <div className="text-3xl font-bold text-[#F97924]">
              {loading ? "—" : statEvents}
            </div>
            <div className="text-[#737B8C] text-sm mt-1">Active Events</div>
          </div>
          <div className="bg-[rgba(18,21,28,0.85)] rounded-xl border border-[rgba(37,40,50,0.5)] p-6 text-center">
            <div className="text-3xl font-bold text-[#F97924]">
              {loading ? "—" : statStudents}
            </div>
            <div className="text-[#737B8C] text-sm mt-1">Registered Students</div>
          </div>
          <div className="bg-[rgba(18,21,28,0.85)] rounded-xl border border-[rgba(37,40,50,0.5)] p-6 text-center">
            <div className="text-3xl font-bold text-[#F97924]">{statFeedback}</div>
            <div className="text-[#737B8C] text-sm mt-1">Feedback Received</div>
          </div>
        </div>

        {/* Action Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {dashCards.map((card, idx) => (
            <a
              key={idx}
              href={card.link}
              className="bg-[rgba(18,21,28,0.85)] rounded-xl border border-[rgba(37,40,50,0.5)] p-6 flex flex-col gap-3 transition-transform transform hover:-translate-y-2 hover:shadow-[0_16px_40px_rgba(249,121,36,0.15)] hover:border-[rgba(249,121,36,0.25)] duration-300"
            >
              <div className={`w-14 h-14 rounded-xl flex items-center justify-center ${card.iconBg} border ${card.iconBorder} mb-4`}>
                <svg className={`w-6 h-6 ${card.iconColor}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8"
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold">{card.title}</h3>
              <p className="text-[#737B8C] flex-1 text-sm">{card.desc}</p>
              <div className="flex items-center gap-1 mt-4 text-sm font-medium" style={{ color: card.iconColor }}>
                {card.actionText}{" "}
                <svg className="w-3.5 h-3.5 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CoordinatorDashboard;