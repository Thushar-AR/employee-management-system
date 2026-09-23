import { useEffect, useState } from "react";
import "./App.css";

const API_URL =
  "https://employee-management-backend-uvk9.onrender.com/api/employees";

function App() {
  const [employees, setEmployees] = useState([]);
  const [search, setSearch] = useState("");

  // SIDEBAR PAGE
  const [currentPage, setCurrentPage] = useState("dashboard");

  // FORM
  const [showForm, setShowForm] = useState(false);
  const [editingEmployeeId, setEditingEmployeeId] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    department: "",
    salary: "",
  });

  // ==============================
  // FETCH EMPLOYEES
  // ==============================

  const fetchEmployees = async () => {
    try {
      const response = await fetch(API_URL);

      if (!response.ok) {
        throw new Error("Failed to fetch employees");
      }

      const data = await response.json();
      setEmployees(data);
    } catch (error) {
      console.error("Error loading employees:", error);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  // ==============================
  // FORM INPUT
  // ==============================

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // ==============================
  // ADD EMPLOYEE
  // ==============================

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

  // ==============================
  // ADD / UPDATE EMPLOYEE
  // ==============================

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const employeeData = {
        ...formData,
        salary: Number(formData.salary),
      };

      let response;

      if (editingEmployeeId !== null) {
        response = await fetch(
          `${API_URL}/${editingEmployeeId}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(employeeData),
          }
        );
      } else {
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

      alert(
        editingEmployeeId !== null
          ? "Employee updated successfully!"
          : "Employee added successfully!"
      );

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

      alert(
        editingEmployeeId !== null
          ? "Could not update employee. Check if backend is running."
          : "Could not add employee. Check if backend is running."
      );
    }
  };

  // ==============================
  // EDIT EMPLOYEE
  // ==============================

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
    setCurrentPage("employees");
  };

  // ==============================
  // DELETE EMPLOYEE
  // ==============================

  const handleDelete = async (employeeId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this employee?"
    );

    if (!confirmed) {
      return;
    }

    try {
      const response = await fetch(
        `${API_URL}/${employeeId}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete employee");
      }

      alert("Employee deleted successfully!");

      await fetchEmployees();
    } catch (error) {
      console.error("Error deleting employee:", error);

      alert(
        "Could not delete employee. Check if backend is running."
      );
    }
  };

  // ==============================
  // CLOSE FORM
  // ==============================

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

  // ==============================
  // SEARCH
  // ==============================

  const filteredEmployees = employees.filter((employee) => {
    const searchText = search.toLowerCase();

    return (
      employee.name
        ?.toLowerCase()
        .includes(searchText) ||
      employee.email
        ?.toLowerCase()
        .includes(searchText) ||
      employee.department
        ?.toLowerCase()
        .includes(searchText)
    );
  });

  // ==============================
  // DEPARTMENTS
  // ==============================

  const departments = [
    ...new Set(
      employees
        .map((employee) => employee.department)
        .filter(Boolean)
    ),
  ];

  // ==============================
  // AVERAGE SALARY
  // ==============================

  const averageSalary =
    employees.length > 0
      ? employees.reduce(
          (total, employee) =>
            total + Number(employee.salary || 0),
          0
        ) / employees.length
      : 0;

  // ==============================
  // TOTAL SALARY
  // ==============================

  const totalSalary = employees.reduce(
    (total, employee) =>
      total + Number(employee.salary || 0),
    0
  );

  // ==============================
  // PAGE NAVIGATION
  // ==============================

  const goToPage = (page) => {
    setCurrentPage(page);
    setShowForm(false);
    setEditingEmployeeId(null);
  };

  return (
    <div className="app">

      {/* ==============================
          BACKGROUND GLOW
      ============================== */}

      <div className="background-glow glow-one"></div>
      <div className="background-glow glow-two"></div>
      <div className="background-glow glow-three"></div>

      {/* ==============================
          SIDEBAR
      ============================== */}

      <aside className="sidebar">

        <div
          className="brand"
          onClick={() => goToPage("dashboard")}
          style={{ cursor: "pointer" }}
        >
          <div className="brand-logo">
            EH
          </div>

          <div className="brand-name">
            EMP <span>HUB</span>
          </div>
        </div>

        <nav className="navigation">

          <button
            className={`nav-item ${
              currentPage === "dashboard"
                ? "active"
                : ""
            }`}
            onClick={() => goToPage("dashboard")}
          >
            <span className="nav-icon">▦</span>
            <span>Dashboard</span>
          </button>

          <button
            className={`nav-item ${
              currentPage === "employees"
                ? "active"
                : ""
            }`}
            onClick={() => goToPage("employees")}
          >
            <span className="nav-icon">♟</span>
            <span>Employees</span>
          </button>

          <button
            className={`nav-item ${
              currentPage === "departments"
                ? "active"
                : ""
            }`}
            onClick={() => goToPage("departments")}
          >
            <span className="nav-icon">▦</span>
            <span>Departments</span>
          </button>

          <button
            className={`nav-item ${
              currentPage === "reports"
                ? "active"
                : ""
            }`}
            onClick={() => goToPage("reports")}
          >
            <span className="nav-icon">▥</span>
            <span>Reports</span>
          </button>

        </nav>

        <div className="sidebar-bottom">

          <button
            className={`nav-item settings ${
              currentPage === "settings"
                ? "active"
                : ""
            }`}
            onClick={() => goToPage("settings")}
          >
            <span className="nav-icon">⚙</span>
            <span>Settings</span>
          </button>

          <div className="admin-section">

            <div className="admin-avatar">
              A
            </div>

            <div className="admin-info">

              <div className="admin-name">
                Admin
              </div>

              <div className="admin-role">
                Administrator
              </div>

            </div>

          </div>

        </div>

      </aside>

      {/* ==============================
          MAIN CONTENT
      ============================== */}

      <main className="main-content">

        {/* TOP HEADER */}

        <header className="top-header">

          <div></div>

          <div className="notification">
            🔔
            <span></span>
          </div>

        </header>

        {/* ==============================
            DASHBOARD
        ============================== */}

        {currentPage === "dashboard" && (
          <>

            {/* STAT CARDS */}

            <section className="stats-grid">

              <div className="stat-card employee-card">

                <div className="stat-icon">
                  👥
                </div>

                <div className="stat-content">

                  <div className="stat-title">
                    Total<br />
                    Employees
                  </div>

                  <div className="stat-value">
                    {employees.length}
                  </div>

                  <div className="stat-description">
                    ↑ {employees.length} Active
                    <br />
                    employees
                  </div>

                </div>

              </div>

              <div className="stat-card department-card">

                <div className="stat-icon">
                  ▦
                </div>

                <div className="stat-content">

                  <div className="stat-title">
                    Departments
                  </div>

                  <div className="stat-value">
                    {departments.length}
                  </div>

                  <div className="stat-description">
                    Organization
                    <br />
                    units
                  </div>

                </div>

              </div>

              <div className="stat-card salary-card">

                <div className="stat-icon">
                  💰
                </div>

                <div className="stat-content">

                  <div className="stat-title">
                    Average Salary
                  </div>

                  <div className="stat-value salary-value">
                    ₹{" "}
                    {Math.round(
                      averageSalary
                    ).toLocaleString("en-IN")}
                  </div>

                  <div className="stat-description">
                    Across
                    <br />
                    employees
                  </div>

                </div>

              </div>

              <div className="stat-card status-card">

                <div className="stat-icon">
                  📈
                </div>

                <div className="stat-content">

                  <div className="stat-title">
                    System Status
                  </div>

                  <div className="stat-value status-value">
                    Active
                  </div>

                  <div className="stat-description">
                    ● All systems
                    <br />
                    running
                  </div>

                </div>

              </div>

            </section>

            <EmployeePanel
              employees={filteredEmployees}
              search={search}
              setSearch={setSearch}
              handleEdit={handleEdit}
              handleDelete={handleDelete}
            />

          </>
        )}

        {/* ==============================
            EMPLOYEES PAGE
        ============================== */}

        {currentPage === "employees" && (
          <>

            <div className="page-heading">

              <div>
                <h1>Employees</h1>

                <p>
                  View and manage your team members.
                </p>
              </div>

              <button
                className="add-employee-button"
                onClick={handleAddEmployee}
              >
                + Add Employee
              </button>

            </div>

            <EmployeePanel
              employees={filteredEmployees}
              search={search}
              setSearch={setSearch}
              handleEdit={handleEdit}
              handleDelete={handleDelete}
            />

          </>
        )}

        {/* ==============================
            DEPARTMENTS PAGE
        ============================== */}

        {currentPage === "departments" && (
          <section className="employee-panel">

            <div className="employee-header">

              <div>
                <h1>Departments</h1>

                <p>
                  Employees grouped by department.
                </p>
              </div>

            </div>

            <div className="department-grid">

              {departments.length === 0 ? (

                <div className="empty-state">

                  <div className="empty-icon-wrapper">
                    <div className="empty-icon">
                      ♙
                    </div>
                  </div>

                  <h2>
                    No departments found
                  </h2>

                  <p>
                    Add employees with departments
                    to see them here.
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
                      className="department-box"
                      key={department}
                    >

                      <div className="department-box-icon">
                        ▦
                      </div>

                      <div>
                        <h3>
                          {department}
                        </h3>

                        <p>
                          {
                            departmentEmployees.length
                          }{" "}
                          employee
                          {departmentEmployees.length !==
                          1
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

        {/* ==============================
            REPORTS PAGE
        ============================== */}

        {currentPage === "reports" && (
          <section className="employee-panel">

            <div className="employee-header">

              <div>
                <h1>Reports</h1>

                <p>
                  Summary of your employee data.
                </p>
              </div>

            </div>

            <section className="stats-grid">

              <div className="stat-card employee-card">

                <div className="stat-icon">
                  👥
                </div>

                <div className="stat-content">

                  <div className="stat-title">
                    Total Employees
                  </div>

                  <div className="stat-value">
                    {employees.length}
                  </div>

                </div>

              </div>

              <div className="stat-card department-card">

                <div className="stat-icon">
                  ▦
                </div>

                <div className="stat-content">

                  <div className="stat-title">
                    Departments
                  </div>

                  <div className="stat-value">
                    {departments.length}
                  </div>

                </div>

              </div>

              <div className="stat-card salary-card">

                <div className="stat-icon">
                  💰
                </div>

                <div className="stat-content">

                  <div className="stat-title">
                    Total Salary
                  </div>

                  <div className="stat-value salary-value">
                    ₹{" "}
                    {totalSalary.toLocaleString(
                      "en-IN"
                    )}
                  </div>

                </div>

              </div>

              <div className="stat-card status-card">

                <div className="stat-icon">
                  📈
                </div>

                <div className="stat-content">

                  <div className="stat-title">
                    Average Salary
                  </div>

                  <div className="stat-value">
                    ₹{" "}
                    {Math.round(
                      averageSalary
                    ).toLocaleString("en-IN")}
                  </div>

                </div>

              </div>

            </section>

          </section>
        )}

        {/* ==============================
            SETTINGS PAGE
        ============================== */}

        {currentPage === "settings" && (
          <section className="employee-panel">

            <div className="employee-header">

              <div>
                <h1>Settings</h1>

                <p>
                  Application and administrator
                  settings.
                </p>
              </div>

            </div>

            <div className="settings-list">

              <div className="setting-row">

                <div>
                  <strong>
                    Application
                  </strong>

                  <p>
                    EmployEase Employee
                    Management
                  </p>
                </div>

                <span className="status-badge">
                  ● Active
                </span>

              </div>

              <div className="setting-row">

                <div>
                  <strong>
                    Backend API
                  </strong>

                  <p>
                    Render Production API
                  </p>
                </div>

                <span className="status-badge">
                  ● Connected
                </span>

              </div>

              <div className="setting-row">

                <div>
                  <strong>
                    Administrator
                  </strong>

                  <p>
                    Admin
                  </p>
                </div>

              </div>

            </div>

          </section>
        )}

        {/* ==============================
            ADD / EDIT FORM
        ============================== */}

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

                  <label>
                    Name
                  </label>

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

                  <label>
                    Email
                  </label>

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

                  <label>
                    Phone
                  </label>

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

                  <label>
                    Department
                  </label>

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

                  <label>
                    Salary
                  </label>

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


/* =================================================
   EMPLOYEE PANEL
================================================= */

function EmployeePanel({
  employees,
  search,
  setSearch,
  handleEdit,
  handleDelete,
}) {
  return (
    <section className="employee-panel">

      <div className="employee-header">

        <div>
          <h1>Employees</h1>

          <p>
            View and manage your team members.
          </p>
        </div>

        <div className="search-box">

          <span className="search-icon">
            ⌕
          </span>

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

      {employees.length > 0 ? (

        <>

          <div className="table-header">

            <div>EMPLOYEE</div>
            <div>CONTACT</div>
            <div>DEPARTMENT</div>
            <div>SALARY</div>
            <div>STATUS</div>
            <div>ACTION</div>

          </div>

          <div className="employee-list">

            {employees.map((employee) => (

              <div
                className="employee-row"
                key={employee.id}
              >

                <div className="employee-name-cell">

                  <div className="employee-avatar">
                    {employee.name
                      ?.charAt(0)
                      .toUpperCase()}
                  </div>

                  <div>

                    <span>
                      {employee.name}
                    </span>

                    <small>
                      ID #{employee.id}
                    </small>

                  </div>

                </div>

                <div className="contact-cell">

                  <span>
                    {employee.email}
                  </span>

                  <small>
                    {employee.phone}
                  </small>

                </div>

                <div>
                  {employee.department || "-"}
                </div>

                <div>
                  ₹{" "}
                  {Number(
                    employee.salary || 0
                  ).toLocaleString("en-IN")}
                </div>

                <div>

                  <span className="status-badge">
                    ● Active
                  </span>

                </div>

                <div className="action-buttons">

                  <button
                    type="button"
                    onClick={() =>
                      handleEdit(employee)
                    }
                    title="Edit employee"
                  >
                    ✏
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      handleDelete(employee.id)
                    }
                    title="Delete employee"
                  >
                    🗑
                  </button>

                </div>

              </div>

            ))}

          </div>

        </>

      ) : (

        <div className="empty-state">

          <div className="empty-icon-wrapper">

            <div className="empty-icon">
              ♙
            </div>

          </div>

          <h2>
            No employees found
          </h2>

          <p>
            Add an employee or try another search.
          </p>

        </div>

      )}

    </section>
  );
}

export default App;
```
