import * as Api from "./api.js";

const Form = document.querySelector(".AccountForm");
const UsernameInput = document.querySelector(".UsernameInput");
const PasswordInput = document.querySelector(".PasswordInput");
const SubmitButton = document.querySelector(".SubmitButton");
const LogOutButton = document.querySelector(".LogOutButton");
const RemoveAccountButton = document.querySelector(".RemoveAccountButton");

const Storage = new Api.Storage("Users");

const Ranks = {
    Admin: "1111",
    HeadTeacher: "0001",
    Teacher: "0010",
    Student: "0011"
};

const RemoveClassified = () => {
    document.querySelectorAll("[class]").forEach(Classified => {
        if (Classified.getAttribute("class").includes("Only")) Classified.style.display = "none";
    });
};

if (localStorage.getItem("User")) {
    const User = JSON.parse(localStorage.getItem("User"));
    const UserExists = await Storage.GetDocumentsByField("Username", User.Username);
    if (UserExists) {
        const Type = UserExists[0].Type;
        document.querySelectorAll("[class]").forEach(Classified => {
            if (Classified.getAttribute("class").includes("Only")) {
                if (Classified.getAttribute("class").includes("HeadTeacher")) {
                    if (Type !== "0001") document.querySelector(".HeadTeacherOnly").style.display = "none"
                } else if (Classified.getAttribute("class").includes("Admin")) {
                    if (Type !== "1111") document.querySelector(".AdminOnly").style.display = "none"
                }
            }
        });
    } else RemoveClassified();
} else RemoveClassified();

if (localStorage.getItem("User") && !JSON.parse(localStorage.getItem("User")).Type) {
    localStorage.removeItem("User");
    location.href = "../index.html";
}

if (Form && SubmitButton) {
    LogOutButton.addEventListener("click", async () => {
        localStorage.removeItem("User");
        location.href = "../index.html";
    });

    RemoveAccountButton.addEventListener("click", async () => {
        const User = JSON.parse(localStorage.getItem("User"));
        const UserExists = await Storage.GetDocumentsByField("Username", User.Username);
        if (UserExists && UserExists.length > 0) {
            await Storage.DeleteDocument(UserExists[0].id);
            localStorage.removeItem("User");
            location.href = "../index.html";
        }
    });

    SubmitButton.addEventListener("click", async () => {
        const Username = UsernameInput ? UsernameInput.value : "";
        const Password = PasswordInput ? PasswordInput.value : "";
        if (!Username || !Password) return;

        const UserExists = await Storage.GetDocumentsByField("Username", Username);
        if (UserExists && UserExists.length > 0) {
            if (Password === UserExists[0].Password) {
                localStorage.setItem("User", JSON.stringify(UserExists[0]));
                location.href = "../index.html";
            }
        } else {
            const User = {
                Username: Username,
                Password: Password,
                Type: "0011"
            };
            await Storage.AppendDocument(User);
            localStorage.setItem("User", JSON.stringify(User));
            location.href = "../index.html";
        }
    });
}

if (Api.UsernameLabel && localStorage.getItem("User")) {
    const UserData = JSON.parse(localStorage.getItem("User"));
    Api.UsernameLabel.innerHTML = UserData.Username || "Guest";
    Api.UsernameLabel.removeAttribute("button");
    Api.UsernameLabel.removeAttribute("highlight");
}