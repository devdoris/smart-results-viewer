import { useEffect, useState } from "react";
import axios from "axios";
import ScoreChart from "./components/ScoreChart";
import jsPDF from "jspdf";
function App() {
  const [students, setStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch students from JSON server
  useEffect(() => {
    axios
      .get("/data.json")
      .then((res) => setStudents(res.data))
      .catch((err) => console.error(err));
  }, []);

  const filteredStudents = students.filter(
    (s) =>
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.course.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.semester.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // CSV Export
  const exportCSV = () => {
    const csvRows = [
      ["Name", "Course", "Score"],
      ...filteredStudents.map((s) => [s.name, s.course, s.score]),
    ];
    const csvContent = csvRows.map((e) => e.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "students.csv");
    link.click();
  };

  // PDF Export
  const exportPDF = () => {
    const doc = new jsPDF();

    // Title
    doc.setFontSize(18);
    doc.text("Student Results", 14, 15);

    <div className="max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
      <div className="bg-white p-4 rounded-xl shadow text-center">
        <p className="text-gray-500">Total Students</p>
        <h2 className="text-2xl font-bold">{filteredStudents.length}</h2>
      </div>

      <div className="bg-white p-4 rounded-xl shadow text-center">
        <p className="text-gray-500">Average Score</p>
        <h2 className="text-2xl font-bold">{averageScore.toFixed(1)}</h2>
      </div>

      <div className="bg-white p-4 rounded-xl shadow text-center">
        <p className="text-gray-500">Highest Score</p>
        <h2 className="text-2xl font-bold">{highestScore}</h2>
      </div>
    </div>

    // Table columns
    const columns = ["Name", "Course", "Score"];
    const startY = 25; // table starts below title
    const rowHeight = 10;
    const colWidth = [70, 70, 30]; // adjust widths for columns

    // Draw header
    doc.setFontSize(12);
    doc.setTextColor(255, 255, 255);
    doc.setFillColor(59, 130, 246); // Tailwind blue
    let x = 14;
    let y = startY;
    columns.forEach((col, i) => {
      doc.rect(x, y, colWidth[i], rowHeight, "F");
      doc.text(col, x + 2, y + 7);
      x += colWidth[i];
    });

    // Draw rows
    let rowY = y + rowHeight;
    doc.setTextColor(0, 0, 0);
    filteredStudents.forEach((s, index) => {
      let rowX = 14;
      const rowData = [s.name, s.course, s.score.toString()];
      rowData.forEach((cell, i) => {
        // Alternating row colors
        if (index % 2 === 0) {
          doc.setFillColor(245, 245, 245);
          doc.rect(rowX, rowY, colWidth[i], rowHeight, "F");
        }
        doc.text(cell, rowX + 2, rowY + 7);
        rowX += colWidth[i];
      });
      rowY += rowHeight;
    });

    doc.save("students.pdf");
  };

  const getGrade = (score) => {
    if (score >= 70) return "A";
    if (score >= 60) return "B";
    if (score >= 50) return "C";
    return "F";
  };

  const getGradeColor = (score) => {
    if (score >= 70) return "text-green-600";
    if (score >= 60) return "text-blue-400";
    if (score >= 50) return "text-yellow-500";
    return "text-red-500";
  };

  const getInsight = (score) => {
    if (score >= 70) return "Excellent performance 🎉";
    if (score >= 60) return "Better, but can improve 👌";
    if (score >= 50) return "Good, but can improve 👍";
    return "Needs serious improvement ⚠️";
  };

  const averageScore =
    filteredStudents.reduce((acc, s) => acc + s.score, 0) /
    (filteredStudents.length || 1);

  const highestScore = Math.max(...filteredStudents.map((s) => s.score), 0);
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-4xl font-bold text-center mb-8 bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
        Smart Results Dashboard
      </h1>

      {/* Controls Card */}
      <div className="max-w-4xl mx-auto bg-white shadow-xl rounded-2xl p-6 mb-6">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 gap-4">
          <input
            type="text"
            placeholder="Search by name or course..."
            className="flex-1 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          <div className="flex gap-3">
            <button
              onClick={exportCSV}
              className="px-4 py-2 bg-green-500 text-white rounded-lg shadow hover:bg-green-600 transition"
            >
              Export CSV
            </button>
            <button
              onClick={exportPDF}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg shadow hover:bg-blue-600 transition"
            >
              Export PDF
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse rounded-lg">
            <thead>
              <tr className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
                <th className="p-3 text-left">Name</th>
                <th className="p-3 text-left">Course</th>
                <th className="p-3 text-left">Semester</th>
                <th className="p-3 text-left">Score</th>
                <th className="p-3 text-left">Grade</th>
                <th className="p-3 text-left">Insight</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.map((s) => (
                <tr key={s.id} className="border-b hover:bg-gray-100 transition">
                  <td className="p-3">{s.name}</td>
                  <td className="p-3">{s.course}</td>
                  <td className="p-3">{s.semester}</td>

                  <td className="p-3">{s.score}</td>

                  <td className={`p-3 font-bold ${getGradeColor(s.score)}`}>
                    {getGrade(s.score)}
                  </td>

                  <td className="p-3 text-sm">{getInsight(s.score)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Chart Card */}
      <div className="max-w-4xl mx-auto bg-white shadow-xl rounded-2xl p-6">
        <ScoreChart students={filteredStudents} />
      </div>
    </div>
  );
}

export default App;