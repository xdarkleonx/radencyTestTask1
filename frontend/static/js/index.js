import Notes from "./views/Notes.js";
import ArchivedNotes from "./views/ArchivedNotes.js";
import NewNote from "./views/NewNote.js";
import EditNote from "./views/EditNote.js";
import { pathToRegex, getParams, getInitData } from "./utils.js";

const initData = getInitData();

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

  let match = potentialMatches
    .find(potentialMatch => potentialMatch.result !== null);

  if (!match) {
    match = {
      route: routes[0],
      result: [location.pathname]
    }
  }

  const view = new match.route.view(getParams(match));
  document.querySelector("#app").innerHTML = await view.getHtml();
}

document.addEventListener("DOMContentLoaded", router);
window.addEventListener("popstate", router);

window.onload = () => {
  document.getElementById('showArchive')
    ?.addEventListener("click", (e) => {
      e.preventDefault();
      window.location.assign("/archived");
    })

  document.getElementById('createNote')
    ?.addEventListener("click", (e) => {
      e.preventDefault();
      window.location.assign("/new");
    })

  document.querySelectorAll('.editNote').forEach((button) => {
    button.addEventListener("click", (e) => {
      e.preventDefault();
      const index = parseInt(e.target.getAttribute('data-index'));
      window.location.assign(`/edit/${index}`);
    })
  })

  document.querySelectorAll('.archiveNote').forEach((button) => {
    button.addEventListener("click", (e) => {
      e.preventDefault();
      const index = parseInt(e.target.getAttribute('data-index'));
      const newData = initData.map((item, i) => ({
        ...item,
        archived: i === index ? true : item.archived
      }))
      localStorage.setItem("data", JSON.stringify(newData));
      window.location.reload();
    })
  })

  document.querySelectorAll('.unarchiveNote').forEach((button) => {
    button.addEventListener("click", (e) => {
      e.preventDefault();
      const created = e.target.getAttribute('data-created');
      const newData = initData.map((item) => ({
        ...item,
        archived: item.created === created ? false : item.archived
      }))
      localStorage.setItem("data", JSON.stringify(newData));
      window.location.reload();
    })
  })

  document.querySelectorAll('.removeNote').forEach((button) => {
    button.addEventListener("click", (e) => {
      e.preventDefault();
      const index = parseInt(e.target.getAttribute('data-index'));
      const newData = initData.filter((_, i) => i !== index);
      localStorage.setItem("data", JSON.stringify(newData));
      window.location.reload();
    })
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
      const newData = [...initData, newNote];
      localStorage.setItem("data", JSON.stringify(newData));
      window.location.replace("/");
    })

  document.getElementById("editNoteForm")
    ?.addEventListener('submit', (e) => {
      e.preventDefault();

      const index = parseInt(e.target.getAttribute('data-index'));
      const newData = initData.filter((_, i) => i !== index);
      const createdDate = new Date(initData[index].created);

      const editedNote = {
        name: e.target[0].value,
        category: e.target[1].value,
        content: e.target[2].value,
        created: createdDate,
        archived: false
      }

      newData.push(editedNote);
      newData.sort((a, b) => new Date(a.created) - new Date(b.created));
      localStorage.setItem("data", JSON.stringify(newData));
      window.location.replace("/");
    })
}