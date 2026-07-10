let subjects = []
filteredSubjects = []

let currentFilter = "all"

const addSubjectBtn = document.getElementById("addSubjectBtn")
const subjectsContainer = document.getElementById("subjectsContainer")
const gpaContainer = document.getElementById("gpaContainer")

const subjectNameInput = document.getElementById("subjectName")
const oralInput = document.getElementById("oralInput")
const testInput = document.getElementById("testInput")
const projectInput = document.getElementById("projectInput")

function createSubject(name) {
    return {
        name: name,
        
        trimesters: [
            {
                oralGrades: [],
                testGrade: null
            },
            {
                oralGrades: [],
                testGrade: null
            },
            {
                oralGrades: [],
                testGrade: null,
                projectGrade: null
            }
        ]
    }
}


function calculateAverage(array) {
    if (array.length === 0) return 0

    let sum = 0
    for (let i = 0; i < array.length; i++) {
        sum += array[i]
    }

    return Math.round(sum / array.length * 100) / 100
}

function calculateSubjectAverage(subject) {
    let oralAverages = []

    for (let i = 0; i < subject.trimesters.length; i++) {
        oralAverages.push(calculateAverage(subject.trimesters[i].oralGrades))
    }

    let oralAverage = calculateAverage(oralAverages)

    let testAverage = calculateAverage(subject.trimesters.map(t => t.testGrade).filter(g => g !== null))
    
    let projectAverage = subject.trimesters[2].projectGrade || 0

    return ((oralAverage * 0.4) + (testAverage * 0.4) + (projectAverage * 0.2)).toFixed(2)
}

function calculateGPA() {
    if (subjects.length === 0) return 0
    let sum = 0
    for (let i = 0; i < subjects.length; i++) {
        sum += Number(calculateSubjectAverage(subjects[i]))
    }
    
    return sum / subjects.length
}

function renderGPA() {
    gpaContainer.textContent = `Overall Average: ${calculateGPA().toFixed(2)}`
}

function renderTrimester(trimester, number) {
    let html = ''

    html += `<h4 style="font-weight: 900; font-style: underline">Trimester ${number}</h4>`
    html += `<p><strong>Oral Grades:</strong> ${trimester.oralGrades.join(", ") || "N/A"}</p>`
    html += `<p><strong>Test Grade:</strong> ${trimester.testGrade !== null ? trimester.testGrade : "N/A"}</p>`
    
    if (trimester.projectGrade != null) {
        html += `<p><strong>Project Grade:</strong> ${trimester.projectGrade}</p>`
    }

    return html
}

function renderSubjects() {
    subjectsContainer.innerHTML = ''

    let filteredSubjects = [...subjects]

    if (currentFilter !== "all") {
        filteredSubjects = subjects.filter(subject => subject.name === currentFilter)
    }
    for (let i = 0; i < filteredSubjects.length; i++) {
        const subject = filteredSubjects[i]
        const card = document.createElement("div")
        card.classList.add("subject-card")

        card.innerHTML = `
        <h3>${subject.name}</h3>
        ${renderTrimester(subject.trimesters[0], 1)}
        ${renderTrimester(subject.trimesters[1], 2)}
        ${renderTrimester(subject.trimesters[2], 3)}

        <button class="editBtn">Edit</button>
        <button class="deleteBtn">Delete</button>
        <p><strong>Average:</strong> ${calculateSubjectAverage(subject)}</p>
        `
        const editBtn = card.querySelector(".editBtn")
        const deleteBtn = card.querySelector(".deleteBtn")

        editBtn.addEventListener("click", function () {
            editSubject(subjects.indexOf(subject))
        })

        deleteBtn.addEventListener("click", function () {
            deleteSubject(subjects.indexOf(subject))
        })

        subjectsContainer.appendChild(card)
    }
}

function renderFilters() {
    let filterSection = document.getElementById("filterSection")
    filterSection.innerHTML = ""

    const allBtn = document.createElement("button")
    allBtn.textContent = "All Subjects"
    allBtn.addEventListener("click", function () {
        currentFilter = "all";
        render()
    })
    filterSection.appendChild(allBtn)
    
    const subjectNames = []
    
    for (let i = 0; i < subjects.length; i++) {

        const subject = subjects[i]

        if (!subjectNames.includes(subject.name)) {
            subjectNames.push(subject.name)

            const filterBtn = document.createElement("button")
            filterBtn.textContent = subject.name
            filterBtn.classList.add("filterBtn")

            filterBtn.addEventListener("click", function () {
                currentFilter = subject.name;
                render()
            })
            filterSection.appendChild(filterBtn)
        }
    }
    
}

function editSubject(index) {
    const subject = subjects[index];

    const newName = prompt("Edit subject name:", subject.name);

    const t1Oral = prompt(
        "T1 Oral grades (comma separated):",
        subject.trimesters[0].oralGrades.join(",")
    )

    const t1OralGrades = t1Oral
        .split(",")
        .map(Number)

    const t1Test = Number(prompt(
        "T1 Test grade:",
        subject.trimesters[0].testGrade ?? ""
    ));

    const t2Oral = prompt(
        "T2 Oral grades (comma separated):",
        subject.trimesters[1].oralGrades.join(",")
    )

    const t2OralGrades = t2Oral
        .split(",")
        .map(Number)

    const t2Test = Number(prompt(
        "T2 Test grade:",
        subject.trimesters[1].testGrade ?? ""
    ));

    const t3Oral = prompt(
        "T3 Oral grades (comma separated):",
        subject.trimesters[2].oralGrades.join(",")
    )

    const t3OralGrades = t3Oral
        .split(",")
        .map(Number)

    const t3Test = Number(prompt(
        "T3 Test grade:",
        subject.trimesters[2].testGrade ?? ""
    ));

    const t3Project = Number(prompt(
        "T3 Project grade:",
        subject.trimesters[2].projectGrade ?? ""
    ));


    if (newName.trim() === "") {
        alert("Invalid name!");
        return;
    }


    subject.name = newName;

    subject.trimesters[0].oralGrades = [t1Oral];
    subject.trimesters[0].testGrade = t1Test;

    subject.trimesters[1].oralGrades = [t2Oral];
    subject.trimesters[1].testGrade = t2Test;

    subject.trimesters[2].oralGrades = [t3Oral];
    subject.trimesters[2].testGrade = t3Test;
    subject.trimesters[2].projectGrade = t3Project;


    saveSubjects();
    render();
}

function deleteSubject(index) {
    const confirmDelete = confirm("Are you sure you want to delete this subject?");

    if (!confirmDelete) return;

    subjects.splice(index, 1);

    saveSubjects()
    render()
}

function saveSubjects() {
    localStorage.setItem("subjects", JSON.stringify(subjects));
}

function loadSubjects() {
    const data = localStorage.getItem("subjects")

    if (data) subjects = JSON.parse(data)
}

function render() {
    renderSubjects()
    renderGPA()
    renderFilters()
}

loadSubjects()
render()


addSubjectBtn.addEventListener("click", function () {
    const name = prompt("Subject name:")

    const newSubject = createSubject(name)

    subjects.push(newSubject)

    saveSubjects()
    render()
})
