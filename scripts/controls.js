import * as Api from "./api.js";

const NewHomeworkContainer = document.querySelector(".NewHomeworkContainer");
const NewExamContainer = document.querySelector(".NewExamContainer");

["mouseenter", "click"].forEach(Event => {
    Api.Sidebar.addEventListener(Event, () => {
        Api.Sidebar.setAttribute("open", "");
        Api.Topbar.removeAttribute("expanded");
        Api.Content.removeAttribute("expanded", "");
    });
});

["mouseleave", "mouseup", "touchcancel", "touchend"].forEach(Event => {
    Api.Sidebar.addEventListener(Event, () => {
        Api.Sidebar.removeAttribute("open");
        Api.Topbar.setAttribute("expanded", "");
        Api.Content.setAttribute("expanded", "");
    });
});

Api.UsernameLabel ? Api.UsernameLabel.addEventListener("click", () => {
    if (Api.UsernameLabel.hasAttribute("button")) {
        location.href = "../account.html";
    }
}) : "";

Api.Sidebar.querySelectorAll("div[href]").forEach(LinkElement => {
    Api.Content.querySelectorAll("div[href]").forEach((Content, Index) => {
        Index !== 0 ?Content.style.display = "none" : "";
    });

    LinkElement.addEventListener("click", () => {
        Api.Content.querySelectorAll("div[href]").forEach(Content => {
            Content.style.display = "none";
        });

        const TargetHref = LinkElement.getAttribute("href");
        const TargetContent = Api.Content.querySelector(`div[href="${TargetHref}"]`);
        localStorage.setItem("History", TargetHref);
        if (TargetContent) TargetContent.style.display = "";
    });
});

document.querySelectorAll("img").forEach(ImageElement => ImageElement.draggable = false);

if (NewHomeworkContainer) {
    NewHomeworkContainer.querySelectorAll("button")[0].addEventListener("click", async () => {
        const Name = NewHomeworkContainer.querySelectorAll("input")[1];
        const Class = NewHomeworkContainer.querySelectorAll("input")[0];
        const Deadline = NewHomeworkContainer.querySelector("input[type='date']");
        if (!Name || !Class || !Deadline) return;

        const Homework = {
            Name: Name.value,
            Class: Class.value,
            Deadline: new Date(Deadline.value).getTime() / 1000,
            Timestamp: Math.floor(Date.now() / 1000)
        };

        const Storage = new Api.Storage("Class");
        const ClassData = await Storage.GetDocument(Api.ClassDataDocumentId);

        const NewHomeworksArray = [...ClassData.Homeworks, Homework];
        const NewData = { ...ClassData, Homeworks: NewHomeworksArray };
        await Storage.UpdateDocument(Api.ClassDataDocumentId, NewData);
        location.reload();
    });
}

if (NewExamContainer) {
    NewExamContainer.querySelectorAll("button")[0].addEventListener("click", async () => {
        const Class = NewExamContainer.querySelectorAll("input")[0];
        const Timestamp = NewExamContainer.querySelector("input[type='date']");
        if (!Class || !Timestamp) return;

        const Exam = {
            Class: Class.value,
            Timestamp: new Date(Timestamp.value).getTime() / 1000
        };

        const Storage = new Api.Storage("Class");
        const ClassData = await Storage.GetDocument(Api.ClassDataDocumentId);

        const NewExamsArray = [...ClassData.Exams, Exam];
        const NewData = { ...ClassData, Exams: NewExamsArray };
        await Storage.UpdateDocument(Api.ClassDataDocumentId, NewData);
        location.reload();
    });
}

if (Api.NoteArea) {
    Api.NoteArea.value = localStorage.getItem("Notes");
    ["change", "input", "keypress", "focus", "blur", "click", "mouseenter", "mouseleave", "keydown", "keyup", "touchstart"].forEach(Event => {
        Api.NoteArea.addEventListener(Event, () => {
            localStorage.setItem("Notes", Api.NoteArea.value);
        });
    });
}

document.addEventListener("DOMContentLoaded", () => {
    Api.Content.querySelectorAll("div[href]").forEach(Content => {
        Content.style.display = "none";
    });

    const TargetContent = Api.Content.querySelector(`div[href="${localStorage.getItem("History")}"]`);
    if (TargetContent) TargetContent.style.display = "";
    else {
        const HomeworksContent = Api.Content.querySelector("div.Homeworks[href='Homeworks']");
        if (HomeworksContent) HomeworksContent.style.display = "";
    }
});