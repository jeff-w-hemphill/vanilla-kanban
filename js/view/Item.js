import kanbanAPI from "../api/kanbanAPI.js";
import DropZone from "./DropZone.js"

export default class Item {
    constructor(id, content) {
        const bottomDropZone = DropZone.createDropZone();
        this.elements = {};
        this.elements.root = Item.createRoot();
        this.elements.input = this.elements.root.querySelector(".kanban-item-input");

        this.elements.root.dataset.id = id;
        this.elements.input.textContent = content;
        this.content = content;
        this.elements.root.appendChild(bottomDropZone);

        const onBlur = () => {
            const newContent = this.elements.input.textContent.trim();

            if (newContent == this.content) {
                return;
            }

            this.content = newContent;
            kanbanAPI.updateItem(id, {
                content: this.content
            });

            console.log(this.content);
            console.log(newContent);
        };

        this.elements.input.addEventListener("blur", onBlur);
        this.elements.root.addEventListener("dblclick", () => {
            const check = confirm("Are you sure you want to delete this item?");

            if (check) {
                kanbanAPI.deleteItem(id);

                // delete from board view
                this.elements.input.removeEventListener("blur", onBlur);
                this.elements.root.parentElement.removeChild(this.elements.root);
            }
        });
        this.elements.root.addEventListener("dragstart", e => {
            e.dataTransfer.setData("text/plain", id);
        });

        this.elements.input.addEventListener("drop", e => {
            e.preventDefault();
        })
    }

    static createRoot() {
        const range = document.createRange();

        range.selectNode(document.body);

        return range.createContextualFragment(`
            <div class="kanban-item" draggable="true">
                <div class="kanban-item-input" contenteditable></div>
            </div>
        `).children[0];
    }
}