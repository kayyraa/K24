import * as Api from "./api.js";

const NewAddonContainer = document.querySelector(".NewAddonContainer");
const AddonNameInput = NewAddonContainer.querySelector(".NameInput");
const AddonCodeInput = document.querySelector(".CodeInput");
const AddonUploadButton = document.querySelector("button");

const GroupColors = [];
for (let index = 0; index < 16; index++) {
    GroupColors.push([
        Math.floor(Math.random() * 255),
        Math.floor(Math.random() * 255),
        Math.floor(Math.random() * 255),
        1
    ]);
}

GroupColors.forEach((Color, Index) => {
    let Total = 0;
    Color.forEach((Value, ColorIndex) => {
        if (ColorIndex === 3) return;
        Total += Value;
    });
    Total /= 6;
    GroupColors[Index] = [Total, Total, Total, Color[3]];
});

const GroupColorMap = new Map();

const Rows = document.querySelectorAll("row");
Rows.forEach(Row => {
    const SubRows = Row.querySelectorAll("div");
    SubRows.forEach(SubRow => {
        let LastRowColor = null;
        let UsedColors = new Set();

        Array.from(SubRow.children).forEach((RowItem, Index) => {
            if (Index === 0) return;

            const Content = RowItem.innerHTML.trim();

            if (!GroupColorMap.has(Content)) {
                let SelectedColor;
                do {
                    SelectedColor = GroupColors[Math.floor(Math.random() * GroupColors.length)];
                } while (UsedColors.has(SelectedColor.join(',')) || SelectedColor === LastRowColor);

                GroupColorMap.set(Content, `rgba(${SelectedColor[0]}, ${SelectedColor[1]}, ${SelectedColor[2]}, ${SelectedColor[3]})`);
                LastRowColor = SelectedColor;
            }

            if (Row.hasAttribute("color")) RowItem.style.backgroundColor = GroupColorMap.get(Content);
        });
    });
});

const Labels = document.querySelectorAll("label");
Labels.forEach(Label => {
    if (Label.hasAttribute("display") && Label.hasAttribute("for")) {
        const TargetElement = document.querySelector(`input[name="${Label.getAttribute("for")}"]`);
        if (TargetElement && TargetElement.getAttribute("type") === "range") {
            TargetElement.addEventListener("input", () => {
                if (Label.getAttribute("display").includes("percentage")) {
                    const Percentage = ((parseFloat(TargetElement.value) / parseFloat(TargetElement.getAttribute("max"))) * 100).toFixed(parseInt(Label.getAttribute("display").replace("percentage:", "")));
                    Label.textContent = `${Percentage.padStart(2, "0")}%`;
                }
            });
        }
    }
});

AddonUploadButton.addEventListener("click", async () => {
    const Name = AddonNameInput.value;
    const Code = AddonCodeInput.value;
    if (!Name || !Code) return;

    const Addon = {
        Name: Name,
        Code: Code,
        Timestamp: Math.floor(new Date() / 1000)
    };

    const Storage = new Api.Storage("Addons");
    await Storage.AppendDocument(Addon);
    location.reload();
});

const Storage = new Api.Storage("Addons");
Storage.GetDocuments().then((Documents) => {
    Documents.forEach((Document) => {
        
    });
});