import AbstractView from "./AbstractView.js";
import { getIconPathByCategory, restoreIconPath, createdFormat, datesFormat } from "../utils.js";

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
        const dates = item.dates
          ? item.dates?.map(date => new Date(date).toLocaleString('am-ET', datesFormat))
          : [];

        return result += (
          `<tr>
            <td>
              <div>
                <img class="itemIcon" src=${getIconPathByCategory(item.category)}/>
              </div>
            </td>
            <td class="name">${item.name}</td>
            <td>${new Date(item.created).toLocaleString('en-CA', createdFormat)}</td>
            <td>${item.category}</td>
            <td>${item.content}</td>
            <td>${dates.toString().replace(/,/g, ', ')}</td>
            <td>
              <div class="buttons">
                <button class="editButton">
                  <img id="unarchiveNote" data-created="${item.created}" src=${restoreIconPath}/>
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