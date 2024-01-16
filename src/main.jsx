import React from 'react'
import ReactDOM from 'react-dom/client'
import Game from './Game'
import "./styles/index.css"

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Game/>
  </React.StrictMode>,
)

const reloadButons = document.querySelectorAll(".reload");
reloadButons.forEach((reloadButon) => {
  reloadButon.addEventListener("click", () => {
    location.reload();
  })
});

