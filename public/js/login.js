
// ------   Alerts   ------ 
console.log("running alerts");
const hideAlert = () => {
  const el = document.querySelector('.alert');
  if (el) el.parentElement.removeChild(el);
};

// type is 'success' or 'error'
const showAlert = (type, msg) => {
  hideAlert();
  const markup = `<div class="alert alert--${type}">${msg}</div>`;
  document.querySelector('body').insertAdjacentHTML('afterbegin', markup);
  window.setTimeout(hideAlert, 5000);
};

const login = async (email, password) => {  
    try {
        const res = await axios({
            method: 'POST',
            url: '/api/v1/users/login',
            data: {
                email,
                password
            }
        });   

        console.log(res);
        
      if (res.data.status === 'success') {
        showAlert('success', 'Logged in successfully!');
        // alert('Logged in successfully!');
        window.setTimeout(() => {
            location.assign('/');
        }, 1500);
      } 
    } catch (err) {
    //   console.log("err--------------", err);
     // alert(err.response.data.message);
    //   alert("Error axios", err);
    //   console.log("Error axios", err);
        showAlert("error", err.response.data.message);
    } 
};

const loginForm = document.querySelector(".form");
if (loginForm) {
    document.querySelector(".form").addEventListener("submit", e => {
        e.preventDefault();
        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;
    
        login(email, password);
    })
}
 



                     
/* 
    Try with the incorrect email, password
        Error: "Incorrect email password"
    Try with the correct  

    
*/
  









