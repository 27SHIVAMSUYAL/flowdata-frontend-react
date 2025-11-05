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

    const totalPages = Math.ceil(totalRecords / limit);

    return (
        <div className="p-4">
            {/* Search and Actions */}
            <div className="flex flex-wrap justify-between mb-4 items-center gap-3">
                <form onSubmit={handleSearch} className="flex gap-2">
                    <input
                        type="text"
                        placeholder="Search by name"
                        value={searchName}
                        onChange={(e) => setSearchName(e.target.value)}
                        className="input input-bordered"
                    />
                    <input
                        type="text"
                        placeholder="Filter by grade"
                        value={searchGrade}
                        onChange={(e) => setSearchGrade(e.target.value)}
                        className="input input-bordered"
                    />
                    <button className="btn btn-primary" type="submit">
                        Search
                    </button>
                </form>

                <div className="flex gap-2">
                    <button onClick={handleAdd} className="btn btn-success btn-sm">
                        + Add Student
                    </button>
                    <button onClick={handleEdit} className="btn btn-primary btn-sm">
                        Edit Selected
                    </button>
                    <button onClick={handleDelete} className="btn btn-error btn-sm">
                        Delete Selected
                    </button>
                </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
                <table className="table table-zebra w-full">
                    <thead>
                        <tr className="bg-base-200 font-semibold text-base">
                            <th></th>
                            {["id", "name", "roll_no", "age", "grade"].map((field) => (
                                <th
                                    key={field}
                                    onClick={() => handleSort(field)}
                                    className="cursor-pointer select-none"
                                >
                                    {field.toUpperCase()}{" "}
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
                                    className={`cursor-pointer ${selectedStudentId === student.id
                                            ? "bg-blue-100 border-l-4 border-blue-500"
                                            : ""
                                        }`}
                                >
                                    <td>
                                        <input
                                            type="radio"
                                            name="selectedStudent"
                                            checked={selectedStudentId === student.id}
                                            onChange={() => handleSelect(student.id)}
                                            className="radio radio-primary"
                                        />
                                    </td>
                                    <td>{student.id}</td>
                                    <td>{student.name}</td>
                                    <td>{student.roll_no}</td>
                                    <td>{student.age}</td>
                                    <td>{student.grade}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="6" className="text-center text-gray-500">
                                    No student data available
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            <div className="flex justify-between items-center mt-4">
                <p className="text-sm text-gray-500">
                    Page {page} of {totalPages} ({totalRecords} records)
                </p>
                <div className="flex gap-2">
                    <button
                        className="btn btn-outline btn-sm"
                        disabled={page <= 1}
                        onClick={() => setPage(page - 1)}
                    >
                        Prev
                    </button>
                    <button
                        className="btn btn-outline btn-sm"
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
                    <div className="modal-box">
                        <h3 className="font-bold text-lg mb-3">
                            {isAddMode ? "Add New Student" : "Edit Student"}
                        </h3>

                        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                            {["id", "name", "roll_no", "age", "grade"].map((field) => (
                                <input
                                    key={field}
                                    type={field === "name" || field === "grade" ? "text" : "number"}
                                    placeholder={field.toUpperCase()}
                                    value={formData[field]}
                                    onChange={(e) =>
                                        setFormData({ ...formData, [field]: e.target.value })
                                    }
                                    className="input input-bordered w-full"
                                    required
                                    disabled={!isAddMode && field === "id"}
                                />
                            ))}

                            <div className="flex justify-end gap-2 mt-4">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="btn btn-outline"
                                >
                                    Cancel
                                </button>
                                <button type="submit" className="btn btn-primary">
                                    {isAddMode ? "Add" : "Save"}
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
