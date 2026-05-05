function deleteUser(button) {
  const user = button.closest(".user");
  user.remove();
}

function lockUser(button) {
  alert("Utilizador bloqueado 🔒");
}