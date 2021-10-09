import AbstractView from "./AbstractView.js";
import { getCategoryIconPath, editIconPath, archiveIconPath } from "../utils.js";
import { deleteIconPath, createdFormat } from "../utils.js";

export default class extends AbstractView {
  constructor(params) {
    super(params);
    this.data = JSON.parse(localStorage.getItem("data"));
    this.renderNotes = this.renderNotes.bind(this);
    this.renderSummary = this.renderSummary.bind(this);
  }

  renderNotes = () => {
    const sortedData = this.data
      .sort((a, b) => new Date(a.created) - new Date(b.created));

    return sortedData.reduce((result = '', item, index) => {
      if (!item.archived) {
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
                <button class="editButton editNote">
                  <img data-index="${index}" src=${editIconPath}/>
                </button>
                <button class="editButton archiveNote">
                  <img data-index="${index}" src=${archiveIconPath}/>
                </button>
                <button class="editButton removeNote">
                  <img data-index="${index}" src=${deleteIconPath}/>
                </button>
              </div>
            </td>
        </tr>`
        )
      }
      return result;
    }, '')
  }

  renderSummary = () => {
    const summary = this.data.reduce((result, item) => {
      const activeTotal = result[item.category]?.active || 0;
      const activeCurrent = !item.archived ? 1 : 0;
      const archivedTotal = result[item.category]?.archived || 0;
      const archivedCurrent = item.archived ? 1 : 0;

      return {
        ...result,
        [item.category]: {
          active: activeTotal + activeCurrent,
          archived: archivedTotal + archivedCurrent
        }
      }
    }, {})

    const items = Object.keys(summary).map((category) => {
      return (
        `<tr>
            <td>
              <div>
                <img class="itemIcon" src=${getCategoryIconPath(category)}/>
              </div>
            </td>
            <td>${category}</td>
            <td>${summary[category].active}</td>
            <td>${summary[category].archived}</td>
        </tr>`
      )
    })
    return items.toString().replaceAll('</tr>,', '</tr>');
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
                  <img class="editIcon" src=${archiveIconPath}/>
                  <img class="editIcon" src=${deleteIconPath}/>
                </div>
              </th>
          </tr>
        </thead>
        <tbody>
          ${this.renderNotes()}
        </tbody>
      </table>
      <span class="buttonsBox">
        <button id="showArchive" class="button">Show archived</button>
        <button id="createNote" class="button">Create note</button>
      </span>
      <table>
        <thead>
          <tr>
              <th></th>
              <th>Note Category</th>
              <th>Active</th>
              <th>Archived</th>
          </tr>
        </thead>
        <tbody>
          ${this.renderSummary()}
        </tbody>
      </table>
    `;
  }
}