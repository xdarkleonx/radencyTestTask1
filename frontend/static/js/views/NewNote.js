import AbstractView from "./AbstractView.js";

export default class extends AbstractView {
    constructor(params) {
        super(params);
    }

    async getHtml() {
        return `
            <div class="main">
            <form id="newNoteForm">
                <h1>Create new note</h1>
                <div class="inputBox">
                    <div class="inputText">Name</div>
                    <input type="text" id="name">
                </div>
                <div class="inputBox">
                    <div class="inputText">Category</div>
                    <select id="category">
                        <option>Task</option>
                        <option>Random Thought</option>
                        <option>Idea</option>
                    </select>
                </div>
                <div class="inputBox">
                    <div class="inputText">Content</div>
                    <textarea name="content" rows="5"></textarea>
                </div>
                <button type="submit" class="save">Save note</button>
            </form>
            </div>
        `;
    }
}