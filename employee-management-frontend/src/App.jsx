import { useEffect, useState } from "react";
import "./App.css";

  
const API_URL = "https://employee-management-backend-uvk9.onrender.com/api/employees";

function App() {
  const [employees, setEmployees] = useState([]);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingEmployeeId, setEditingEmployeeId] = useState(null);

  // SIDEBAR PAGE
  const [currentPage, setCurrentPage] = useState("dashboard");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    department: "",
    salary: "",
  });

  // FETCH EMPLOYEES
  const fetchEmployees = async () => {
    try {
      const response = await fetch(API_URL);

      if (!response.ok) {
        throw new Error("Failed to fetch employees");
      }

      const data = await response.json();
      setEmployees(data);
    } catch (error) {
      console.error("Error fetching employees:", error);
      alert("Could not load employees. Check if backend is running.");
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  // HANDLE INPUT CHANGE
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // OPEN ADD EMPLOYEE FORM
  const handleAddEmployee = () => {
    setEditingEmployeeId(null);

    setFormData({
      name: "",
      email: "",
      phone: "",
      department: "",
      salary: "",
    });

    setShowForm(true);
  };

  // ADD / UPDATE EMPLOYEE
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const employeeData = {
        ...formData,
        salary: Number(formData.salary),
      };

      let response;

      if (editingEmployeeId !== null) {
        // UPDATE
        response = await fetch(`${API_URL}/${editingEmployeeId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(employeeData),
        });
      } else {
        // ADD
        response = await fetch(API_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(employeeData),
        });
      }

      if (!response.ok) {
        throw new Error(
            editingEmployeeId !== null
                ? "Failed to update employee"
                : "Failed to add employee"
        );
      }

      if (editingEmployeeId !== null) {
        alert("Employee updated successfully!");
      } else {
        alert("Employee added successfully!");
      }

      setFormData({
        name: "",
        email: "",
        phone: "",
        department: "",
        salary: "",
      });

      setEditingEmployeeId(null);
      setShowForm(false);

      await fetchEmployees();
    } catch (error) {
      console.error(error);

      if (editingEmployeeId !== null) {
        alert("Could not update employee. Check if backend is running.");
      } else {
        alert("Could not add employee. Check if backend is running.");
      }
    }
  };

  // EDIT EMPLOYEE
  const handleEdit = (employee) => {
    setFormData({
      name: employee.name || "",
      email: employee.email || "",
      phone: employee.phone || "",
      department: employee.department || "",
      salary: employee.salary ?? "",
    });

    setEditingEmployeeId(employee.id);
    setShowForm(true);

    // Automatically go to Employees page
    setCurrentPage("employees");
  };

  // DELETE EMPLOYEE
  const handleDelete = async (employeeId) => {
    const confirmed = window.confirm(
        "Are you sure you want to delete this employee?"
    );

    if (!confirmed) {
      return;
    }

    try {
      const response = await fetch(`${API_URL}/${employeeId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete employee");
      }

      alert("Employee deleted successfully!");

      await fetchEmployees();
    } catch (error) {
      console.error("Error deleting employee:", error);
      alert("Could not delete employee. Check if backend is running.");
    }
  };

  // CLOSE FORM
  const handleCloseForm = () => {
    setShowForm(false);
    setEditingEmployeeId(null);

    setFormData({
      name: "",
      email: "",
      phone: "",
      department: "",
      salary: "",
    });
  };

  // SEARCH / FILTER
  const filteredEmployees = employees.filter(
      (employee) =>
          employee.name?.toLowerCase().includes(search.toLowerCase()) ||
          employee.email?.toLowerCase().includes(search.toLowerCase()) ||
          employee.department?.toLowerCase().includes(search.toLowerCase())
  );

  // DEPARTMENT DATA
  const departments = [
    ...new Set(
        employees
            .map((employee) => employee.department)
            .filter(Boolean)
    ),
  ];

  // AVERAGE SALARY
  const averageSalary = employees.length
      ? Math.round(
          employees.reduce(
              (total, employee) =>
                  total + Number(employee.salary || 0),
              0
          ) / employees.length
      )
      : 0;

  // PAGE TITLES
  const pageInfo = {
    dashboard: {
      title: "Employee Dashboard",
      subtitle: "Manage your employees and organization.",
    },
    employees: {
      title: "Employees",
      subtitle: "View and manage your team members.",
    },
    departments: {
      title: "Departments",
      subtitle: "View your organization's departments.",
    },
    reports: {
      title: "Reports",
      subtitle: "View employee and salary reports.",
    },
    settings: {
      title: "Settings",
      subtitle: "Manage your application settings.",
    },
  };

  return (
      <div className="dashboard">

        {/* ================= SIDEBAR ================= */}
        <aside className="sidebar">

          {/* LOGO */}
          <div
              className="logo"
              onClick={() => {
                setCurrentPage("dashboard");
                setShowForm(false);
              }}
              style={{ cursor: "pointer" }}
          >
            <div className="logo-icon">E</div>
            <span>EmployEase</span>
          </div>

          {/* MAIN NAVIGATION */}
          <nav>

            <div
                className={`nav-item ${
                    currentPage === "dashboard" ? "active" : ""
                }`}
                onClick={() => {
                  setCurrentPage("dashboard");
                  setShowForm(false);
                }}
            >
              <span>▦</span>
              Dashboard
            </div>

            <div
                className={`nav-item ${
                    currentPage === "employees" ? "active" : ""
                }`}
                onClick={() => {
                  setCurrentPage("employees");
                  setShowForm(false);
                }}
            >
              <span>👥</span>
              Employees
            </div>

            <div
                className={`nav-item ${
                    currentPage === "departments" ? "active" : ""
                }`}
                onClick={() => {
                  setCurrentPage("departments");
                  setShowForm(false);
                }}
            >
              <span>🏢</span>
              Departments
            </div>

            <div
                className={`nav-item ${
                    currentPage === "reports" ? "active" : ""
                }`}
                onClick={() => {
                  setCurrentPage("reports");
                  setShowForm(false);
                }}
            >
              <span>📊</span>
              Reports
            </div>

          </nav>

          {/* BOTTOM NAVIGATION */}
          <div className="sidebar-bottom">

            <div
                className={`nav-item ${
                    currentPage === "settings" ? "active" : ""
                }`}
                onClick={() => {
                  setCurrentPage("settings");
                  setShowForm(false);
                }}
            >
              <span>⚙️</span>
              Settings
            </div>

            <div className="profile">
              <div className="profile-avatar">A</div>

              <div>
                <strong>Admin</strong>
                <small>Administrator</small>
              </div>
            </div>

          </div>
        </aside>


        {/* ================= MAIN CONTENT ================= */}
        <main className="main-content">

          {/* HEADER */}
          <header className="topbar">

            <div>
              <h1>{pageInfo[currentPage].title}</h1>
              <p>{pageInfo[currentPage].subtitle}</p>
            </div>

            {/* ADD EMPLOYEE BUTTON */}
            {(currentPage === "dashboard" ||
                currentPage === "employees") && (
                <button
                    className="add-button"
                    onClick={handleAddEmployee}
                >
                  <span>+</span>
                  Add Employee
                </button>
            )}

          </header>


          {/* ================================================= */}
          {/* DASHBOARD PAGE */}
          {/* ================================================= */}

          {currentPage === "dashboard" && (
              <>
                {/* STATISTICS */}
                <section className="stats">

                  <div className="stat-card">
                    <div className="stat-icon blue">
                      👥
                    </div>

                    <div>
                      <p>Total Employees</p>
                      <h2>{employees.length}</h2>

                      <span className="growth">
                    ↑ Active employees
                  </span>
                    </div>
                  </div>


                  <div className="stat-card">
                    <div className="stat-icon purple">
                      🏢
                    </div>

                    <div>
                      <p>Departments</p>

                      <h2>{departments.length}</h2>

                      <span className="growth">
                    Organization units
                  </span>
                    </div>
                  </div>


                  <div className="stat-card">
                    <div className="stat-icon green">
                      💰
                    </div>

                    <div>
                      <p>Average Salary</p>

                      <h2>
                        ₹ {averageSalary.toLocaleString()}
                      </h2>

                      <span className="growth">
                    Across employees
                  </span>
                    </div>
                  </div>


                  <div className="stat-card">
                    <div className="stat-icon orange">
                      📈
                    </div>

                    <div>
                      <p>System Status</p>

                      <h2>Active</h2>

                      <span className="growth">
                    ● All systems running
                  </span>
                    </div>
                  </div>

                </section>


                {/* DASHBOARD EMPLOYEE SECTION */}
                <section className="employee-section">

                  <div className="section-header">

                    <div>
                      <h2>Employees</h2>
                      <p>
                        View and manage your team members.
                      </p>
                    </div>

                    <div className="search-box">
                      🔍

                      <input
                          type="text"
                          placeholder="Search employees..."
                          value={search}
                          onChange={(e) =>
                              setSearch(e.target.value)
                          }
                      />
                    </div>

                  </div>


                  {/* TABLE */}
                  <EmployeeTable
                      employees={filteredEmployees}
                      handleEdit={handleEdit}
                      handleDelete={handleDelete}
                  />

                </section>
              </>
          )}


          {/* ================================================= */}
          {/* EMPLOYEES PAGE */}
          {/* ================================================= */}

          {currentPage === "employees" && (
              <section className="employee-section">

                <div className="section-header">

                  <div>
                    <h2>All Employees</h2>
                    <p>
                      View, add, edit and delete employees.
                    </p>
                  </div>

                  <div className="search-box">
                    🔍

                    <input
                        type="text"
                        placeholder="Search employees..."
                        value={search}
                        onChange={(e) =>
                            setSearch(e.target.value)
                        }
                    />
                  </div>

                </div>

                <EmployeeTable
                    employees={filteredEmployees}
                    handleEdit={handleEdit}
                    handleDelete={handleDelete}
                />

              </section>
          )}


          {/* ================================================= */}
          {/* DEPARTMENTS PAGE */}
          {/* ================================================= */}

          {currentPage === "departments" && (
              <section className="employee-section">

                <div className="section-header">
                  <div>
                    <h2>Departments</h2>
                    <p>
                      Employees grouped by department.
                    </p>
                  </div>
                </div>


                <div className="department-grid">

                  {departments.length === 0 ? (
                      <div className="empty">
                        <div>🏢</div>

                        <h3>No departments found</h3>

                        <p>
                          Add employees with departments to
                          see them here.
                        </p>
                      </div>
                  ) : (
                      departments.map((department) => {

                        const departmentEmployees =
                            employees.filter(
                                (employee) =>
                                    employee.department ===
                                    department
                            );

                        return (
                            <div
                                className="department-card"
                                key={department}
                            >

                              <div className="department-icon">
                                🏢
                              </div>

                              <div>
                                <h3>{department}</h3>

                                <p>
                                  {departmentEmployees.length}{" "}
                                  employee
                                  {departmentEmployees.length !== 1
                                      ? "s"
                                      : ""}
                                </p>
                              </div>

                            </div>
                        );
                      })
                  )}

                </div>

              </section>
          )}


          {/* ================================================= */}
          {/* REPORTS PAGE */}
          {/* ================================================= */}

          {currentPage === "reports" && (
              <section className="employee-section">

                <div className="section-header">

                  <div>
                    <h2>Employee Reports</h2>
                    <p>
                      Summary of your employee data.
                    </p>
                  </div>

                </div>


                <div className="stats">

                  <div className="stat-card">
                    <div className="stat-icon blue">
                      👥
                    </div>

                    <div>
                      <p>Total Employees</p>
                      <h2>{employees.length}</h2>
                    </div>
                  </div>


                  <div className="stat-card">
                    <div className="stat-icon purple">
                      🏢
                    </div>

                    <div>
                      <p>Total Departments</p>
                      <h2>{departments.length}</h2>
                    </div>
                  </div>


                  <div className="stat-card">
                    <div className="stat-icon green">
                      💰
                    </div>

                    <div>
                      <p>Total Salary</p>

                      <h2>
                        ₹{" "}
                        {employees
                            .reduce(
                                (total, employee) =>
                                    total +
                                    Number(employee.salary || 0),
                                0
                            )
                            .toLocaleString()}
                      </h2>
                    </div>
                  </div>


                  <div className="stat-card">
                    <div className="stat-icon orange">
                      📈
                    </div>

                    <div>
                      <p>Average Salary</p>

                      <h2>
                        ₹{" "}
                        {averageSalary.toLocaleString()}
                      </h2>
                    </div>
                  </div>

                </div>

              </section>
          )}


          {/* ================================================= */}
          {/* SETTINGS PAGE */}
          {/* ================================================= */}

          {currentPage === "settings" && (
              <section className="employee-section">

                <div className="section-header">

                  <div>
                    <h2>Settings</h2>
                    <p>
                      Application and administrator settings.
                    </p>
                  </div>

                </div>


                <div className="settings-card">

                  <div className="setting-row">

                    <div>
                      <strong>Application</strong>

                      <p>
                        EmployEase Employee Management
                      </p>
                    </div>

                    <span className="status">
                  <span className="status-dot"></span>
                  Active
                </span>

                  </div>


                  <div className="setting-row">

                    <div>
                      <strong>Backend API</strong>

                      <p>
                        http://localhost:8080
                      </p>
                    </div>

                    <span className="status">
                  <span className="status-dot"></span>
                  Connected
                </span>

                  </div>


                  <div className="setting-row">

                    <div>
                      <strong>Administrator</strong>

                      <p>
                        Admin
                      </p>
                    </div>

                  </div>

                </div>

              </section>
          )}


          {/* ================================================= */}
          {/* ADD / EDIT EMPLOYEE FORM */}
          {/* ================================================= */}

          {showForm && (
              <section className="form-card">

                <div className="form-header">

                  <div>

                    <h2>
                      {editingEmployeeId !== null
                          ? "Edit Employee"
                          : "Add New Employee"}
                    </h2>

                    <p>
                      {editingEmployeeId !== null
                          ? "Update employee information below."
                          : "Enter employee information below."}
                    </p>

                  </div>

                  <button
                      className="close-button"
                      onClick={handleCloseForm}
                  >
                    ✕
                  </button>

                </div>


                <form onSubmit={handleSubmit}>

                  <div className="form-grid">

                    <div className="form-group">
                      <label>Name</label>

                      <input
                          type="text"
                          name="name"
                          placeholder="Enter employee name"
                          value={formData.name}
                          onChange={handleChange}
                          required
                      />
                    </div>


                    <div className="form-group">
                      <label>Email</label>

                      <input
                          type="email"
                          name="email"
                          placeholder="Enter email"
                          value={formData.email}
                          onChange={handleChange}
                          required
                      />
                    </div>


                    <div className="form-group">
                      <label>Phone</label>

                      <input
                          type="text"
                          name="phone"
                          placeholder="Enter phone number"
                          value={formData.phone}
                          onChange={handleChange}
                          required
                      />
                    </div>


                    <div className="form-group">
                      <label>Department</label>

                      <input
                          type="text"
                          name="department"
                          placeholder="e.g. Engineering"
                          value={formData.department}
                          onChange={handleChange}
                          required
                      />
                    </div>


                    <div className="form-group">
                      <label>Salary</label>

                      <input
                          type="number"
                          name="salary"
                          placeholder="Enter salary"
                          value={formData.salary}
                          onChange={handleChange}
                          required
                      />
                    </div>

                  </div>


                  <div className="form-actions">

                    <button
                        type="button"
                        className="cancel-button"
                        onClick={handleCloseForm}
                    >
                      Cancel
                    </button>

                    <button
                        type="submit"
                        className="save-button"
                    >
                      {editingEmployeeId !== null
                          ? "✓ Update Employee"
                          : "+ Add Employee"}
                    </button>

                  </div>

                </form>

              </section>
          )}

        </main>
      </div>
  );
}


/* ================================================= */
/* EMPLOYEE TABLE COMPONENT */
/* ================================================= */

function EmployeeTable({
                         employees,
                         handleEdit,
                         handleDelete,
                       }) {
  return (
      <div className="table-container">

        <table>

          <thead>

          <tr>
            <th>EMPLOYEE</th>
            <th>CONTACT</th>
            <th>DEPARTMENT</th>
            <th>SALARY</th>
            <th>STATUS</th>
            <th>ACTION</th>
          </tr>

          </thead>


          <tbody>

          {employees.map((employee) => (

              <tr key={employee.id}>

                <td>

                  <div className="employee-info">

                    <div className="avatar">
                      {employee.name
                          ?.charAt(0)
                          .toUpperCase()}
                    </div>

                    <div>
                      <strong>{employee.name}</strong>

                      <small>
                        ID #{employee.id}
                      </small>
                    </div>

                  </div>

                </td>


                <td>

                  <div className="contact">

                  <span>
                    {employee.email}
                  </span>

                    <small>
                      {employee.phone}
                    </small>

                  </div>

                </td>


                <td>

                <span className="department">
                  {employee.department}
                </span>

                </td>


                <td>

                  <strong>
                    ₹{" "}
                    {Number(
                        employee.salary || 0
                    ).toLocaleString()}
                  </strong>

                </td>


                <td>

                <span className="status">

                  <span className="status-dot"></span>

                  Active

                </span>

                </td>


                <td>

                  <div className="actions">

                    <button
                        type="button"
                        className="edit-btn"
                        onClick={() =>
                            handleEdit(employee)
                        }
                    >
                      ✏️
                    </button>


                    <button
                        type="button"
                        className="delete-btn"
                        onClick={() =>
                            handleDelete(employee.id)
                        }
                    >
                      🗑️
                    </button>

                  </div>

                </td>

              </tr>

          ))}

          </tbody>

        </table>


        {employees.length === 0 && (

            <div className="empty">

              <div>👤</div>

              <h3>No employees found</h3>

              <p>
                Add an employee or try another search.
              </p>

            </div>

        )}

      </div>
  );
}


export default App;