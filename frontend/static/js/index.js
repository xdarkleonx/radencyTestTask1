import Notes from "./views/Notes.js";
import ArchivedNotes from "./views/ArchivedNotes.js";
import NewNote from "./views/NewNote.js";
import EditNote from "./views/EditNote.js";
import { data } from "./utils.js";

const pathToRegex = path => new RegExp("^" + path.replace(/\//g, "\\/").replace(/:\w+/g, "(.+)") + "$");

const getParams = match => {
  const values = match.result.slice(1);
  const keys = Array.from(match.route.path.matchAll(/:(\w+)/g)).map(result => result[1]);

  return Object.fromEntries(keys.map((key, i) => {
    return [key, values[i]];
  }));
}

const router = async () => {
  const routes = [
    { path: "/", view: Notes },
    { path: "/archived", view: ArchivedNotes },
    { path: "/new", view: NewNote },
    { path: "/edit/:id", view: EditNote },
  ]

  const potentialMatches = routes.map(route => {
    return {
      route: route,
      result: location.pathname.match(pathToRegex(route.path))
    }
  })

  let match = potentialMatches.find(potentialMatch => potentialMatch.result !== null);

  if (!match) {
    match = {
      route: routes[0],
      result: [location.pathname]
    }
  }

  const view = new match.route.view(getParams(match));

  document.querySelector("#app").innerHTML = await view.getHtml();
}

var localData = JSON.parse(localStorage.getItem("data"));

if (!localData) {
  localStorage.setItem("data", JSON.stringify(data));
}

window.addEventListener("popstate", router);

document.addEventListener("DOMContentLoaded", () => {
  router();
})

window.onload = () => {
  document.body.addEventListener("click", e => {
    if (e.target.matches("#showArchive")) {
      e.preventDefault();
      window.location.assign("/archived");
    }
    if (e.target.matches("#createNote")) {
      e.preventDefault();
      window.location.assign("/new");
    }
    if (e.target.matches("#editNote")) {
      e.preventDefault();
      const index = parseInt(e.target.getAttribute('data-index'));
      window.location.assign(`/edit/${index}`);
    }
    if (e.target.matches("#archiveNote")) {
      e.preventDefault();
      const index = parseInt(e.target.getAttribute('data-index'));
      const newData = localData.map((item, i) => ({
        ...item,
        archived: i === index ? true : item.archived
      }))
      localStorage.setItem("data", JSON.stringify(newData));
      window.location.reload();
    }
    if (e.target.matches("#unarchiveNote")) {
      e.preventDefault();
      const created = e.target.getAttribute('data-created');
      const newData = localData.map((item) => ({
        ...item,
        archived: item.created === created ? false : item.archived
      }))
      localStorage.setItem("data", JSON.stringify(newData));
      window.location.reload();
    }
    if (e.target.matches("#removeNote")) {
      e.preventDefault();
      const index = parseInt(e.target.getAttribute('data-index'));
      const newData = localData.filter((_, i) => i !== index);
      localStorage.setItem("data", JSON.stringify(newData));
      window.location.reload();
    }
  })

  document.getElementById("newNoteForm")
    ?.addEventListener('submit', (e) => {
      e.preventDefault();
      const newNote = {
        name: e.target[0].value,
        category: e.target[1].value,
        content: e.target[2].value,
        archived: false,
        created: new Date()
      }
      const newData = [...localData, newNote];
      localStorage.setItem("data", JSON.stringify(newData));
      window.location.replace("/");
    })

  document.getElementById("editNoteForm")
    ?.addEventListener('submit', (e) => {
      e.preventDefault();

      const index = parseInt(e.target.getAttribute('data-index'));
      const newData = localData.filter((_, i) => i !== index);
      const changedDates = localData[index]?.dates || [];
      const lastChangedTimestamp = new Date(changedDates?.[changedDates.length - 1]).setHours(0, 0, 0, 0);
      const createdTimestamp = new Date(localData[index].created).setHours(0, 0, 0, 0);
      const currentTimestamp = new Date(e.target[1].value).setHours(0, 0, 0, 0);
      const createdDate = new Date(createdTimestamp);
      const currentDate = new Date(currentTimestamp);

      const editedNote = {
        name: e.target[0].value,
        category: e.target[2].value,
        content: e.target[3].value,
        archived: false,
        created: createdDate
      }

      if (changedDates.length && lastChangedTimestamp !== currentTimestamp) {
        editedNote.dates = [...changedDates, currentDate]
      }
      else if (lastChangedTimestamp === currentTimestamp) {
        editedNote.dates = changedDates;
      }
      else if (createdTimestamp !== currentTimestamp) {
        editedNote.dates = [createdDate, currentDate];
      }

      newData.push(editedNote);
      newData.sort((a, b) => new Date(a.created) - new Date(b.created));
      localStorage.setItem("data", JSON.stringify(newData));
      window.location.replace("/");
    })
}