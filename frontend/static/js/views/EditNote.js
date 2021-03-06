import AbstractView from "./AbstractView.js";

export default class extends AbstractView {
    constructor(params) {
        super(params);
        this.noteId = params.id;
        this.data = JSON.parse(localStorage.getItem("data"))[this.noteId];
    }

    async getHtml() {
        const changedDates = this.data?.dates;
        const date = changedDates
            ? changedDates[changedDates.length - 1]
            : this.data.created;

        return `
            <div class="main">
              <form id="editNoteForm" data-index="${this.noteId}">
                <h1>Edit note</h1>
                <div class="inputBox">
                    <div class="inputText">Name</div>
                    <input type="text" id="name" value="${this.data.name}">
                </div>
                <div class="inputBox">
                    <div class="inputText">Date</div>
                    <input type="date" id="date" value="${new Date(date).toLocaleDateString('fr-CA')}">
                </div>
                <div class="inputBox">
                    <div class="inputText">Category</div>
                    <select id="category" value="${this.data.category}">
                        <option>Task</option>
                        <option>Random Thought</option>
                        <option>Idea</option>
                    </select>
                </div>
                <div class="inputBox">
                    <div class="inputText">Content</div>
                    <textarea name="content" rows="5">${this.data.content}</textarea>
                </div>
                <button type="submit" class="save">Save note</button>
              </form>
            </div>
        `;
    }
}