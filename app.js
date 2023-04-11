
let msg_array = []
const chatlog = document.getElementById("chatlog");
const industry = document.getElementById("industry")
const message = document.getElementById("message");
const submit = document.getElementById("submit");
const botBtn = [document.getElementById("inpage"), document.getElementById("chatbot")]
const useCaseBtn = [document.getElementById("recruit"), document.getElementById("faq"), document.getElementById("support"), document.getElementById("lead")]
const toneBtn = [document.getElementById("funny"), document.getElementById("helpful"), document.getElementById("professional")]
const userChoice = {}

const sendUserChoice = () => {
    fetch("http://localhost:3000/choices", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
            userChoice
        })
        }).then((res) => res.json())
        .then((data) => {
            console.log(data)
  })
}

//don't look at this mess, i should've used radio buttons instead of doing this foreach loop monstrosity :'))
const allButtons = [botBtn, useCaseBtn, toneBtn]
allButtons.forEach(group => { 
group.forEach(button => {
  button.addEventListener('click', () => {
    button.classList.add('bg-black');
    button.classList.add('text-white');

    group.forEach(otherButton => {
      if (otherButton !== button) {
        otherButton.classList.remove('bg-black');
        otherButton.classList.remove('text-white');
      }
    });
  });
});

})

//func works but is wet, refactor to make sense
const rememberUserChoice = (key, button) => {
    button.addEventListener("click", (e) => {
    e.preventDefault();
    //for running in nodejs
    userChoice[key] = button.innerText;
    //for running in the browser w/ sessiondata
    window.sessionStorage.setItem(key, btoa(button.innerText));
    }
)}


botBtn.forEach((button) => rememberUserChoice("bot", button));
useCaseBtn.forEach((button) => rememberUserChoice("useCase", button));
toneBtn.forEach((button) => rememberUserChoice("tone", button));


submit.addEventListener("click", (e) => {
  userChoice["industry"] = industry.value
//for sending values to nodejs
sendUserChoice();

e.preventDefault();
const msg = message.value;
const newMsg = {"role": "user", "content": `${msg}`}
msg_array.push(newMsg)
message.value = "";
const msgElement = document.createElement("div");
msgElement.classList.add(["message", "message-sent"]);
msgElement.innerHTML = `<div class="msg-text">${msg}</div>`;

  chatlog.appendChild(msgElement);
  chatlog.scrollTop = chatlog.scrollHeight;
    fetch("http://localhost:3000/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
          msg_array
      })
    })
      .then((res) => res.json())
      .then((data) => {
      console.log(data)
      const reply = data.completion.content
      let newMsg = {"role": "assistant", "content": `${reply}`}
      msg_array.push(newMsg)
      const msgElement = document.createElement("div");
      msgElement.classList.add(["message", "message-received"]);
      msgElement.innerHTML = `<div class="msg-text my-5 font-semibold">${reply}</div>`;
      chatlog.appendChild(msgElement);
      chatlog.scrollTop = chatlog.scrollHeight;
    const regex = /\[(.*?)\]/
      if (reply.match(regex)){
        console.log("JSON FOUND YAY")
      }
      });
  
});