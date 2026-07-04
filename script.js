let subjects = []

const addSubjectBtn = document.getElementById("addSubjectBtn")
const subjectsContainer = document.getElementById("subjectsContainer")

const subjectNameInput = document.getElementById("subjectName")
const oralInput = document.getElementById("oralInput")
const testInput = document.getElementById("testInput")
const projectInput = document.getElementById("projectInput")

function createSubject(name, oralGrades, testGrade, projectGrade) {
    return {
        name: name,
        oralGrades: oralGrades,
        testGrade: testGrade,
        projectGrade: projectGrade
    }
}

function calculateSubjectAverage(oral, test, project) {
    return (oral * 0.4) + (test * 0.4) + (project * 0.2)
}

function renderSubjects() {
    subjectsContainer.innerHTML = ''
    for (let i = 0; i < subjects.length; i++) {
        const subject = subjects[i]
        const card = document.createElement("div")
        card.classList.add("subject-card")

        card.innerHTML = `
        <h3>${subject.name}</h3>
        
        <p><strong>Oral:</strong> ${subject.oralGrades.join(", ")}</p>
        <p><strong>Test:</strong> ${subject.testGrade}</p>
        <p><strong>Project:</strong> ${subject.projectGrade}</p>
        <hr>
        <p><strong>Average:</strong> ${subject.average.toFixed(0)}</p>

        <button class="editBtn">Edit</button>
        `

        subjectsContainer.appendChild(card)
    }
}

function editSubject(index) {
    const subject = subjects[index];

    const newName = prompt("Edit subject name:", subject.name);
    const newOral = Number(prompt("Edit oral grade:", subject.oralGrades[0]));
    const newTest = Number(prompt("Edit test grade:", subject.testGrade));
    const newProject = Number(prompt("Edit project grade:", subject.projectGrade));

    if (
        newName.trim() === "" ||
        isNaN(newOral) ||
        isNaN(newTest) ||
        isNaN(newProject)
    ) {
        alert("Invalid input!");
        return;
    }

    const average = calculateSubjectAverage(newOral, newTest, newProject);

    subjects[index] = {
        name: newName,
        oralGrades: [newOral],
        testGrade: newTest,
        projectGrade: newProject,
        average
    };

    renderSubjects();
}

subjectsContainer.addEventListener("click", function (event) {

    if (event.target.classList.contains("editBtn")) {

        const index = Array.from(subjectsContainer.children)
            .indexOf(event.target.closest(".subject-card"));

        editSubject(index);
    }
})

addSubjectBtn.addEventListener("click", function () {
    const name = subjectNameInput.value.trim()
    const oral = Number(oralInput.value)
    const test = Number(testInput.value)
    const project = Number(projectInput.value)

    if (name === '' || isNaN(oral) || isNaN(test) || isNaN(project)) {
        alert("Please fill all fields correctly.")
        return
    }

    if (oral < 4 || oral > 10 || test < 4 || test > 10 || project < 4 || project > 10) {
        alert("Grades must be between 4 and 10!")
        return
    }

    const average = calculateSubjectAverage(oral, test, project)

    const newSubject = {
        name,
        oralGrades: [oral],
        testGrade: test,
        projectGrade: project,
        average
    }

    subjects.push(newSubject)
    renderSubjects()

    subjectNameInput.value = ''
    oralInput.value = ''
    testInput.value = ''
    projectInput.value = ''
})
