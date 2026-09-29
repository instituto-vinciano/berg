document.querySelectorAll('.lang').forEach((button)=>{
  button.addEventListener('click',()=>{
    if(!button.classList.contains('active')) alert('Esta versão será disponibilizada em uma etapa posterior.');
  });
});
