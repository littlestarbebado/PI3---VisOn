function addUser(tipo) {
  const list = document.getElementById("userList");

  const div = document.createElement("div");
  div.className = "user";

  div.innerHTML = `
    <div class="user-info">
      <div class="avatar"></div>
      <div class="user-text">
        Novo ${tipo} <span>email@exemplo.com</span>
      </div>
      <span class="badge ${tipo.toLowerCase()}">${tipo}</span>
    </div>
    <div class="icons">
      🔒 <span onclick="removeUser(this)">🗑</span>
    </div>
  `;

  list.appendChild(div);
}

function removeUser(el) {
  el.closest(".user").remove();
}