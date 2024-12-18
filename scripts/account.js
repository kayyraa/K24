import * as Api from "./api.js";

const Form = document.querySelector(".AccountForm");
const UsernameInput = document.querySelector(".UsernameInput");
const PasswordInput = document.querySelector(".PasswordInput");
const TypeInput = document.querySelector(".TypeInput");
const SubmitButton = document.querySelector(".SubmitButton");
const LogOutButton = document.querySelector(".LogOutButton");
const RemoveAccountButton = document.querySelector(".RemoveAccountButton");

const Storage = new Api.Storage("Users");

if (document.querySelector(".HeadTeacherOnly") && localStorage.getItem("User")) {
    const User = JSON.parse(localStorage.getItem("User"));
    const UserExists = await Storage.GetDocumentsByField("Username", User.Username);
    if (UserExists && UserExists.length > 0) {
        if (User.Type !== "0001") {
            document.querySelector(".HeadTeacherOnly").style.display = "none";
        }
    }
}

if (Form && SubmitButton) {
    if (localStorage.getItem("User")) {
        const User = JSON.parse(localStorage.getItem("User"));
        const UserExists = await Storage.GetDocumentsByField("Username", User.Username);
        if (UserExists && UserExists.length > 0) {
            TypeInput.style.display = "none";

            if (UserExists.Type === "0001") {
                HeadTeacherOnly.style.display = "none";
            }
        }
    }

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
        const Type = TypeInput ? TypeInput.value : "";
        if (!Username || !Password || !Type) return;

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
                Type: Type
            };
            await Storage.AppendDocument(User);
            localStorage.setItem("User", JSON.stringify(User));
            location.href = "../index.html";
        }
    });
}

if (Api.UsernameLabel && localStorage.getItem("User")) {
    const userData = JSON.parse(localStorage.getItem("User"));
    Api.UsernameLabel.innerHTML = userData.Username || "Guest";
    Api.UsernameLabel.removeAttribute("button");
    Api.UsernameLabel.removeAttribute("highlight");
}
