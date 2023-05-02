// TODO #4.0: Change this IP address to EC2 instance public IP address when you are going to deploy this web application
const backendIPAddress = " 52.6.65.2:3000";
var cv_cid=[]
var item2=[]
var item3=[]
var item5=[]
var studentid=""
var addsubject=[]
const delay = ms => new Promise(res => setTimeout(res, ms));

var isLoggedIn = false;
var ToDoButton = document.querySelector(".todo");
var CompletedButton = document.querySelector(".completed");
var ToDoTable = document.getElementById("to-do-table");
var CompletedTable = document.getElementById("completed-table");
var stuid = document.getElementById("student-id");
var namesurname = document.getElementById("eng-name-info");
var subjectDd = document.getElementById("sj");

var userInfo;
var signinbutton = document.getElementById("signin");
var signoutbutton = document.getElementById("signout");
signoutbutton.setAttribute("hidden","hidden");
signoutbutton.style.display = "none";
stuid.setAttribute("hidden","hidden");
stuid.style.display = "none";
namesurname.setAttribute("hidden","hidden");
namesurname.style.display = "none";

fetch(`http://${backendIPAddress}/courseville/get_profile_info`, {
  method: "GET",
  credentials: "include",
})
  .then((data) => data.json())
  .then((response) => {
  
    userInfo = response.status;
    if(userInfo == 'success') isLoggedIn = true;
    if (isLoggedIn) {
      signinbutton.style.display = "none";
      signinbutton.setAttribute("hidden","hidden");
      signoutbutton.style.display = "flex";
      signoutbutton.removeAttribute("hidden");
      stuid.style.display = "flex";
      stuid.removeAttribute("hidden");
      namesurname.removeAttribute("hidden");
      namesurname.style.display = "flex";
      
    
    }
  })
  .catch((err) => console.error(err));


const authorizeApplication = () => {
  window.location.href = `http://${backendIPAddress}/courseville/auth_app`;
};

CompletedTable.setAttribute("hidden", "hidden");
CompletedTable.style.display = "none";

async function runFunctions() {
  const [result, result1, result3, result5] = await Promise.all([
    getUserProfile(),
    getUserInfo(),
    getCompEngEssCid2(),
    getCompEngEssCidOld(),
  
    
    
  ]);
 
  getCompEngEssCid()
  await delay(20000);
  getCompEngEssCid2()
  // The rest of your code that depends on the results of these functions
  
}



const getUserProfile = async () => {
  const options = {
    method: "GET",
    credentials: "include",
  };
  await fetch(
    `http://${backendIPAddress}/courseville/get_profile_info`,
    options
  )
    .then((response) => response.json())
    .then((data) => {
      
      console.log(data);
      
      

      document.getElementById(
        "eng-name-info"
      ).innerHTML = `${data.user.firstname_en} ${data.user.lastname_en}`;
    })
    .catch((error) => console.error(error));
};

const getUserInfo = async () => {
  const options = {
    method: "GET",
    credentials: "include",
  };
  await fetch(
    `http://${backendIPAddress}/courseville/user_info`,
    options
  )
    .then((response) => response.json())
    .then((data) => {
      
      console.log(data.data);
      
      document.getElementById(
        "student-id"
      ).innerHTML = `${data.data.student.id}`;
      studentid=`${data.data.student.id}`

     
    })
    .catch((error) => console.error(error));
};


const getCompEngEssCidOld = async () => {const options={
  method: "GET",
  credentials: "include",

}


await fetch(
  `http://${backendIPAddress}/items/members`,
  options
) .then((response) => response.json())
.then((data) => {
data.map((item)=>{
  item5.push(item.Assignment)
})
})
}

const getCompEngEssCid = async () => {
  await delay(15000);
  const table_body = document.getElementById("main-table-body");
  
  let item1
  
  const options = {
    method: "GET",
    credentials: "include",
  };
  await fetch(
    `http://${backendIPAddress}/courseville/get_courses`,
    options
  )
  .then((response) => response.json())
      .then((data) => {
        item1=data.data.student
  
  item1.map((item4) =>{
  const options = {
      method: "GET",
      credentials: "include",
  };
  let items;
   fetch(
      `http://${backendIPAddress}/courseville/get_course_assignments/${item4.cv_cid}`,
      options
  )
      .then((response) => response.json())
      .then((data) => {
        
          items = data.data;
          items.map((item) => {
             
              const options = {
                  method: "GET",
                  credentials: "include",
              };


              let assignments;
              fetch(
                  `http://${backendIPAddress}/courseville/get_assignment_detail/${item.itemid}`,
                  options
              )
                  .then((response) => response.json())
                  .then((data) => {
        
                      assignments = data.data;
                      if (assignments.duetime>(Date.now()/1000)&&item5.find(element => element == studentid+' '+String(assignments.itemid)==undefined)){
                        console.log(item5.find(element => element == studentid+' '+String(assignments.itemid)))
                        console.log(item5)
                        const montha=["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"]
                        const d = new Date(assignments.duetime*1000);
                        subject=String(item4.cv_cid)
                        Assignment=studentid+' '+String(assignments.itemid)
                        id=String(assignments.itemid)
                        duetime=String(assignments.duetime)
                        title=String(assignments.title)
                        
                        
                
                        const itemToadd ={
                         Assignment:Assignment,
                         id:id,
                         subject: subject,
                         duetime:duetime,
                         title:title,
                         finished:0,
                         
      
  
                        }
                        console.log(itemToadd)
                        const options={
                          method: "POST",
                          credentials: "include",
                          headers:{
                            "Content-Type":"application/json"
                          },
                          body: JSON.stringify(itemToadd)
                        }
                        fetch(
                          `http://${backendIPAddress}/items`,
                          options
                        )
                        .then((response) => response.json())
                  .then((data) => {console.log(data)})

                        item2.push({"subject":item4.cv_cid,"id":assignments.itemid,"title":assignments.title,"due":assignments.duedate,"timeMo":montha[d.getMonth()],"timeD":d.getDate(),"timeH":d.getHours(),"timeM":d.getMinutes(),"finished":0})
                        
          }})
         
                  .catch((error) => console.error(error));
          });
      })
      .catch((error) => console.error(error));
      
})
})
}

const getCompEngEssCid2 = async () => {
  
  const table_body = document.getElementById("to-do-table");

  const table_body2 = document.getElementById("completed-table");
  table_body.innerHTML = ``
  table_body2.innerHTML = ``
  const options={
    method: "GET",
    credentials: "include",

  }
  
  await fetch(
    `http://${backendIPAddress}/items/members`,
    options
  )
  .then((response) => response.json())
.then((data) => {item3=data
  item3.sort((a,b)=> {return a.duetime-b.duetime;})

   let i =0
  item3.map(async (item6) => {
    
    const options = {
      method: "GET",
      credentials: "include",
  };
 await fetch(
    `http://${backendIPAddress}/courseville/get_courses_info/${item6.subject}`,
      options
  )
      .then((response) => response.json())
      .then((data) => {
         item6.s=data.data.title
         
         item6.d = new Date(item6.duetime*1000);
         item6.timeM=item6.d.getMinutes()
         if (item6.timeM<10){
           item6.timeM='0'+String(item6.timeM)
         }
          i+=1
          if (i==item3.length){
          item3.sort((a,b)=> {return a.duetime-b.duetime;})
      
     const montha=["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"]
 item3.map(async (item6) => {
  if(studentid+' '+String(item6.id)==item6.Assignment){
    if (item6.finished==0){ 
      table_body.innerHTML += ` 
 <div class="block">
     <button class="left" onclick = "moveRow(this)"><alt="Button"> 
     </button>
     <div class="center">
         <div class="subject">
         ${item6.s}
         </div>
         <br>
         <div class="subject2">
         <p id="myP">${item6.Assignment}</p> 
         </div>
         <div class="assignment">
         ${item6.title}
         </div>
     </div>
     <div class="right">
         <div class="date_box">
             <div class="month">${montha[item6.d.getMonth()]}</div>
             <div class="date">${item6.d.getDate()}</div>
             <div class="hour">${item6.d.getHours()}:${item6.timeM}</div>
         </div>
     </div>
 </div>
 </tr>
 `;}
 else if (item6.finished==1){table_body2.innerHTML += ` 
 <div class="block">
     <button class="left2" onclick = "moveRow2(this)"><alt="Button"> 
     </button>
     <div class="center">
         <div class="subject">
         ${item6.s}
         </div>
         <br>
         <div class="subject2">
         <p id="myP">${item6.Assignment}</p> 
         </div>
         <div class="assignment">
         ${item6.title}
         </div>
     </div>
     <div class="right">
         <div class="date_box">
             <div class="month">${montha[item6.d.getMonth()]}</div>
             <div class="date">${item6.d.getDate()}</div>
             <div class="hour">${item6.d.getHours()}:${item6.timeM}</div>
         </div>
     </div>
 </div>
 </tr>
 `;}}
          })}

})
         });
  
   
       
     
      })
    
    
  
 


}


                      


const logout = async () => {
  window.location.href = `http://${backendIPAddress}/courseville/logout`;
};

function ToDo() {
  CompletedButton.style.backgroundColor =  "rgb(83, 178, 212)";
  ToDoButton.style.backgroundColor ="rgb(217,217,217)";
  ToDoTable.removeAttribute("hidden");
  CompletedTable.setAttribute("hidden", "hidden");
  ToDoTable.style.display = "table";
  CompletedTable.style.display = "none";
  getCompEngEssCid2()
}

function completed() {
  CompletedButton.style.backgroundColor ="rgb(217,217,217)" ;
  ToDoButton.style.backgroundColor ="rgb(83, 178, 212)" ;
  
  CompletedTable.removeAttribute("hidden");
  ToDoTable.setAttribute("hidden", "hidden");
  ToDoTable.style.display = "none";
  CompletedTable.style.display = "table";
  getCompEngEssCid2()
}

function moveRow(button) {
  
  var row = button.closest(".block");
 var myP = row.querySelector('#myP');
 var value = myP.innerHTML;
  console.log(value)
  var clone = row.cloneNode(true);
  row.style.animation = "fadeOut 0.5s";
  setTimeout(function () {
    row.remove();
  }, 500);
  clone.querySelector("button").setAttribute("onclick", "moveRow2(this)");
  clone.querySelector("button").classList.remove("left");
  clone.querySelector("button").classList.add("left2");
  document.getElementById("completed-table").appendChild(clone);
  
  for (let i =0 ;i<item3.length;i++){
    if (value==item3[i].Assignment){
      const itemToadd ={
        Assignment:value,
        id:item3[i].id,
        subject: item3[i].subject,
        duetime:item3[i].duetime,
        title:item3[i].title,
        finished:1
    
       }
       console.log(itemToadd)
       const options={
         method: "POST",
         credentials: "include",
         headers:{
           "Content-Type":"application/json"
         },
         body: JSON.stringify(itemToadd)
       }
       fetch(
         `http://${backendIPAddress}/items`,
         options)
    
    }
  }
  row.remove();
}

function moveRow2(button) {
  var row = button.closest(".block");
  var myP = row.querySelector('#myP');
  var value = myP.innerHTML;
  var clone = row.cloneNode(true);
  row.style.animation = "fadeOut 0.5s";
  setTimeout(function () {
    row.remove();
  }, 500);
  clone.querySelector("button").setAttribute("onclick", "moveRow(this)");
  clone.querySelector("button").classList.remove("left2");
  clone.querySelector("button").classList.add("left");
  for (let i =0 ;i<item3.length;i++){
    if (value==item3[i].Assignment){
      const itemToadd ={
        Assignment:value,
        id:item3[i].id,
        subject: item3[i].subject,
        duetime:item3[i].duetime,
        title:item3[i].title,
        finished:0
    
       }
       
       const options={
         method: "POST",
         credentials: "include",
         headers:{
           "Content-Type":"application/json"
         },
         body: JSON.stringify(itemToadd)
       }
       fetch(
         `http://${backendIPAddress}/items`,
         options)
    
    }
  }

  row.remove();
}


let popup = document.getElementById("popup");
function openPopup() {
  popup.classList.add("open-popup");
}

function cancle() {
  popup.classList.remove("open-popup");
}


function closePopup() {
  popup.classList.remove("open-popup");
  var id = document.getElementById("sj").data-value.cv_cid;
  var as = studentid+" "+id;
  var sj = document.getElementById("sj").data-value.title;
  var nt = document.getElementById("notes");
  var d = document.getElementById("deadline").value;
  var mth = document.getElementById("month").value;
  var h = document.getElementById("hour").value;
  var mn = document.getElementById("minute").value;
  const mth2 = mth.charAt(0).toUpperCase()+mth.slice(1).toLowerCase();
  const javaScriptRelease = Date.parse(`${d} ${mth2} 2023 ${h}:${mn}:00 GMT+0700`);

const itemToadd ={
  Assignment: as,
  id:id,
  subject: sj,
  duetime: javaScriptRelease,
  title:nt,
  finished:0

 }
 console.log(itemToadd)
 const options={
   method: "POST",
   credentials: "include",
   headers:{
     "Content-Type":"application/json"
   },
   body: JSON.stringify(itemToadd)
 }

  

document.getElementById("sj").selectedIndex = 0;
nt.value = "";
document.getElementById("day").selectedIndex = 0;
document.getElementById("month").value = "";
document.getElementById("month").selectedIndex = 0;
document.getElementById("hour").value = "";
document.getElementById("hour").selectedIndex = 0;
document.getElementById("minute").value = "";
document.getElementById("minute").selectedIndex = 0;

getCompEngEssCid2()
}


async function addnew(){
  const options={
    method: "GET",
    credentials: "include",

  }
   await fetch(
     `http://${backendIPAddress}/courseville/get_courses`,
     options
   )
   .then((response) => response.json())
       .then((data) => {
         item1=data.data.student
   
   item1.map((item4) =>{
   const options = {
       method: "GET",
       credentials: "include",
   };
   
    fetch(
       `http://${backendIPAddress}/courseville/get_courses_info/${item4.cv_cid}`,
       options
   )
       .then((response) => response.json())
       .then((data) => {addsubject.push({"cv_cid":data.data.cv_cid,"title":data.data.title})})
 })
})
}
async function addnew2(){
  subjectDd.innerHTML = `<option disabled selected>Choose your subject</option>`;
  
  addsubject.map((subject) => {
    console.log(subject)
    subjectDd.innerHTML +=`<option data-value=${subject}>${subject.title}</option>`;
  });

  // addsubject(f => {
  //   console.log(f);
  //   const optionHTML = `<option value=${f}>${f.title}</option>`;
  //   subjectDd.insertAdjacentHTML("beforeend", optionHTML);
  // });
  
}