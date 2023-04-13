
let msg_array = []
const chatlog = document.getElementById("chatlog");
const industry = document.getElementById("industry")
const addchoiceSent= document.getElementById("add")
const message = document.getElementById("message");
const submit = document.getElementById("submit");
const botBtn = [document.getElementById("inpage"), document.getElementById("chatbot")]
const useCaseBtn = [document.getElementById("recruit"), document.getElementById("faq"), document.getElementById("support"), document.getElementById("lead")]
const toneBtn = [document.getElementById("funny"), document.getElementById("helpful"), document.getElementById("professional")]
const userChoice = {}
const regex = /\{.+\}/gs
let choiceSent = false


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
            
  })
}

const copyToClip = (regex, string, parent) => {
  
        const copyString = string.match(regex)
        const copyButton = document.createElement("button")
        copyButton.textContent = "Copy to clipboard";
        parent.appendChild(copyButton)
        copyButton.scrollTop = parent.scrollHeight
        const classesToAdd = ["w-1/2", "mx-auto", "transition", "duration-300", "ease-in-out", "rounded", "p-2", "hover:bg-blue-400", "hover:text-white", "mx-5", "my-2"]
        classesToAdd.forEach(cls => {
          copyButton.classList.add(cls)
        })
        copyButton.addEventListener("click", () => {
          navigator.clipboard.writeText(copyString)
          const copiedText = document.createElement("p")
          copiedText.innerHTML = "Copied! Now just paste into the Bot Builder!"
          chatlog.appendChild(copiedText)
          return copyString
        })
      }

//callback mess, shouldve used radio buttons instead :') 
//makes sure only one button of a buttongroup is toggled
const allButtons = [botBtn, useCaseBtn, toneBtn]
allButtons.forEach(group => { 
group.forEach(button => {
  button.addEventListener('click', () => {
    button.classList.add('bg-black');
    button.classList.add('text-white');
    choiceSent = false

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
    //for running in node
    userChoice[key] = button.innerText;
    //for running in the browser w/ sessiondata
    window.sessionStorage.setItem(key, button.innerText);
    }
)}

allButtons.forEach(group => {
  group.forEach(element => {
    rememberUserChoice(element.name, element)
  });
})



submit.addEventListener("click", (e) => {
  userChoice["industry"] = industry.value
  userChoice["additional"] = add.value

//for sending choices to BE
if(!choiceSent){
  sendUserChoice()
  choiceSent = true
}
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
      
      const reply = data.completion.content
      let newMsg = {"role": "assistant", "content": `${reply}`}
      msg_array.push(newMsg)
      const msgElement = document.createElement("div");
      msgElement.classList.add(["message", "message-received"]);
      msgElement.innerHTML = `<div class="msg-text m-5 md:mx-8 font-semibold">${reply}</div>`;
      chatlog.appendChild(msgElement);
      chatlog.scrollTop = chatlog.scrollHeight;
      window.scrollTo(0, document.body.scrollHeight)
      if (reply.match(regex)){
        copyToClip(regex, reply, chatlog)
      }
      });
  
});