import { useEffect, useRef, useState } from "react";
import Chart from "chart.js/auto";

const BASE_URL = "https://final-project-be-o1ei.vercel.app";

export default function Analytics() {
  const yearRef = useRef(null);
  const deptRef = useRef(null);
  const divRef = useRef(null);
  const attendRef = useRef(null);
  const charts = useRef({});

  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch real students from backend
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const res = await fetch(`${BASE_URL}/register`);
        const data = await res.json();
        // Filter only students
        const studentList = data.filter((u) => u.role === "student");
        setStudents(studentList);
      } catch (err) {
        console.error("Failed to fetch students:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchStudents();
  }, []);

  // Render charts when students data loads
  useEffect(() => {
    if (!students.length) return;

    // Destroy old charts
    Object.values(charts.current).forEach((chart) => chart.destroy());

    const YEARS = ["1st", "2nd", "3rd", "4th"];
    const DEPTS = ["CSE", "IT", "ECE", "ME", "Civil", "EEE"];
    const DIVS = ["A", "B", "C", "D"];

    const attended = students.filter((s) => s.attended).length;

    charts.current.year = new Chart(yearRef.current, {
      type: "bar",
      data: {
        labels: YEARS,
        datasets: [{
          label: "Students",
          data: YEARS.map((y) => students.filter((s) => s.year === y).length),
          backgroundColor: "rgba(249,121,36,0.7)",
        }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { labels: { color: "#E7EBEF" } } },
        scales: {
          x: { ticks: { color: "#737B8C" }, grid: { color: "#1D212A" } },
          y: { ticks: { color: "#737B8C" }, grid: { color: "#1D212A" } },
        },
      },
    });

    charts.current.dept = new Chart(deptRef.current, {
      type: "doughnut",
      data: {
        labels: DEPTS,
        datasets: [{
          data: DEPTS.map((d) => students.filter((s) => s.department === d).length),
          backgroundColor: ["#F97924","#60A5FA","#34D399","#F472B6","#FBBF24","#C084FC"],
        }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { labels: { color: "#E7EBEF" } } },
      },
    });

    charts.current.div = new Chart(divRef.current, {
      type: "bar",
      data: {
        labels: DIVS,
        datasets: [{
          label: "Students",
          data: DIVS.map((d) => students.filter((s) => s.division === d).length),
          backgroundColor: "rgba(96,165,250,0.7)",
        }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { labels: { color: "#E7EBEF" } } },
        scales: {
          x: { ticks: { color: "#737B8C" }, grid: { color: "#1D212A" } },
          y: { ticks: { color: "#737B8C" }, grid: { color: "#1D212A" } },
        },
      },
    });

    charts.current.attend = new Chart(attendRef.current, {
      type: "pie",
      data: {
        labels: ["Attended", "Absent"],
        datasets: [{
          data: [attended, students.length - attended],
          backgroundColor: ["#34D399", "#EF4444"],
        }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { labels: { color: "#E7EBEF" } } },
      },
    });
  }, [students]);

  const attended = students.filter((s) => s.attended).length;

  return (
    <div className="min-h-screen bg-[#0B0E13] text-white p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Student Analytics</h1>
          <p className="text-gray-400">Real-time breakdown of registrations</p>
        </div>

        {loading ? (
          <p className="text-[#737B8C] text-center">Loading analytics...</p>
        ) : (
          <>
            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <Stat title="Total Registered" value={students.length} />
              <Stat title="Attended" value={attended} />
              <Stat title="Absent" value={students.length - attended} />
              <Stat
                title="Attendance Rate"
                value={
                  students.length
                    ? Math.round((attended / students.length) * 100) + "%"
                    : "0%"
                }
              />
            </div>

            {/* Charts */}
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <ChartCard title="Year-wise Distribution">
                <canvas ref={yearRef}></canvas>
              </ChartCard>
              <ChartCard title="Department-wise Distribution">
                <canvas ref={deptRef}></canvas>
              </ChartCard>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <ChartCard title="Division-wise Distribution">
                <canvas ref={divRef}></canvas>
              </ChartCard>
              <ChartCard title="Attendance Overview">
                <canvas ref={attendRef}></canvas>
              </ChartCard>
            </div>

            {students.length === 0 && (
              <p className="text-center text-gray-500 mt-10">
                No student data available yet.
              </p>
            )}
          </>
        )}
      </div>
    </div>
  );
}

function Stat({ title, value }) {
  return (
    <div className="bg-[#12151C] border border-[#252832] rounded-xl p-4 text-center">
      <div className="text-xl font-bold text-orange-400">{value}</div>
      <div className="text-xs text-gray-400 mt-1">{title}</div>
    </div>
  );
}

function ChartCard({ title, children }) {
  return (
    <div className="bg-[#12151C] border border-[#252832] rounded-xl p-4">
      <h2 className="mb-4 font-semibold">{title}</h2>
      <div className="h-64">{children}</div>
    </div>
  );
}