import AbstractView from "./AbstractView.js";
import { getCategoryIconPath, restoreIconPath, createdFormat } from "../utils.js";

export default class extends AbstractView {
  constructor(params) {
    super(params);
    this.data = JSON.parse(localStorage.getItem("data"));
    this.renderArchivedNotes = this.renderArchivedNotes.bind(this);
  }

  renderArchivedNotes = () => {
    const onlyArchived = this.data
      .filter(item => item.archived)
      .sort((a, b) => new Date(a.created) - new Date(b.created));

    return onlyArchived.reduce((result = '', item) => {
      if (item.archived) {
        const dates = item.content.match(/\d{0,31}(\D)\d{0,12}\1\d{4}/g) || [];

        return result += (
          `<tr>
            <td>
              <div>
                <img class="itemIcon" src=${getCategoryIconPath(item.category)}/>
              </div>
            </td>
            <td class="name">${item.name}</td>
            <td>${new Date(item.created).toLocaleString('en-CA', createdFormat)}</td>
            <td>${item.category}</td>
            <td>${item.content}</td>
            <td>${dates.length > 1 ? dates.toString().replaceAll(/,/g, ', ') : dates}</td>
            <td>
              <div class="buttons">
                <button class="editButton unarchiveNote">
                  <img data-created="${item.created}" src=${restoreIconPath}/>
                </button>
              </div>
            </td>
        </tr>`
        )
      }
    }, '')
  }

  async getHtml() {
    return `
      <h1>Archived notes</h1>
      <table>
        <thead>
          <tr>
              <th></th>
              <th>Name</th>
              <th>Created</th>
              <th>Category</th>
              <th>Content</th>
              <th>Dates</th>
              <th>
                <div class="headerIcons">
                  <img class="editIcon" src=${restoreIconPath}/>
                </div>
              </th>
          </tr>
        </thead>
        <tbody>
          ${this.renderArchivedNotes()}
        </tbody>
      </table>
    `;
  }
}