import React, { useEffect, useRef, useState } from "react";

const TEMPLATES = [
  { bg: ["#1E3A8A", "#7C3AED"], accent: "#FFFFFF", sub: "#A5B4FC" },
  { bg: ["#F59E0B", "#EF4444"], accent: "#FFFFFF", sub: "#FEF3C7" },
  { bg: ["#111827", "#030712"], accent: "#F97924", sub: "#9CA3AF" },
  { bg: ["#EC4899", "#22D3EE"], accent: "#FFFFFF", sub: "#FDF4FF" },
];

const CreatePoster = () => {
  const canvasRef = useRef(null);

  const [form, setForm] = useState({
    name: "",
    tagline: "",
    date: "",
    venue: "",
    time: "",
    organizer: "",
    desc: "",
  });

  const [template, setTemplate] = useState(0);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // DRAW CANVAS
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const W = canvas.width;
    const H = canvas.height;

    const T = TEMPLATES[template];

    // background
    const grad = ctx.createLinearGradient(0, 0, W, H);
    grad.addColorStop(0, T.bg[0]);
    grad.addColorStop(1, T.bg[1]);
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, W, H);

    // circles
    ctx.globalAlpha = 0.15;
    ctx.fillStyle = T.accent;
    ctx.beginPath();
    ctx.arc(W * 0.85, H * 0.12, 80, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(W * 0.1, H * 0.85, 60, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1;

    // event name
    ctx.fillStyle = T.accent;
    ctx.font = "bold 28px sans-serif";
    ctx.fillText(form.name || "Event Name", 30, 180);

    // tagline
    ctx.fillStyle = T.sub;
    ctx.font = "16px sans-serif";
    ctx.fillText(form.tagline || "Your tagline here", 30, 220);

    // details
    ctx.fillStyle = T.accent;
    ctx.font = "12px sans-serif";

    const date = form.date
      ? new Date(form.date).toLocaleDateString("en-IN")
      : "Date TBD";

    ctx.fillText(`📅 ${date} ${form.time}`, 30, 300);
    ctx.fillText(`📍 ${form.venue || "Venue TBD"}`, 30, 320);

    // description
    if (form.desc) {
      ctx.fillStyle = T.sub;
      ctx.fillText(form.desc, 30, 350);
    }

    // footer
    ctx.fillStyle = "#F97924";
    ctx.fillText("EventHub", 30, H - 30);
  }, [form, template]);

  const downloadPoster = () => {
    const link = document.createElement("a");
    link.download = (form.name || "EventPoster") + ".png";
    link.href = canvasRef.current.toDataURL();
    link.click();
  };

  return (
    <div className="min-h-screen bg-[#0B0E13] text-white p-6">
      <div className="max-w-6xl mx-auto">

        <h1 className="text-3xl font-bold mb-2">Create Event Poster</h1>
        <p className="text-gray-400 mb-6">
          Design a professional poster for your event
        </p>

        <div className="grid md:grid-cols-2 gap-6">

          {/* LEFT */}
          <div className="space-y-6">

            <div className="bg-[#12151C] p-6 rounded-xl border border-[#1D212A] space-y-4">
              <input name="name" placeholder="Event Name" onChange={handleChange}
                className="w-full p-3 rounded bg-[#1D212A]" />

              <input name="tagline" placeholder="Tagline" onChange={handleChange}
                className="w-full p-3 rounded bg-[#1D212A]" />

              <div className="grid grid-cols-2 gap-3">
                <input type="date" name="date" onChange={handleChange}
                  className="p-3 rounded bg-[#1D212A]" />
                <input name="venue" placeholder="Venue" onChange={handleChange}
                  className="p-3 rounded bg-[#1D212A]" />
              </div>

              <input type="time" name="time" onChange={handleChange}
                className="w-full p-3 rounded bg-[#1D212A]" />

              <input name="organizer" placeholder="Organizer"
                onChange={handleChange}
                className="w-full p-3 rounded bg-[#1D212A]" />

              <textarea name="desc" placeholder="Description"
                onChange={handleChange}
                className="w-full p-3 rounded bg-[#1D212A]" />
            </div>

            {/* Templates */}
            <div className="grid grid-cols-2 gap-3">
              {TEMPLATES.map((t, i) => (
                <div
                  key={i}
                  onClick={() => setTemplate(i)}
                  className={`h-24 rounded-lg cursor-pointer flex items-end p-3 text-xs font-bold ${
                    template === i ? "border-2 border-orange-500" : ""
                  }`}
                  style={{
                    background: `linear-gradient(135deg, ${t.bg[0]}, ${t.bg[1]})`,
                  }}
                >
                  Template {i + 1}
                </div>
              ))}
            </div>

            <button
              onClick={downloadPoster}
              className="w-full py-3 bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg font-semibold"
            >
              Download Poster
            </button>
          </div>

          {/* RIGHT */}
          <div className="bg-[#12151C] p-6 rounded-xl border border-[#1D212A] flex justify-center">
            <canvas
              ref={canvasRef}
              width={360}
              height={540}
              className="rounded-lg border border-gray-700"
            />
          </div>

        </div>
      </div>
    </div>
  );
};  

export default CreatePoster;