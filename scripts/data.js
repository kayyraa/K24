import * as Api from "./api.js";

const ClassData = await Api.GetClassData();

const ExamsContainer = document.querySelector(".Exams").querySelector("column");
const HomeworksContainer = document.querySelector(".Homeworks").querySelector("column");

ClassData.Exams.forEach(Exam => {
    const ExamElement = document.createElement("div");
    ExamsContainer.appendChild(ExamElement);

    const Header = document.createElement("div");
    ExamElement.appendChild(Header);

    const HeaderText = document.createElement("span");
    HeaderText.textContent = Exam.Class;
    Header.appendChild(HeaderText);

    if (localStorage.getItem("User") && JSON.parse(localStorage.getItem("User")).Type === "0001") {
        const RemoveExamButton = document.createElement("img");
        RemoveExamButton.src = "../images/Cross.svg";
        RemoveExamButton.addEventListener("click", async () => {
            const Exams = ClassData.Exams;
            const Index = Exams.findIndex(NExam => NExam.Timestamp === Exam.Timestamp);
            if (Index > -1) {
                Exams.splice(Index, 1);
            }
            await Api.UpdateClassData(ClassData);
            window.location.reload();
        });
        ExamElement.appendChild(RemoveExamButton);
    }

    const Time = document.createElement("div");
    ExamElement.appendChild(Time);

    const Timestamp = document.createElement("time");
    Timestamp.innerHTML = Api.FormatEpochTime(Exam.Timestamp);
    Time.appendChild(Timestamp);
});

ClassData.Homeworks.forEach(Homework => {
    const HomeworkElement = document.createElement("div");
    HomeworksContainer.appendChild(HomeworkElement);

    const Header = document.createElement("div");
    HomeworkElement.appendChild(Header);

    const HeaderText = document.createElement("span");
    HeaderText.textContent = `${Homework.Class} - ${Homework.Name}`;
    Header.appendChild(HeaderText);

    if (localStorage.getItem("User") && JSON.parse(localStorage.getItem("User")).Type === "0001") {
        const RemoveExamButton = document.createElement("img");
        RemoveExamButton.src = "../images/Cross.svg";
        RemoveExamButton.addEventListener("click", async () => {
            const Homeworks = ClassData.Homeworks;
            const Index = Homeworks.findIndex(NHomework => NHomework.Timestamp === Homework.Timestamp);
            if (Index > -1) {
                Homeworks.splice(Index, 1);
            }
            await Api.UpdateClassData(ClassData);
            window.location.reload();
        });
        HomeworkElement.appendChild(RemoveExamButton);
    }

    const Time = document.createElement("div");
    HomeworkElement.appendChild(Time);

    const Timestamp = document.createElement("time");
    Timestamp.innerHTML = `${Api.FormatEpochTime(Homework.Timestamp)} - ${Api.FormatEpochTime(Homework.Deadend)}`;
    Time.appendChild(Timestamp);
});