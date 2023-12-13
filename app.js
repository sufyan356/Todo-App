// REGISTERATION FUNCTION 
function registerationFunction(){
    location.href = 'signUp.html';
}

// FOR SHOW AND HIDE PASSWORD FUNCTION
function showPasswordFunction(){
    const showAndHidePass = document.querySelector(".showAndHidePass");
    const pass = document.getElementById("password");
    if(pass.type === "password"){
        pass.type = "text"
        showAndHidePass.innerHTML = 'HIDE PASSWORD'
    }
    else{
        pass.type = "password"
        showAndHidePass.innerHTML = 'SHOW PASSWORD'
    }
}
// EMAIL ALREADY EXIST
function isEmailAlreadyExist(signUpEmail , usersRecord){
    return usersRecord.some(user => user.email === signUpEmail)
}
// PASSWORD ALREADY EXIST
function isPasswordAlreadyExist(signUpPassword , usersRecord){
    return usersRecord.some(user => user.password === signUpPassword)
}

//SIGN UP FUNCTION
function signUp(event){
    console.log("signUpFunction triggered!...")
    event.preventDefault();
    const userName = document.getElementById("text").value;
    const signUpEmail = document.getElementById("email").value;
    const signUpPassword = document.getElementById("password").value;
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;


   if(!userName){
    ShowError("Please Fill Name Field!..")
   } 
   else if(!emailRegex.test(signUpEmail)){
    ShowError("EMAIL IS NOT VALID" , "Please Enter Valid Email");
   }
   else if(!signUpPassword.length){
    ShowError("Empty Password!..")
   }
   else if(signUpPassword.length < 8){
    ShowError("Password Must Be At Least 8 Characters!..")
   }
   else if(!passwordRegex.test(signUpPassword)){
    ShowError("PASSWORD IS NOT VALID")
    }
    else{
       
        let userData = localStorage.getItem("users");
        let usersRecord = userData?JSON.parse(userData):[]

        if(isEmailAlreadyExist(signUpEmail , usersRecord)){
            ShowError("Email Already Exist" , "Please Enter A Valid Email")
        }
        else if(isPasswordAlreadyExist(signUpPassword , usersRecord)){
            ShowError("Password Already Exist" , "Please Enter A Valid Password")
        }
        else{
            const userID = usersRecord.length + 1;
            let usersObj = {
                name:userName,
                email:signUpEmail,
                password:signUpPassword,
                userID
            }
            usersRecord.push(usersObj);
            localStorage.setItem("users" , JSON.stringify(usersRecord));

            showSuccess("CONGRATULATIONS!..","SIGN UP SUCCESSFULLY");

            setTimeout(function(){
                location.href = 'signIn.html'
            },3000)
        }
    }
}

//SIGN IN FUNCTION

function signIn(event){
      console.log("signInFunction triggered!...")
      event.preventDefault();
      const signInEmail = document.getElementById("email").value;
      const signInPassword = document.getElementById("password").value;
      const usersdata = localStorage.getItem("users");
      const users = usersdata ? JSON.parse(usersdata) : [];
      let emailStatus = false;
      users.forEach(function(user){
          if(user.email === signInEmail){
              emailStatus = true;
              if(user.password === signInPassword){
                  showSuccess("CONGRATULATIONS!.." , "Sign In Successfully..");
                  localStorage.setItem("latestUserName" , JSON.stringify(user.name) );
                  localStorage.setItem("latestUserID" , JSON.stringify(user.userID) );
                  setTimeout(function(){
                      location.href = 'todo.html'
                  },2500)
              }
              else{
                ShowError("Login Failed!..","Enter Correct Password")
              }
          }
      });
      if(!emailStatus){
          ShowError("Login Failed!..","Enter Correct Email")
      }
  
  }

// ERROR FUNCTION
function ShowError(msg , textMsg){
    swal({
        title: msg,
        text: textMsg,
        icon: "error",
        button: "OK",
      });
}
// SUCCESS FUNCTION
function showSuccess(msg , textMsg){
    swal({
        title: msg,
        text: textMsg,
        icon: "success",
        button: "OK",
      });
}

// SIGN UP LINK
function signUpLink(){
    location.href = 'signUp.html'
}
// SIGN IN LINK
function loginLink(){
    location.href = 'signIn.html'
}

// TODO PORTION 
//////////////////////////////////////////////////////////////////////////////
let submitBtn = document.querySelector("#todoSubmitBtn");
let form = document.querySelector("#form");
let showTasks = document.querySelector(".showTasks");
let todoSubmitBtn = document.querySelector("#todoSubmitBtn");
let todoItems = JSON.parse(localStorage.getItem("todoItems")) || [];
let userID = JSON.parse(localStorage.getItem("latestUserID"))

createTasks(todoItems , userID);
function createTasks(todoItems , userID) {
  showTasks.innerHTML = " "; // Clear the current display
  todoItems.forEach(function(ele, i) {
    if (ele.userID === userID) { // Check if the userID matches the current todo item's userID
      const taskID = ele.todoID;
      const titleID = `todoTitle_${taskID}`;
      const descClass = `para_${taskID}`;
      showTasks.innerHTML += `
        <div class="tasks shadow p-2 mb-5 bg-body rounded" id="dlt">
          <span class="ms-2" id='crt'>Created At:${ele.createdAt}</span>
          <span class="ms-2 date" id='todoTitle'> Task Title: ${ele.title}</span>
          <div class="taskAndIcon" id='todoDes'>
            <p class="ms-2 mt-2 para">Task Description: ${ele.items}</p>
            <span class="option">
              <i class="fa-solid fa-pen-to-square fai" onclick='editTask(${taskID})' data-bs-toggle="modal" data-bs-target="#form"></i>
              <i class="fa-solid fa-trash fai" onclick="deleteItem(${i})"></i>
            </span>

          </div>
        </div>
      `;
    }
   
  });
}
 // <i class="fa-solid fa-check fai" onclick = "taskDone(${i}, '${titleID}', '${descClass}')"></i>


// TODO FUNCTION
function todo(event){
  event.preventDefault();
  
  
  let titleTextInput = document.querySelector("#titleTextInput").value;
  let AdditemsInput = document.querySelector("#itemsValue").value;
  

  if (!titleTextInput) {
    console.log(titleTextInput);
    swal("Empty Title Name!..", "Title Can't Be Blanked", "error");
  } 

  else if (!AdditemsInput) {
    console.log(AdditemsInput);
    swal("Empty Task Name !..", "Task Can't Be Blanked", "error");
  } 
  
  else {
    let userID = JSON.parse(localStorage.getItem("latestUserID"));

    acceptAndStoreData(userID);
    resetForm();
  }
}

// ACCEPT AND STORED DATA FUNCTION 
function acceptAndStoreData(userID) {
  let date = new Date(Date.now());
  let dateFormat = date.toLocaleString();
  let titleTextInput = document.querySelector("#titleTextInput").value;
  let AdditemsInput = document.querySelector("#itemsValue").value;
  let todoID = 1;
  var todoItem = {
    title: titleTextInput,
    items: AdditemsInput,
    createdAt: dateFormat,
    todoID: todoID,
    userID: userID
  };
  let getItems = localStorage.getItem("todoItems");
  let isParsedData = getItems && JSON.parse(getItems);
  console.log(isParsedData);
  if (isParsedData && Array.isArray(isParsedData)) {
    if (isParsedData.length > 0) {
      todoItem.todoID = isParsedData[isParsedData.length - 1].todoID + 1;
    } else {
      todoItem.todoID = 1;
    }
    isParsedData.push(todoItem);
    console.log(isParsedData);
    createTasks(isParsedData, userID); // Pass the userID to createTasks
  } else {
    isParsedData = [todoItem];
    console.log(isParsedData);
    createTasks(isParsedData, userID); // Pass the userID to createTasks
  }
  localStorage.setItem("todoItems", JSON.stringify(isParsedData));
}


//RESET FORM FUNCTION 
function resetForm(){
    document.querySelector("#titleTextInput").value = ' ';
    document.querySelector("#itemsValue").value = ' ';
}

// EDIT FUNCTION 
function editTask(taskID) {
  let todoItems = JSON.parse(localStorage.getItem("todoItems")) || [];
  let addItems = document.querySelector("#form")
  let taskIndex = todoItems.findIndex((task) => task.todoID === taskID);
  
  if (taskIndex !== -1) {
    let currentTitle = prompt("Edit Todo Title", todoItems[taskIndex].title);
    let currentItems = prompt("Edit Todo Description", todoItems[taskIndex].items);

    // Check if the user canceled the prompt or left the input fields empty
    if (currentTitle === null || currentItems === null || currentTitle.trim() === "" || currentItems.trim() === "") {

      setTimeout(function (){
        addItems.submit();
      },2000);
      ShowError("Todo's Title And Description Must Fill!..")

    }
    else {
     
      todoItems[taskIndex].title = currentTitle;
      todoItems[taskIndex].items = currentItems;
      addItems.submit();
      localStorage.setItem("todoItems", JSON.stringify(todoItems));
      createTasks(todoItems);
      
      
    }
  }
}

// DELETE FUNCTION 
function deleteItem(i){
  console.log(i)

  swal({
    title: "Are you sure?",
    text: "Once deleted, you will not be able to recover this Item!",
    icon: "warning",
    buttons: true,
    dangerMode: true,
  })
  .then((willDelete) => {
    if (willDelete) {
      swal("Poof! Your Item has been deleted!", {
        icon: "success",
      });
      
      const todos = localStorage.getItem("todoItems");
      const todoItems = todos ? JSON.parse(todos) : [] ;
      todoItems.splice(i , 1);
      localStorage.setItem("todoItems" , JSON.stringify(todoItems));
      location.reload();
      
      
      createTasks(todoItems);
    } 
    else {
      swal("Your item is safe!");
    }
  });

}

function clrAll() {
  const clrAllBtn = document.querySelector("#clrAll");
  let todoItems = JSON.parse(localStorage.getItem("todoItems")) || [];
  let userID = JSON.parse(localStorage.getItem("latestUserID"));

  if (!todoItems.length) {
    console.log(todoItems);
    ShowError("There Is No Todo Item ");
  } else {
    swal({
      title: "Are you sure?",
      text: "Once deleted, you will not be able to recover this file!",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then((willDelete) => {
      if (willDelete) {
        // Filter out the items with the matching userID
        todoItems = todoItems.filter((ele) => ele.userID !== userID);

        // Update the todoItems in localStorage
        localStorage.setItem("todoItems", JSON.stringify(todoItems));

        const showTasks = document.querySelector(".showTasks");
        showTasks.innerHTML = ' ';
        swal("Poof! Your file has been deleted!", {
          icon: "success",
        });
      } else {
        swal("Your file is safe!");
      }
    });
  }
}

function taskDone(i) {
  const todoItems = JSON.parse(localStorage.getItem("todoItems") || "[]");

  if (i >= 0 && i < todoItems.length) {
    const titleElement = document.querySelector("#todoTitle");
    const descElement = document.querySelector(".para");

    // Get the title and description from the todo item
    const title = todoItems[i].title;
    const desc = todoItems[i].items;

    // Toggle the "taskDone" class on the elements
    titleElement.textContent = title; // Update the title content
    descElement.textContent = desc;   // Update the description content

    titleElement.classList.toggle("taskDone");
    descElement.classList.toggle("taskDone");
  } else {
    console.log("Invalid index");
  }
}


