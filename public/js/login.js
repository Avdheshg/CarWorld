

console.log("running login.js");


// ------   Alerts   ------ 
// console.log("running alerts");
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

// ============   LOGIN    ============ 
const login = async (email, password, restrictedHomeRoute, homeRoute) => {  
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
            
            let redirectURL = `/${homeRoute}`;

            if (restrictedHomeRoute !== "undefined") {
                if (restrictedHomeRoute.includes("brand")) {
                    redirectURL = `/newCars?${restrictedHomeRoute}`;
                } else {
                    redirectURL = `/newCars/${restrictedHomeRoute}`;
                }
            }
            showAlert('success', 'Logged in successfully!');   
            window.setTimeout(() => {  
                  
                location.assign(`${redirectURL}`);
            }, 1000);
        } 
    } catch (err) {
      showAlert("error", err.response.data.message);   
    } 
};

const loginForm = document.querySelector(".form--login");      
if (loginForm) {
    let homeRoute;
    document.getElementById("login-btn").addEventListener("click", e => {
        console.log("LoginForm e.target.dataset", e.target.dataset.homeRoute);
        homeRoute = e.target.dataset.homeRoute;
    })
    document.querySelector(".form").addEventListener("submit", e => {
        e.preventDefault();        
        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;
        
        const restrictedHomeRoute = document.getElementById("restricted-home").value;      // from protect MW, authController. This will have a value only when V R coming from the home page and user is not logged in ie url contains carName or 

        login(email, password, restrictedHomeRoute, homeRoute);
        console.log(email, password, restrictedHomeRoute, homeRoute);
    })
}

// ============   LogOut    ============ 
const logout = async () => {
    try {
      const res = await axios({
        method: 'GET',
        url: '/api/v1/users/logout'
      });
      if ((res.data.status = 'success')) {
        // location.reload(true); 
        showAlert('success', 'Logged out successfully!');
        window.setTimeout(() => {
            location.assign('/');  
        }, 1000);
      }
    } catch (err) {
      console.log(err.response);
      showAlert('error', 'Error logging out! Try again.');
    }
};

const logOutBtn = document.querySelector('.nav__el--logout');
// console.log(logOutBtn);

if (logOutBtn) {
    logOutBtn.addEventListener('click', logout);
}

// ============   SIGNUP    ============ 
const signupForm = document.querySelector(".signup-form");
if (signupForm) {
    console.log("*** login.js :: signupForm  ***");
    signupForm.addEventListener("submit", e => {   
        e.preventDefault();
        const name = document.getElementById("name").value;
        const email = document.getElementById("email").value;        
        const password = document.getElementById("password").value;
        const passwordConfirm = document.getElementById("confirm-password").value;

        signupFunction(name, email, password, passwordConfirm);       
    })
}     

const signupFunction = async (name, email, password, passwordConfirm) => {
    console.log("*** login.js => 6. signup Function  ***");
    try {
        console.log("Making a POST request in axios to post /signup route");

        const res = await axios({
            method: 'POST',
            url: '/api/v1/users/signup',
            data: {
                name,
                email,
                password,
                passwordConfirm 
            }
        })

        console.log("POST req completed to  post /signup and the data is received. Now calling the home MW ");
        console.log(res);

        if (res.data.status === 'success') {
            showAlert('success', 'New Account created successfully!');
            window.setTimeout(() => {
                location.assign('/home');      
            }, 1000);    
        }        
        
    } catch (err) {           
        console.log(err);
        showAlert("error", err.response.data.message);   
    }
}


// =================   PUG :: FORGOT PASSWORD     =================   
const forgotPassword = document.querySelector(".form--forgotPassword");  
if (forgotPassword) {
    console.log("forgotPassword present")
    forgotPassword.addEventListener("submit", e => {
        e.preventDefault();    
        document.querySelector(".forgot-password-submit").textContent = 'Sending Email...';
        const email = document.getElementById("email").value;

        forgotPasswordFunction(email);
    })
} 
   
const forgotPasswordFunction = async (email) => {   
    console.log("*** login.js :: forgotPasswordFunction  ***");  

    try {

        var res = await axios({
            method: 'POST',
            url: '/api/v1/users/forgotPassword',  
            data: {    
                email
            }
        })

        console.log("POST req to /forgotPassword is completed and the data is", res);   

        if (res.data.status === 'success') {
            showAlert('success', 'Email sent successfully!');
        }        
   
    } catch (err) {    
        console.log("axios err",  err);  
        showAlert("error", err);    
    }
}


// =================   PUG :: RESET PASSWORD     ================= 
const resetPasswordForm = document.querySelector(".form--resetPassword");
if (resetPasswordForm) {
    resetPasswordForm.addEventListener("submit", e => {
        e.preventDefault();

        const password = document.getElementById("password").value;
        const passwordConfirm = document.getElementById("confirm-password").value;
        const token = document.getElementById("token-input").value;

        console.log(password, passwordConfirm, token);
        resetPasswordFunction(password, passwordConfirm, token);
    })
}

const resetPasswordFunction = async (password, passwordConfirm, token) => {
    console.log("*** login.js :: resetPasswordFunction  ***");  

    try {
        const  res = await axios({   
            method: 'PATCH',
            url: `/api/v1/users/resetPassword/${token}`,
            data: {         
                password,
                passwordConfirm    
            }
        })   
                 
        console.log("POST req to /resetPassword is completed and the data is", res);       

        if (res.data.status === 'success') {
            showAlert('success', 'Password changed successfully! Please login again');
            window.setTimeout(() => {    
                location.assign('/api/v1/users/login');      
            }, 2000);           
        }        
   
    } catch (err) {
        console.log("axios err",  err);
        showAlert("error", err);    
    }
} 


// SHOW PASSWORD
const showPasswordFunction = (element, showBtn) => {
    if (element.type === "password") {
        element.type = "text";
        showBtn.style.color="#55c57a";
    } else {
        element.type = "password";
        showBtn.style.color="#c5bdbd";
    }
}


const showPasswordBtn = document.querySelector(".fa-eye-1");
if (showPasswordBtn) {
    const password = document.getElementById("password");
    // showPasswordFunction();
    showPasswordBtn.addEventListener("click", e => {
        console.log("fa-eye present", showPasswordBtn);     
        showPasswordFunction(password, showPasswordBtn);
    })  
}

const showPasswordConfirmBtn = document.querySelector(".fa-eye-2");
if (showPasswordConfirmBtn) {
    const passwordConfirm = document.getElementById("confirm-password");
    showPasswordConfirmBtn.addEventListener("click", e => {
        showPasswordFunction(passwordConfirm, showPasswordConfirmBtn)
    })
}


// ============   STRIPE    ============    
const stripe = Stripe('pk_test_51KpmUbSBCMWBXDgK2FzvAYGeudRKsTBjgamSnxEBAmsZggYohMDrBRg9BEe6CxBml3IBTW80dR7SV8ZLUxzxLmdC00Wj0S8h8P');

export const bookCar = async ( carId, modelName ) => {
  try {
    // 1) Get checkout session from API 
    console.log("url is", `/bookings/checkout-session/${carId}/${modelName}`);
    const session = await axios(`/bookings/checkout-session/${carId}/${modelName}`); 
    // const session = await axios(`/bookings/checkout-session/${carID}`);
    console.log("session", session.data);

    // 2) Create checkout form + charge credit card
    await stripe.redirectToCheckout({      
      sessionId: session.data.session.id
    });     
    showAlert('success', 'Congratulations');  
  } catch (err) {
    console.log(err);
    showAlert('error', err);
  }
};
    
const bookBtn = document.getElementById('book-car');
if (bookBtn)
  bookBtn.addEventListener('click', e => {
    e.target.textContent = 'Processing...'; 
    console.log("e.target.dataset", e.target.dataset);
    const { carId, modelName } = e.target.dataset;
    bookCar( carId, modelName );  
});  


// function showPasswordFunction() {
//     const showPasswordBtn = document.querySelector(".fa-eye");
//     console.log("showPasswordFunction clicked");
//     if (showPasswordBtn.type === "password") {
//         showPasswordBtn.type = "text";
//     } else {
//         showPasswordBtn.type = "password";
//     }   
// }














