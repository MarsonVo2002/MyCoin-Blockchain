const enterPw = document.querySelector("#enter_pw"),
pwShow = document.querySelector(".show"),
alertIcon = document.querySelector(".error"),
alertText= document.querySelector(".text"),
submitBtn = document.querySelector("#button");
input = document.querySelector("#fromAddress");
pwShow.addEventListener("click", ()=>{
  if((enterPw.type === "password")){
    enterPw.type = "text";
    pwShow.classList.replace("fa-eye-slash","fa-eye");
  }else {
    enterPw.type = "password";
    pwShow.classList.replace("fa-eye","fa-eye-slash");
  }
});
enterPw.addEventListener("input", ()=>{
  let val = enterPw.value.trim()
  if(val.length >= 8){
    submitBtn.removeAttribute("disabled");
    submitBtn.classList.add("active");
  }else {
    submitBtn.setAttribute("disabled", true);
    submitBtn.classList.remove("active");
    alertText.style.color = "#a6a6a6";
    alertText.innerText = "Enter at least 8 characters";
    alertIcon.style.display = "none";
  }
});
submitBtn.addEventListener("click", ()=>{
    const fileInput = document.getElementById("upload");
    const file = fileInput.files[0];

    if (!file) {
        alert("Please select a file to upload.");
        return;
    }

    const reader = new FileReader();
    reader.onload = function(event) {
        const fileContent = event.target.result;
        try {
            const jsonData = JSON.parse(fileContent);
            const password = enterPw.value;
            if (password === jsonData.password) {
                // Password matches, redirect to other page
                sessionStorage.setItem("privateKey", jsonData.privateKey);
                sessionStorage.setItem("publicKey", jsonData.publicKey);
                console.log(jsonData.privateKey)
                window.location.href = "dashboard.html";
                
            } else {
                alert("Incorrect password. Please try again.");
            }
        } catch (error) {
            console.error("Error parsing JSON:", error);
            alert("Error parsing JSON. Please try again.");
        }
    };

    reader.readAsText(file);
});

