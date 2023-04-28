let msg_array = []
const chatlog = document.getElementById("chatlog");
const industry = document.getElementById("industry")

const add = document.getElementById("add")
const end = document.getElementById("end")
const start = document.getElementById("start")
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
}

const copyToClip = (regex, string, parent) => {

  const copyString = string.match(regex)
  const copyButton = document.createElement("button")
  copyButton.textContent = "Copy to clipboard";
  parent.appendChild(copyButton)
  /*   copyButton.scrollTop = parent.scrollHeight
   */
  const classesToAdd = ["w-1/2", "mx-auto", "transition", "duration-300", "ease-in-out", "rounded-3xl", "p-2", "hover:bg-blue-400", "hover:text-white", "mx-5", "my-2"]
  classesToAdd.forEach(cls => {
    copyButton.classList.add(cls)
  })
  copyButton.addEventListener("click", () => {
    navigator.clipboard.writeText(copyString)
    const copiedText = document.createElement("p")
    copiedText.innerHTML = "Copied! Now just paste into the Bot Builder!"
    chatlog.appendChild(copiedText)
  })
  return copyString
}


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

const rememberUserChoice = (key, button) => {
  button.addEventListener("click", (e) => {
    e.preventDefault();
    //for running in node
    userChoice[key] = button.innerText;
    //for running in the browser w/ sessiondata
    window.sessionStorage.setItem(key, button.innerText);
  })
}

allButtons.forEach(group => {
  group.forEach(element => {
    rememberUserChoice(element.name, element)
  });
})


submit.addEventListener("click", function handleclickSubmit(e) {
  userChoice["industry"] = industry.value
  userChoice["additional"] = add.value
  if (!choiceSent) {
    sendUserChoice()
    choiceSent = true
  }
  e.preventDefault();
  const msg = message.value;
  const newMsg = {
    "role": "user",
    "content": `${msg}`
  }
  /* msg_array.push(newMsg) */
  message.value = "";
  const msgElement = document.createElement("div");
  msgElement.classList.add(["message", "message-sent"]);
  msgElement.innerHTML = `<div class="msg-text">${msg}</div>`;

  chatlog.appendChild(msgElement);
  /*   chatlog.scrollTop = chatlog.scrollHeight;
   */
  fetch("http://localhost:3000/discussion", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: newMsg
      })
    })
    .then((res) => res.json())
    .then((data) => {
      const reply = data.completion
      console.log(reply)

      let regex = /([\d]+\. )(.*?)(?=([\d]+\.)|($))/gs
      let matches = reply.match(regex)
      let number = 0
      console.log(matches)
      const createPoint = (str) => {
        const msgElement = document.createElement("div");
        msgElement.className = "msg-text transition ease-in-out hover:scale-105 active:scale-110 active:shadow-[0_35px_60px_-15px_rgba(0,0,0,0.7)] border border-black p-2 rounded-3xl bg-gray-200 flex flex-row m-5 discussionpoint md:mx-8 font-semibold"
        chatlog.appendChild(msgElement);
        msgElement.innerHTML = `<p class="w-5/6">${str}</p><button class="${number} my-2 w-1/6 mx-5 hover:text-white hover:bg-blue-400 p-2 rounded-3xl ease-in-out duration-300 transition max-h-24 my-auto " id="deletebutton">Delete node</button>`
        number++
        const deleteButton = msgElement.querySelector("button")
        deleteButton.addEventListener("click", (e) => {
          e.preventDefault
          msgElement.parentNode.removeChild(msgElement);
        })
        chatlog.scrollTop = chatlog.scrollHeight;
        window.scrollTo(0, document.body.scrollHeight)
      }
      matches.forEach(str => createPoint(str))
    });
  submit.removeEventListener("click", handleclickSubmit)
  submit.addEventListener("click", () => {
    const msgElement = document.createElement("div");
    msgElement.className = "msg-text transition ease-in-out hover:scale-105 active:scale-110 active:shadow-[0_35px_60px_-15px_rgba(0,0,0,0.7)] border border-black p-2 rounded-3xl bg-gray-200 flex flex-row m-5 discussionpoint md:mx-8 font-semibold"
    chatlog.appendChild(msgElement);
    msgElement.innerHTML = `<p class="w-5/6">${message.value}</p><button class="my-2 w-1/6 mx-5 hover:text-white hover:bg-blue-400 p-2 rounded-3xl ease-in-out duration-300 transition max-h-24 my-auto" id="deletebutton">Delete node</button>`
    message.value = ""
    const deleteButton = msgElement.querySelector("button")
    deleteButton.addEventListener("click", (e) => {
      e.preventDefault
      msgElement.parentNode.removeChild(msgElement);
    })
  })
  const generate = document.getElementById("generatebox")
  const generateBtn = document.createElement('button')
  generateBtn.textContent = 'Generate Bot'
  const classesToAdd = ["w-1/2", "mx-auto", "transition", "duration-300", "ease-in-out", "rounded", "p-2", "hover:bg-blue-400", "hover:text-white", "mx-5", "my-2"]
  classesToAdd.forEach(cls => {
    generateBtn.classList.add(cls)
  })
  generate.appendChild(generateBtn)
  const pointsArray = []
  generateBtn.addEventListener("click", async (e) => {
    e.preventDefault
    const points = document.querySelectorAll('div.discussionpoint')
    points.forEach(point => {
      pointsArray.push(point.textContent.replace(/[0-9]\./g, "\n"))
    })

    fetch("http://localhost:3000/bot", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: pointsArray
        })
      })
      .then((res) => res.json())
      .then((data) => {
        console.log(data)
        if (data.hasOwnProperty("final") && data.final === true) {
          const reply = data.completion
          const msgElement = document.createElement("div");
          msgElement.classList.add(["message", "message-received"]);
          const remove = copyToClip(regex, reply, chatlog)
          msgElement.innerHTML = `<div class="msg-text m-5 md:mx-8 font-semibold">${reply.replace(remove, "").replace(/'{2,3}/g, "")}</div>`
        } else {
          const reply = "Error on GPT's end. Please retry."
          const msgElement = document.createElement("div");
          msgElement.classList.add(["message", "message-received"]);
          const remove = copyToClip(regex, reply, chatlog)
          msgElement.innerHTML = `<div class="msg-text m-5 md:mx-8 font-semibold">${reply.replace(remove, "").replace(/'{2,3}/g, "")}</div>`
        }
      })
  })
})