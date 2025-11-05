import React, { useState, useEffect } from "react";
import axios from "axios";

function Hero() {
    const [studentsData, setStudentsData] = useState([]);
    const [selectedStudentId, setSelectedStudentId] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isAddMode, setIsAddMode] = useState(false);
    const [formData, setFormData] = useState({
        id: "",
        name: "",
        roll_no: "",
        age: "",
        grade: "",
    });

    const [page, setPage] = useState(1);
    const [limit] = useState(10);
    const [totalRecords, setTotalRecords] = useState(0);
    const [sortBy, setSortBy] = useState("id");
    const [sortOrder, setSortOrder] = useState("asc");
    const [searchName, setSearchName] = useState("");
    const [searchGrade, setSearchGrade] = useState("");

    const apiUrl = import.meta.env.VITE_API_URL;
    const access_token = localStorage.getItem("access_token");

    // Fetch Students
    const fetchStudents = async () => {
        try {
            const response = await axios.get(
                `${apiUrl}/students?page=${page}&limit=${limit}&sort_by=${sortBy}&sort_order=${sortOrder}&name=${searchName}&grade=${searchGrade}`,
                {
                    headers: {
                        Authorization: `Bearer ${access_token}`,
                        "Content-Type": "application/json",
                    },
                }
            );

            setStudentsData(response.data.students);
            setTotalRecords(response.data.total_records);
        } catch (error) {
            console.error("Error fetching students:", error);
        }
    };

    useEffect(() => {
        fetchStudents();
    }, [page, sortBy, sortOrder]); // refetch on pagination/sorting

    // Select a row
    const handleSelect = (id) => setSelectedStudentId(id);

    // Delete student
    const handleDelete = async () => {
        if (!selectedStudentId) return alert("Please select a student first!");
        try {
            const response = await axios.delete(
                `${apiUrl}/admin-delete-student/${selectedStudentId}`,
                {
                    headers: {
                        Authorization: `Bearer ${access_token}`,
                        "Content-Type": "application/json",
                    },
                }
            );

            if (response.status === 200) {
                alert("Student deleted successfully!");
                fetchStudents();
            }
        } catch (error) {
            console.error("Error deleting student:", error);
            alert("Authorization error: Need admin access.");
        }
    };

    // Open Add Modal
    const handleAdd = () => {
        setIsAddMode(true);
        setFormData({ id: "", name: "", roll_no: "", age: "", grade: "" });
        setIsModalOpen(true);
    };

    // Open Edit Modal
    const handleEdit = () => {
        if (!selectedStudentId) return alert("Please select a student first!");
        const student = studentsData.find((s) => s.id === selectedStudentId);
        if (student) {
            setIsAddMode(false);
            setFormData(student);
            setIsModalOpen(true);
        }
    };

    // Submit Add/Edit
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (isAddMode) {
                await axios.post(`${apiUrl}/admin-add-student`, formData, {
                    headers: {
                        Authorization: `Bearer ${access_token}`,
                        "Content-Type": "application/json",
                    },
                });
                alert("Student added successfully!");
            } else {
                await axios.put(
                    `${apiUrl}/admin-update-student/${selectedStudentId}`,
                    formData,
                    {
                        headers: {
                            Authorization: `Bearer ${access_token}`,
                            "Content-Type": "application/json",
                        },
                    }
                );
                alert("Student updated successfully!");
            }
            fetchStudents();
            setIsModalOpen(false);
        } catch (error) {
            console.error("Error submitting form:", error);
            alert("Authorization error: Need admin access.");
        }
    };

    // Handle sorting toggle
    const handleSort = (field) => {
        if (sortBy === field) {
            setSortOrder(sortOrder === "asc" ? "desc" : "asc");
        } else {
            setSortBy(field);
            setSortOrder("asc");
        }
    };

    // Handle Search
    const handleSearch = (e) => {
        e.preventDefault();
        setPage(1);
        fetchStudents();
    };

    // Download CSV
    const handleDownloadCSV = () => {
        if (!studentsData || studentsData.length === 0) {
            alert("No data to download!");
            return;
        }

        // CSV Headers
        const headers = ["ID", "Name", "Roll No", "Age", "Grade"];

        // CSV Rows
        const rows = studentsData.map(student => [
            student.id,
            student.name,
            student.roll_no,
            student.age,
            student.grade
        ]);

        // Combine headers and rows
        const csvContent = [
            headers.join(","),
            ...rows.map(row => row.join(","))
        ].join("\n");

        // Create blob and download
        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
        const link = document.createElement("a");
        const url = URL.createObjectURL(blob);

        link.setAttribute("href", url);
        link.setAttribute("download", `students_data_${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = "hidden";

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const totalPages = Math.ceil(totalRecords / limit);

    return (
        <div className="p-2 sm:p-4 md:p-6">
            {/* Search and Actions */}
            <div className="flex flex-col md:flex-row justify-between mb-4 gap-3">
                {/* Search Form */}
                <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
                    <input
                        type="text"
                        placeholder="Search by name"
                        value={searchName}
                        onChange={(e) => setSearchName(e.target.value)}
                        className="input input-bordered input-sm md:input-md w-full sm:w-40 md:w-48"
                    />
                    <input
                        type="text"
                        placeholder="Filter by grade"
                        value={searchGrade}
                        onChange={(e) => setSearchGrade(e.target.value)}
                        className="input input-bordered input-sm md:input-md w-full sm:w-40 md:w-48"
                    />
                    <button className="btn btn-primary btn-sm md:btn-md w-full sm:w-auto" type="submit">
                        Search
                    </button>
                </form>

                {/* Action Buttons */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    <button onClick={handleAdd} className="btn btn-success btn-sm md:btn-md">
                        <span className="hidden md:inline">+ Add Student</span>
                        <span className="md:hidden">+ Add</span>
                    </button>
                    <button onClick={handleEdit} className="btn btn-primary btn-sm md:btn-md">
                        <span className="hidden md:inline">Edit Selected</span>
                        <span className="md:hidden">Edit</span>
                    </button>
                    <button onClick={handleDelete} className="btn btn-error btn-sm md:btn-md">
                        <span className="hidden md:inline">Delete Selected</span>
                        <span className="md:hidden">Delete</span>
                    </button>
                    <button onClick={handleDownloadCSV} className="btn btn-info btn-sm md:btn-md">
                        <span className="hidden md:inline">Download CSV</span>
                        <span className="md:hidden">📥 CSV</span>
                    </button>
                </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto rounded-lg shadow-sm">
                <table className="table table-zebra w-full text-xs sm:text-sm md:text-base">
                    <thead>
                        <tr className="bg-base-200 font-semibold text-xs sm:text-sm md:text-base">
                            <th className="w-8 sm:w-10 md:w-12"></th>
                            {["id", "name", "roll_no", "age", "grade"].map((field) => (
                                <th
                                    key={field}
                                    onClick={() => handleSort(field)}
                                    className="cursor-pointer select-none hover:bg-base-300 transition-colors px-2 md:px-4"
                                >
                                    <span className="hidden md:inline">{field.replace('_', ' ').toUpperCase()}</span>
                                    <span className="md:hidden">{field === 'roll_no' ? 'ROLL' : field.toUpperCase()}</span>
                                    {" "}
                                    {sortBy === field ? (sortOrder === "asc" ? "▲" : "▼") : ""}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {studentsData && studentsData.length > 0 ? (
                            studentsData.map((student) => (
                                <tr
                                    key={student.id}
                                    onClick={() => handleSelect(student.id)}
                                    className={`cursor-pointer hover:bg-base-200 transition-colors ${selectedStudentId === student.id
                                        ? "bg-blue-100 dark:bg-blue-900 border-l-4 border-blue-500"
                                        : ""
                                        }`}
                                >
                                    <td className="w-8 sm:w-10 md:w-12">
                                        <input
                                            type="radio"
                                            name="selectedStudent"
                                            checked={selectedStudentId === student.id}
                                            onChange={() => handleSelect(student.id)}
                                            className="radio radio-primary radio-xs sm:radio-sm md:radio-md"
                                        />
                                    </td>
                                    <td className="font-medium px-2 md:px-4">{student.id}</td>
                                    <td className="truncate max-w-[80px] sm:max-w-[120px] md:max-w-[200px] lg:max-w-none px-2 md:px-4" title={student.name}>
                                        {student.name}
                                    </td>
                                    <td className="px-2 md:px-4">{student.roll_no}</td>
                                    <td className="px-2 md:px-4">{student.age}</td>
                                    <td className="font-semibold px-2 md:px-4">{student.grade}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="6" className="text-center text-gray-500 py-8">
                                    No student data available
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            <div className="flex flex-col sm:flex-row justify-between items-center mt-4 gap-3">
                <p className="text-xs sm:text-sm md:text-base text-gray-500 order-2 sm:order-1">
                    Page {page} of {totalPages}
                    <span className="hidden md:inline"> ({totalRecords} records)</span>
                </p>
                <div className="flex gap-2 order-1 sm:order-2">
                    <button
                        className="btn btn-outline btn-sm md:btn-md"
                        disabled={page <= 1}
                        onClick={() => setPage(page - 1)}
                    >
                        <span className="hidden md:inline">Previous</span>
                        <span className="md:hidden">Prev</span>
                    </button>
                    <span className="flex items-center px-3 md:px-4 font-semibold text-sm md:text-base bg-base-200 rounded-lg">
                        {page}
                    </span>
                    <button
                        className="btn btn-outline btn-sm md:btn-md"
                        disabled={page >= totalPages}
                        onClick={() => setPage(page + 1)}
                    >
                        Next
                    </button>
                </div>
            </div>

            {/* Modal */}
            {isModalOpen && (
                <dialog open className="modal">
                    <div className="modal-box w-11/12 max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl">
                        <h3 className="font-bold text-base sm:text-lg md:text-xl mb-4">
                            {isAddMode ? "Add New Student" : "Edit Student"}
                        </h3>

                        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                            {["id", "name", "roll_no", "age", "grade"].map((field) => (
                                <div key={field} className="form-control">
                                    <label className="label">
                                        <span className="label-text text-xs sm:text-sm font-medium">
                                            {field.replace('_', ' ').toUpperCase()}
                                        </span>
                                    </label>
                                    <input
                                        type={field === "name" || field === "grade" ? "text" : "number"}
                                        placeholder={field.replace('_', ' ').toUpperCase()}
                                        value={formData[field]}
                                        onChange={(e) =>
                                            setFormData({ ...formData, [field]: e.target.value })
                                        }
                                        className="input input-bordered input-sm sm:input-md w-full"
                                        required
                                        disabled={!isAddMode && field === "id"}
                                    />
                                </div>
                            ))}

                            <div className="flex flex-col sm:flex-row justify-end gap-2 mt-4">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="btn btn-outline btn-sm sm:btn-md w-full sm:w-auto order-2 sm:order-1"
                                >
                                    Cancel
                                </button>
                                <button type="submit" className="btn btn-primary btn-sm sm:btn-md w-full sm:w-auto order-1 sm:order-2">
                                    {isAddMode ? "Add Student" : "Save Changes"}
                                </button>
                            </div>
                        </form>
                    </div>
                </dialog>
            )}
        </div>
    );
}

export default Hero;
