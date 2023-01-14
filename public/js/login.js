

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
const login = async (email, password, restrictedHomeRoute) => {  
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
        let redirectURL = "/newCars";

        // console.log("restrictedHomeRoute", typeof restrictedHomeRoute)
        // console.log("undefined", typeof undefined)
        if (restrictedHomeRoute !== "undefined") {
            if (restrictedHomeRoute.includes("brand")) {
                redirectURL = `/newCars?${restrictedHomeRoute}`;
            } else {
                redirectURL = `/newCars/${restrictedHomeRoute}`;
            }
            // console.log("restrictedHomeRoute", restrictedHomeRoute !== undefined)  
        }

        // console.log(`redirectURL: ${redirectURL}, restrictedHomeRoute: ${restrictedHomeRoute}`);

        showAlert('success', 'Logged in successfully!');   
        // alert('Logged in successfully!');
        window.setTimeout(() => {  
            location.assign('/newCars');
            location.assign(`${redirectURL}`);
        }, 1000);
      } 
    } catch (err) {
      showAlert("error", err.response.data.message);
    } 
};

const loginForm = document.querySelector(".form--login");      
if (loginForm) {
    document.querySelector(".form").addEventListener("submit", e => {
        e.preventDefault();        
        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;
        
        const restrictedHomeRoute = document.getElementById("restricted-home").value;      // from protect MW, authController

        // console.log("document.getElementById('restricted-car'))", document.getElementById("restricted-car"))

        // console.log("restrictedHomeRoute", restrictedHomeRoute)

        login(email, password, restrictedHomeRoute);
    })
}
// console.log("document.getElementById('restricted__car'))", document.getElementById("restricted__car"))

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

        // console.log("email", email, " password", password);
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
        showAlert("error", err);   
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


// ============   STRIPE    ============    
const stripe = Stripe('pk_test_51KpmUbSBCMWBXDgK2FzvAYGeudRKsTBjgamSnxEBAmsZggYohMDrBRg9BEe6CxBml3IBTW80dR7SV8ZLUxzxLmdC00Wj0S8h8P');

export const bookCar = async carID => {
  try {
    // 1) Get checkout session from API
    const session = await axios(`/bookings/checkout-session/${carID}`);
    console.log(session);

    // 2) Create checkout form + chanre credit card
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
    const { carId } = e.target.dataset;
    bookCar(carId);  
});  






























/* 


 
    
    
    
  



*/



