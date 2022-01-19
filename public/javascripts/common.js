
// Example starter JavaScript for disabling form submissions if there are invalid fields
function customValidate() {

  // Fetch all the forms we want to apply custom Bootstrap validation styles to
  const forms = document.querySelectorAll('.needs-validation')

  // Loop over them and prevent submission
  Array.prototype.slice.call(forms)
    .forEach(function (form) {
      form.addEventListener('submit', function (event) {
        const passwordConfirmChecked = passwordConfirmValidate();
        if (!form.checkValidity() || !passwordConfirmChecked) {
          event.preventDefault()
          event.stopPropagation()
        }

        form.classList.add('was-validated')
      }, false)
    })
}

//valiedate password confirm
function passwordConfirmValidate(){
  const passwordConfirm = document.querySelector('.password-confirm');
  if (!passwordConfirm) return true;
  const password = document.querySelector('.password');
  //set validation
  passwordConfirm.setCustomValidity(passwordConfirm.value != password.value);
  if (passwordConfirm.value == password.value){
    return true;
  }else{
    return false;
  }
}

document.addEventListener('DOMContentLoaded', ()=> {
  document.querySelectorAll('.do-delete').forEach(element => {
    element.addEventListener('click', e => {
      if (!confirm('削除してもよろしいですか？')){
        e.preventDefault();
        return false;
      }
      return true;
    });
  });
  customValidate();
});