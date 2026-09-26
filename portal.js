document.addEventListener("DOMContentLoaded", function () {

    let students = JSON.parse(localStorage.getItem("swiftSchoolStudents")) || [];

    const studentForm = document.getElementById("studentForm");
    const studentTableBody = document.getElementById("studentTableBody");
    const studentSearch = document.getElementById("studentSearch");

    const totalStudents = document.getElementById("totalStudents");
    const totalClasses = document.getElementById("totalClasses");

    function saveStudents() {
        localStorage.setItem(
            "swiftSchoolStudents",
            JSON.stringify(students)
        );
    }

    function renderStudents() {

        if (!studentTableBody) return;

        studentTableBody.innerHTML = "";

        if (students.length === 0) {

            studentTableBody.innerHTML = `
                <tr>
                    <td colspan="6" style="text-align:center;">
                        No students registered yet.
                    </td>
                </tr>
            `;

        } else {

            students.forEach((student, index) => {

                const row = document.createElement("tr");

                row.innerHTML = `
                    <td>${index + 1}</td>

                    <td>${student.name}</td>

                    <td>${student.admission}</td>

                    <td>${student.className}</td>

                    <td>${student.gender}</td>

                    <td>
                        <button
                            type="button"
                            onclick="editStudent(${index})"
                            style="margin:0 5px 5px 0;"
                        >
                            Edit
                        </button>

                        <button
                            type="button"
                            onclick="deleteStudent(${index})"
                            style="margin:0;"
                        >
                            Delete
                        </button>
                    </td>
                `;

                studentTableBody.appendChild(row);
            });
        }

        updateStats();
    }

    function updateStats() {

        if (totalStudents) {
            totalStudents.textContent = students.length;
        }

        if (totalClasses) {

            const classes = [
                ...new Set(
                    students
                        .map(student => student.className)
                        .filter(Boolean)
                )
            ];

            totalClasses.textContent = classes.length;
        }
    }

    function addStudent(event) {

        event.preventDefault();

        const name =
            document.getElementById("studentName").value.trim();

        const admission =
            document.getElementById("admissionNumber").value.trim();

        const className =
            document.getElementById("studentClass").value.trim();

        const gender =
            document.getElementById("studentGender").value;

        if (!name || !admission || !className || !gender) {

            alert("Please complete all required student fields.");
            return;
        }

        const existingStudent = students.find(
            student =>
                student.admission.toLowerCase() === admission.toLowerCase()
        );

        const editingIndex =
            document.getElementById("editingIndex").value;

        if (editingIndex !== "") {

            students[Number(editingIndex)] = {
                name: name,
                admission: admission,
                className: className,
                gender: gender
            };

            document.getElementById("editingIndex").value = "";

            studentForm.querySelector(
                "button[type='submit']"
            ).textContent = "Add Student";

            alert("Student record updated successfully.");

        } else {

            if (existingStudent) {

                alert(
                    "A student with this admission number already exists."
                );

                return;
            }

            students.push({
                name: name,
                admission: admission,
                className: className,
                gender: gender
            });

            alert("Student record added successfully.");
        }

        saveStudents();
        renderStudents();

        studentForm.reset();
    }

    window.editStudent = function (index) {

        const student = students[index];

        if (!student) return;

        document.getElementById("studentName").value =
            student.name;

        document.getElementById("admissionNumber").value =
            student.admission;

        document.getElementById("studentClass").value =
            student.className;

        document.getElementById("studentGender").value =
            student.gender;

        document.getElementById("editingIndex").value =
            index;

        studentForm.querySelector(
            "button[type='submit']"
        ).textContent = "Update Student";

        document.getElementById("studentName").focus();
    };

    window.deleteStudent = function (index) {

        const student = students[index];

        if (!student) return;

        const confirmed = confirm(
            `Delete ${student.name} from the student records?`
        );

        if (!confirmed) return;

        students.splice(index, 1);

        saveStudents();
        renderStudents();

        alert("Student record deleted.");
    };

    function searchStudents() {

        if (!studentSearch || !studentTableBody) return;

        const searchText =
            studentSearch.value.toLowerCase().trim();

        const rows =
            studentTableBody.querySelectorAll("tr");

        rows.forEach(row => {

            const text =
                row.textContent.toLowerCase();

            row.style.display =
                text.includes(searchText) ? "" : "none";
        });
    }

    if (studentForm) {
        studentForm.addEventListener(
            "submit",
            addStudent
        );
    }

    if (studentSearch) {
        studentSearch.addEventListener(
            "input",
            searchStudents
        );
    }

    renderStudents();
});
